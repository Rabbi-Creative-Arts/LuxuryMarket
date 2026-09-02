/**
 * Phase 3 — Financial Foundation: seller earning service.
 *
 * One SellerEarning row per order item (idempotent on `orderItemId`).
 * Lifecycle:
 *
 *   PENDING ──release──▶ AVAILABLE ──markPaid──▶ PAID
 *      │                    │
 *      └──────reverse───────┴──────────────▶ REVERSED
 *
 *  - PAID earnings cannot be reversed here (claw-back belongs to the
 *    future dispute/refund domain — Phase 4, intentionally NOT built).
 *  - Every transition posts a balanced, idempotent ledger transaction.
 *  - No payout provider is invoked; `markPaid` only RECORDS the payout.
 */

import type { SellerEarning } from "@prisma/client";
import { Prisma } from "@prisma/client";

import type { LedgerTransactionWithEntries } from "../types";

import {
  MARKETPLACE_ACCOUNTS,
  sellerAvailablePayableCode,
  sellerPendingPayableCode,
} from "../lib/chart-of-accounts";
import {
  buildBalancedTransaction,
  type BalancedTransactionDraft,
} from "../lib/ledger-posting";
import { earningFor, commissionFor, toMoney } from "../lib/money";
import { FINANCIAL_REFERENCES } from "../lib/references";
import { isUniqueViolation, type FinanceDb } from "../types";
import { ledgerService } from "./ledger.service";
import { sellerBalanceService } from "./seller-balance.service";

/**
 * A seller-attributed order item ready for financial recognition.
 * Produced by the order service snapshot at checkout.
 */
export interface OrderItemFinancialInput {
  orderItemId: string;
  sellerBrandId: string;
  sellerBrandName: string;
  sellerUserId: string | null;
  grossAmount: Prisma.Decimal | string | number;
  commissionRate: Prisma.Decimal | string | number;
}

