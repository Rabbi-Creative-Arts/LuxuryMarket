import { describe, expect, it } from "vitest";
import { Prisma } from "@prisma/client";

import { createInMemoryDb } from "../../../../tests/helpers/in-memory-db";
import { FINANCIAL_REFERENCES, MARKETPLACE_ACCOUNTS, sellerAvailablePayableCode } from "../index";
import { LedgerService } from "../services/ledger.service";
import { SellerBalanceService } from "../services/seller-balance.service";
import { SellerEarningService } from "../services/seller-earning.service";

async function setup() {
  const db = createInMemoryDb();
  const ledger = new LedgerService();
  const earnings = new SellerEarningService();
  const balances = new SellerBalanceService();
  return { db, ledger, earnings, balances };
}

const oneItem = (overrides: { orderItemId: string; gross?: string }) => ({
  orderItemId: overrides.orderItemId,
  sellerBrandId: "brand_a",
  sellerBrandName: "Brand A",
  sellerUserId: "owner_a",
  grossAmount: overrides.gross ?? "100000.00",
  commissionRate: "3",
});

describe("Phase 3 — seller balance read model & reconciliation", () => {
  it("projects PENDING earnings into pendingAmount after recognition", async () => {
    const { db, earnings, balances } = await setup();

    await earnings.recognizeForOrder(db, { orderId: "o1", items: [oneItem({ orderItemId: "i1" })] });

    const balance = await balances.get(db, "brand_a");
    expect(balance?.pendingAmount.toFixed(2)).toBe("97000.00");
    expect(balance?.availableAmount.toFixed(2)).toBe("0.00");
    expect(balance?.lifetimeEarnings.toFixed(2)).toBe("97000.00");
  });

  it("reconciles after release: pending decreases, available increases, ledger agrees", async () => {
    const { db, earnings, balances } = await setup();

    const { earnings: recognized } = await earnings.recognizeForOrder(db, {
      orderId: "o1",
      items: [oneItem({ orderItemId: "i1" })],
    });

    await earnings.release(db, recognized[0].id);

    const result = await balances.reconcile(db, "brand_a");
    expect(result.balance.pendingAmount.toFixed(2)).toBe("0.00");
    expect(result.balance.availableAmount.toFixed(2)).toBe("97000.00");
    expect(result.ledgerConsistent).toBe(true);
    expect(result.ledger.pendingPayableCredit.toFixed(2)).toBe("0.00");
    expect(result.ledger.availablePayableCredit.toFixed(2)).toBe("97000.00");
  });

  it("reconciles after payout: available zeroed, paid recorded, ledger agrees", async () => {
    const { db, earnings, balances } = await setup();

    const { earnings: recognized } = await earnings.recognizeForOrder(db, {
      orderId: "o1",
      items: [oneItem({ orderItemId: "i1" })],
    });

    await earnings.release(db, recognized[0].id);
    await earnings.markPaid(db, recognized[0].id);

    const result = await balances.reconcile(db, "brand_a");
    expect(result.balance.availableAmount.toFixed(2)).toBe("0.00");
    expect(result.balance.paidAmount.toFixed(2)).toBe("97000.00");
    expect(result.balance.lifetimeEarnings.toFixed(2)).toBe("97000.00");
    expect(result.ledgerConsistent).toBe(true);
  });

  it("supports NEGATIVE seller balances (signed Decimal, never clamped to zero)", async () => {
    const { db, ledger, earnings, balances } = await setup();

    // Recognize, release and pay out one earning.
    const r = await earnings.recognizeForOrder(db, {
      orderId: "o1",
      items: [
        oneItem({ orderItemId: "i1", gross: "100000.00" }),
        { ...oneItem({ orderItemId: "i2", gross: "50000.00" }) },
      ],
    });
    await earnings.release(db, r.earnings[0].id);
    await earnings.release(db, r.earnings[1].id);
    await earnings.markPaid(db, r.earnings[0].id); // pays 97,000

    // Record an additional manual payout of 200,000 against the seller's
    // available account (an admin correction / overpayment). Balanced:
    //   DEBIT  Seller Available Payable 200,000
    //   CREDIT Clearing                200,000
    await ledger.postTransaction(db, {
      reference: FINANCIAL_REFERENCES.manualAdjustment("brand_a:overpayment"),
      type: "MANUAL_ADJUSTMENT",
      description: "Manual overpayment correction",
      brandId: "brand_a",
      lines: [
        { accountCode: sellerAvailablePayableCode("brand_a"), direction: "DEBIT", amount: "200000.00" },
        { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "CREDIT", amount: "200000.00" },
      ],
    });

    const result = await balances.reconcile(db, "brand_a");

    // Available account: credits 145,500 (2 earnings released) - debits
    // (97,000 payout + 200,000 manual) = -151,500. Negative and preserved.
    expect(result.ledger.availablePayableCredit.toFixed(2)).toBe("-151500.00");
    expect(result.balance.availableAmount.toFixed(2)).toBe("-151500.00");
    expect(result.balance.availableAmount.isNegative()).toBe(true);
    expect(result.balance.netAmount.toFixed(2)).toBe("-151500.00");
  });

  it("reconciliation recomputes truth and repairs a tampered cached projection", async () => {
    const { db, earnings, balances } = await setup();

    await earnings.recognizeForOrder(db, { orderId: "o1", items: [oneItem({ orderItemId: "i1" })] });

    // Tamper with the cached projection (simulate drift/corruption).
    await db.sellerBalance.upsert({
      where: { sellerBrandId: "brand_a" },
      create: {
        sellerBrandId: "brand_a",
        sellerBrandName: "Brand A",
        sellerUserId: "owner_a",
        pendingAmount: new Prisma.Decimal("1.00"),
        availableAmount: new Prisma.Decimal("0.00"),
        paidAmount: new Prisma.Decimal("0.00"),
        reversedAmount: new Prisma.Decimal("0.00"),
        netAmount: new Prisma.Decimal("0.00"),
        lifetimeEarnings: new Prisma.Decimal("0.00"),
      },
      update: { pendingAmount: new Prisma.Decimal("1.00") },
    });

    // Reconcile recomputes from the ledger and repairs the drift.
    const repaired = await balances.reconcile(db, "brand_a");
    expect(repaired.balance.pendingAmount.toFixed(2)).toBe("97000.00");
    expect(repaired.ledgerConsistent).toBe(true);
  });

  it("audit: multi-seller order — every transaction balances, references unique & idempotent-shaped", async () => {
    const { db, ledger, earnings, balances } = await setup();

    await earnings.recognizeForOrder(db, {
      orderId: "o_audit",
      items: [
        {
          orderItemId: "i_a",
          sellerBrandId: "brand_a",
          sellerBrandName: "Brand A",
          sellerUserId: "owner_a",
          grossAmount: "100000.00",
          commissionRate: "3",
        },
        {
          orderItemId: "i_b",
          sellerBrandId: "brand_b",
          sellerBrandName: "Brand B",
          sellerUserId: "owner_b",
          grossAmount: "250000.00",
          commissionRate: "10",
        },
      ],
    });

    const references = db.ledgerTransaction.rows.map((t) => t.reference);
    expect(new Set(references).size).toBe(references.length);
    for (const reference of references) {
      expect(reference).toMatch(/^TXN:ORDER:o_audit:BRAND:.+:SETTLE$/);
      const verification = await ledger.verifyTransaction(db, reference);
      expect(verification.balanced).toBe(true);
    }

    for (const brandId of ["brand_a", "brand_b"]) {
      const result = await balances.reconcile(db, brandId);
      expect(result.ledgerConsistent).toBe(true);
    }

    // Brand B: 250,000 × 10% = 25,000 commission → 225,000 earning
    const balanceB = await balances.get(db, "brand_b");
    expect(balanceB?.pendingAmount.toFixed(2)).toBe("225000.00");
  });

  it("reversal removes the earning from the seller's balance and stays ledger-consistent", async () => {
    const { db, earnings, balances } = await setup();

    const { earnings: recognized } = await earnings.recognizeForOrder(db, {
      orderId: "o1",
      items: [oneItem({ orderItemId: "i1" })],
    });

    await earnings.reverse(db, recognized[0].id, "order cancelled");

    const result = await balances.reconcile(db, "brand_a");
    expect(result.balance.pendingAmount.toFixed(2)).toBe("0.00");
    expect(result.balance.reversedAmount.toFixed(2)).toBe("97000.00");
    expect(result.balance.lifetimeEarnings.toFixed(2)).toBe("0.00");
    expect(result.ledgerConsistent).toBe(true);
  });
});
