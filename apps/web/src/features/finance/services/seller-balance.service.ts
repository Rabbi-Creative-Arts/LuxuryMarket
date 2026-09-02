/**
 * Phase 3 — Financial Foundation: seller balance read model.
 *
 * SellerBalance is a CACHED PROJECTION. The ledger is the source of truth.
 * This service recomputes the projection and cross-checks two independent
 * derivations against each other:
 *
 *  1. Ledger view — net CREDIT balance on the seller's Pending and Available
 *     payable accounts (credits minus debits, signed Decimal).
 *  2. Earnings view — aggregate of SellerEarning rows by status.
 *
 * Both must agree (`ledgerConsistent`). The ledger view is authoritative for
 * the *currently* payable positions, including balances that legitimately go
 * NEGATIVE (e.g. a reversal/debit posted when no credit is available). The
 * stored projection never clamps to zero.
 */

import type { SellerBalance } from "@prisma/client";
import { Prisma } from "@prisma/client";

import {
  sellerAvailablePayableCode,
  sellerPendingPayableCode,
} from "../lib/chart-of-accounts";
import { toMoney } from "../lib/money";
import { isUniqueViolation, type FinanceDb } from "../types";

export interface ReconciliationResult {
  balance: SellerBalance;
  /** True when the earnings view matches the ledger payable accounts. */
  ledgerConsistent: boolean;
  ledger: {
    pendingPayableCredit: Prisma.Decimal;
    availablePayableCredit: Prisma.Decimal;
  };
  earningsView: {
    pending: Prisma.Decimal;
    available: Prisma.Decimal;
    paid: Prisma.Decimal;
    reversed: Prisma.Decimal;
  };
}

export class SellerBalanceService {
  /**
   * Recompute the SellerBalance for a brand from the LEDGER (authoritative
   * for payable positions) and persist it (upsert on sellerBrandId).
   * Also aggregates earnings for the lifetime figures and consistency check.
   */
  async reconcile(db: FinanceDb, brandId: string): Promise<ReconciliationResult> {
    // ---- Ledger view (source of truth, signed) ----
    const ledger = await this.ledgerPayableBalances(db, brandId);

    // ---- Earnings view (aggregated status totals) ----
    const earnings = await db.sellerEarning.findMany({
      where: { sellerBrandId: brandId },
    });

    const zero = new Prisma.Decimal(0);

    const sumByStatus = (status: string) =>
      earnings
        .filter((e) => e.status === status)
        .reduce((acc, e) => acc.plus(toMoney(e.earningAmount)), zero);

    const pendingEarnings = sumByStatus("PENDING");
    const availableEarnings = sumByStatus("AVAILABLE");
    const paidEarnings = sumByStatus("PAID");
    const reversedEarnings = sumByStatus("REVERSED");

    // The payable positions are the ledger's signed balances — these can be
    // negative and must be preserved as-is.
    const pendingAmount = toMoney(ledger.pendingPayableCredit);
    const availableAmount = toMoney(ledger.availablePayableCredit);

    // Net currently owed/(overdrawn) position. Negative means the ledger
    // shows a net debit on the payable accounts (seller owes back).
    const netAmount = toMoney(pendingAmount.plus(availableAmount));

    const lifetimeEarnings = toMoney(
      pendingEarnings.plus(availableEarnings).plus(paidEarnings)
    );

    const ledgerConsistent =
      pendingAmount.equals(toMoney(pendingEarnings)) &&
      availableAmount.equals(toMoney(availableEarnings));

    const sample = earnings[0];
    const sellerBrandName = sample?.sellerBrandName ?? brandId;
    const sellerUserId = sample?.sellerUserId ?? null;

    const data = {
      sellerBrandName,
      sellerUserId,
      pendingAmount,
      availableAmount,
      paidAmount: toMoney(paidEarnings),
      reversedAmount: toMoney(reversedEarnings),
      netAmount,
      lifetimeEarnings,
      lastReconciledAt: new Date(),
    };

    let balance: SellerBalance;

    try {
      balance = await db.sellerBalance.upsert({
        where: { sellerBrandId: brandId },
        create: { sellerBrandId: brandId, currency: "NGN", ...data },
        update: data,
      });
    } catch (error) {
      if (isUniqueViolation(error)) {
        balance = await db.sellerBalance.findUniqueOrThrow({
          where: { sellerBrandId: brandId },
        });
      } else {
        throw error;
      }
    }

    return {
      balance,
      ledgerConsistent,
      ledger: {
        pendingPayableCredit: pendingAmount,
        availablePayableCredit: availableAmount,
      },
      earningsView: {
        pending: toMoney(pendingEarnings),
        available: toMoney(availableEarnings),
        paid: toMoney(paidEarnings),
        reversed: toMoney(reversedEarnings),
      },
    };
  }

  /**
   * Net CREDIT balance of a seller's two payable accounts, computed straight
   * from the immutable ledger entries. Credit-normal liability accounts:
   *   balance = sum(credits) − sum(debits).
   * May return a NEGATIVE Decimal (net debit position).
   */
  async ledgerPayableBalances(
    db: FinanceDb,
    brandId: string
  ): Promise<{
    pendingPayableCredit: Prisma.Decimal;
    availablePayableCredit: Prisma.Decimal;
  }> {
    const codes = [
      sellerPendingPayableCode(brandId),
      sellerAvailablePayableCode(brandId),
    ];

    const accounts = await db.ledgerAccount.findMany({
      where: { code: { in: codes } },
      include: { entries: true },
    });

    const zero = new Prisma.Decimal(0);

    const netCredit = (code: string): Prisma.Decimal => {
      const account = accounts.find((a) => a.code === code);
      if (!account) return zero;

      return (account.entries ?? []).reduce((acc, entry) => {
        const amount = toMoney(entry.amount);
        return entry.direction === "CREDIT" ? acc.plus(amount) : acc.minus(amount);
      }, zero);
    };

    return {
      pendingPayableCredit: netCredit(sellerPendingPayableCode(brandId)),
      availablePayableCredit: netCredit(sellerAvailablePayableCode(brandId)),
    };
  }

  /** Read the cached balance for a seller (null if never reconciled). */
  async get(db: FinanceDb, brandId: string): Promise<SellerBalance | null> {
    return db.sellerBalance.findUnique({ where: { sellerBrandId: brandId } });
  }
}

export const sellerBalanceService = new SellerBalanceService();