export class SellerEarningService {
  /**
   * Recognize earnings for a set of order items (one order, possibly
   * multiple sellers). Idempotent:
   *  - SellerEarning is unique on `orderItemId` (database constraint).
   *  - The settlement ledger transaction is unique on
   *    `orderSettlement(orderId, brandId)`.
   * Re-running for the same order items creates no duplicate money.
   */
  async recognizeForOrder(
    db: FinanceDb,
    input: {
      orderId: string;
      currency?: string;
      items: OrderItemFinancialInput[];
      createdBy?: string | null;
    }
  ): Promise<{
    earnings: SellerEarning[];
    transactions: LedgerTransactionWithEntries[];
  }> {
    const currency = input.currency ?? "NGN";

    const earnings: SellerEarning[] = [];
    const transactions: LedgerTransactionWithEntries[] = [];

    // Group items by seller so a multi-seller order produces one settlement
    // posting per seller.
    const bySeller = new Map<
      string,
      { brandName: string; sellerUserId: string | null; items: Array<OrderItemFinancialInput & {
        commissionAmount: Prisma.Decimal;
        earningAmount: Prisma.Decimal;
      }> }
    >();

    for (const item of input.items) {
      const gross = toMoney(item.grossAmount);
      const commissionAmount = commissionFor(gross, item.commissionRate);
      const earningAmount = earningFor(gross, item.commissionRate);

      // Invariant: gross === commission + earning (no cent drift).
      if (!commissionAmount.plus(earningAmount).equals(gross)) {
        throw new Error(
          `Commission/earning split does not reconcile for item ${item.orderItemId}.`
        );
      }

      const group =
        bySeller.get(item.sellerBrandId) ??
        {
          brandName: item.sellerBrandName,
          sellerUserId: item.sellerUserId,
          items: [],
        };

      group.items.push({ ...item, grossAmount: gross, commissionAmount, earningAmount });
      bySeller.set(item.sellerBrandId, group);

      // Create the earning row (idempotent on orderItemId).
      const earning = await this.upsertEarning(db, {
        orderId: input.orderId,
        orderItemId: item.orderItemId,
        sellerBrandId: item.sellerBrandId,
        sellerBrandName: item.sellerBrandName,
        sellerUserId: item.sellerUserId,
        commissionRate: new Prisma.Decimal(item.commissionRate),
        grossAmount: gross,
        commissionAmount,
        earningAmount,
        currency,
      });

      earnings.push(earning);
    }

    // One settlement posting per seller.
    for (const [brandId, group] of bySeller) {
      await ledgerService.ensureSellerAccounts(db, {
        id: brandId,
        name: group.brandName,
      });

      const totalGross = group.items.reduce(
        (acc, line) => acc.plus(toMoney(line.grossAmount)),
        new Prisma.Decimal(0)
      );

      const totalCommission = group.items.reduce(
        (acc, line) => acc.plus(line.commissionAmount),
        new Prisma.Decimal(0)
      );

      const totalEarning = group.items.reduce(
        (acc, line) => acc.plus(line.earningAmount),
        new Prisma.Decimal(0)
      );

      const sellerEarningId = group.items[0]
        ? earnings.find((e) => e.orderItemId === group.items[0].orderItemId)?.id
        : undefined;

      // Double-entry settlement:
      //   DEBIT  Clearing (cash in)                = gross
      //   CREDIT Seller Pending Payable            = earning
      //   CREDIT Marketplace Commission Revenue    = commission
      const draft = buildBalancedTransaction({
        reference: FINANCIAL_REFERENCES.orderSettlement(input.orderId, brandId),
        type: "ORDER_SETTLEMENT",
        description: `Order settlement for ${group.brandName} (order ${input.orderId})`,
        orderId: input.orderId,
        sellerEarningId: sellerEarningId ?? null,
        brandId,
        createdBy: input.createdBy ?? null,
        lines: [
          {
            accountCode: MARKETPLACE_ACCOUNTS.CLEARING,
            direction: "DEBIT",
            amount: totalGross,
          },
          {
            accountCode: sellerPendingPayableCode(brandId),
            direction: "CREDIT",
            amount: totalEarning,
          },
          {
            accountCode: MARKETPLACE_ACCOUNTS.COMMISSION_REVENUE,
            direction: "CREDIT",
            amount: totalCommission,
          },
        ],
      });

      const transaction = await ledgerService.postDraft(db, draft);
      transactions.push(transaction);
    }

    // Refresh the cached seller balance projection.
    for (const brandId of bySeller.keys()) {
      await sellerBalanceService.reconcile(db, brandId);
    }

    return { earnings, transactions };
  }

  /**
   * Move an earning from PENDING to AVAILABLE.
   * Posts a liability reclassification (Pending -> Available payable).
   * Idempotent: an already-AVAILABLE earning returns its existing posting.
   */
  async release(
    db: FinanceDb,
    earningId: string
  ): Promise<{ earning: SellerEarning; transaction: LedgerTransactionWithEntries }> {
    const earning = await this.getOrThrow(db, earningId);

    if (earning.status === "AVAILABLE") {
      const existing = await this.findPostedTransaction(
        db,
        FINANCIAL_REFERENCES.earningRelease(earningId)
      );
      if (existing) return { earning, transaction: existing };
    }

    if (earning.status !== "PENDING") {
      throw new InvalidEarningTransitionError(
        earning.status,
        "release",
        "Only PENDING earnings can be released to AVAILABLE."
      );
    }

    const brandId = earning.sellerBrandId;

    await ledgerService.ensureSellerAccounts(db, {
      id: brandId,
      name: earning.sellerBrandName,
    });

    const draft: BalancedTransactionDraft = buildBalancedTransaction({
      reference: FINANCIAL_REFERENCES.earningRelease(earningId),
      type: "EARNING_RELEASE",
      description: `Release earning ${earningId} to available balance`,
      orderId: earning.orderId,
      sellerEarningId: earning.id,
      brandId,
      lines: [
        {
          accountCode: sellerPendingPayableCode(brandId),
          direction: "DEBIT",
          amount: earning.earningAmount,
        },
        {
          accountCode: sellerAvailablePayableCode(brandId),
          direction: "CREDIT",
          amount: earning.earningAmount,
        },
      ],
    });

    const transaction = await ledgerService.postDraft(db, draft);

    const updated = await db.sellerEarning.update({
      where: { id: earningId },
      data: { status: "AVAILABLE", releasedAt: new Date() },
    });

    await sellerBalanceService.reconcile(db, brandId);

    return { earning: updated, transaction };
  }

  /**
   * Record an AVAILABLE earning as paid. NO provider/payout integration —
   * this only posts the ledger movement and updates status.
   * Idempotent: an already-PAID earning returns its existing posting.
   */
  async markPaid(
    db: FinanceDb,
    earningId: string
  ): Promise<{ earning: SellerEarning; transaction: LedgerTransactionWithEntries }> {
    const earning = await this.getOrThrow(db, earningId);

    if (earning.status === "PAID") {
      const existing = await this.findPostedTransaction(
        db,
        FINANCIAL_REFERENCES.earningPayout(earningId)
      );
      if (existing) return { earning, transaction: existing };
    }

    if (earning.status !== "AVAILABLE") {
      throw new InvalidEarningTransitionError(
        earning.status,
        "markPaid",
        "Only AVAILABLE earnings can be marked PAID."
      );
    }

    const brandId = earning.sellerBrandId;

    await ledgerService.ensureSellerAccounts(db, {
      id: brandId,
      name: earning.sellerBrandName,
    });

    // Double-entry payout (recorded only):
    //   DEBIT  Seller Available Payable = earning (liability settled)
    //   CREDIT Clearing                 = earning (cash out)
    const draft = buildBalancedTransaction({
      reference: FINANCIAL_REFERENCES.earningPayout(earningId),
      type: "SELLER_PAYOUT",
      description: `Record payout for earning ${earningId}`,
      orderId: earning.orderId,
      sellerEarningId: earning.id,
      brandId,
      lines: [
        {
          accountCode: sellerAvailablePayableCode(brandId),
          direction: "DEBIT",
          amount: earning.earningAmount,
        },
        {
          accountCode: MARKETPLACE_ACCOUNTS.CLEARING,
          direction: "CREDIT",
          amount: earning.earningAmount,
        },
      ],
    });

    const transaction = await ledgerService.postDraft(db, draft);

    const updated = await db.sellerEarning.update({
      where: { id: earningId },
      data: { status: "PAID", paidAt: new Date() },
    });

    await sellerBalanceService.reconcile(db, brandId);

    return { earning: updated, transaction };
  }

  /**
   * Reverse a PENDING or AVAILABLE earning (refund/cancellation/correction).
   * PAID earnings cannot be reversed here. Idempotent on the reversal
   * reference.
   */
  async reverse(
    db: FinanceDb,
    earningId: string,
    reason?: string
  ): Promise<{ earning: SellerEarning; transaction: LedgerTransactionWithEntries }> {
    const earning = await this.getOrThrow(db, earningId);

    if (earning.status === "REVERSED") {
      const existing = await this.findPostedTransaction(
        db,
        FINANCIAL_REFERENCES.earningReversal(earningId)
      );
      if (existing) return { earning, transaction: existing };
    }

    if (earning.status === "PAID") {
      throw new InvalidEarningTransitionError(
        earning.status,
        "reverse",
        "PAID earnings cannot be reversed directly; use the dispute/refund process (not part of Phase 3)."
      );
    }

    if (earning.status !== "PENDING" && earning.status !== "AVAILABLE") {
      throw new InvalidEarningTransitionError(
        earning.status,
        "reverse",
        "Only PENDING or AVAILABLE earnings can be reversed."
      );
    }

    const brandId = earning.sellerBrandId;

    await ledgerService.ensureSellerAccounts(db, {
      id: brandId,
      name: earning.sellerBrandName,
    });

    // Reverse the original settlement for this earning:
    //   DEBIT  Seller payable (Pending or Available)   = earning
    //   DEBIT  Marketplace Commission Revenue          = commission
    //   CREDIT Clearing                                = gross
    //
    // This takes the earning OUT of the seller's payable position and
    // reverses the commission the marketplace recognized. If the seller's
    // available balance is smaller than this earning (e.g. earlier payout),
    // the balance projection is allowed to go NEGATIVE.
    const payableCode =
      earning.status === "PENDING"
        ? sellerPendingPayableCode(brandId)
        : sellerAvailablePayableCode(brandId);

    const reversalReference = FINANCIAL_REFERENCES.earningReversal(earningId);

    const originalSettlement = await db.ledgerTransaction.findFirst({
      where: {
        orderId: earning.orderId,
        brandId,
        type: "ORDER_SETTLEMENT",
      },
    });

    const draft = buildBalancedTransaction({
      reference: reversalReference,
      type: "EARNING_REVERSAL",
      description: `Reverse earning ${earningId}${reason ? `: ${reason}` : ""}`,
      orderId: earning.orderId,
      sellerEarningId: earning.id,
      brandId,
      reversalOfId: originalSettlement?.id ?? null,
      lines: [
        {
          accountCode: payableCode,
          direction: "DEBIT",
          amount: earning.earningAmount,
        },
        {
          accountCode: MARKETPLACE_ACCOUNTS.COMMISSION_REVENUE,
          direction: "DEBIT",
          amount: earning.commissionAmount,
        },
        {
          accountCode: MARKETPLACE_ACCOUNTS.CLEARING,
          direction: "CREDIT",
          amount: earning.grossAmount,
        },
      ],
    });

    const transaction = await ledgerService.postDraft(db, draft);

    const updated = await db.sellerEarning.update({
      where: { id: earningId },
      data: {
        status: "REVERSED",
        reversedAt: new Date(),
        reversalReference,
      },
    });

    await sellerBalanceService.reconcile(db, brandId);

    return { earning: updated, transaction };
  }

  // ============================================
  // Internal helpers
  // ============================================

  private async upsertEarning(
    db: FinanceDb,
    data: {
      orderId: string;
      orderItemId: string;
      sellerBrandId: string;
      sellerBrandName: string;
      sellerUserId: string | null;
      commissionRate: Prisma.Decimal;
      grossAmount: Prisma.Decimal;
      commissionAmount: Prisma.Decimal;
      earningAmount: Prisma.Decimal;
      currency: string;
    }
  ): Promise<SellerEarning> {
    try {
      return await db.sellerEarning.create({ data });
    } catch (error) {
      if (isUniqueViolation(error)) {
        // Earning already recognized for this order item — idempotent return.
        const existing = await db.sellerEarning.findUnique({
          where: { orderItemId: data.orderItemId },
        });
        if (existing) return existing;
      }
      throw error;
    }
  }

  private async getOrThrow(db: FinanceDb, earningId: string): Promise<SellerEarning> {
    const earning = await db.sellerEarning.findUnique({
      where: { id: earningId },
    });

    if (!earning) {
      throw new Error(`SellerEarning not found: ${earningId}`);
    }

    return earning;
  }

  private async findPostedTransaction(
    db: FinanceDb,
    reference: string
  ): Promise<LedgerTransactionWithEntries | null> {
    return db.ledgerTransaction.findUnique({
      where: { reference },
      include: { entries: true },
    });
  }
}

export class InvalidEarningTransitionError extends Error {
  constructor(
    public readonly fromStatus: string,
    public readonly action: string,
    message: string
  ) {
    super(message);
    this.name = "InvalidEarningTransitionError";
  }
}

export const sellerEarningService = new SellerEarningService();
