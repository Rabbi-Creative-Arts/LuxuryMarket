import { describe, expect, it } from "vitest";
import { Prisma } from "@prisma/client";

import { createInMemoryDb } from "../../../../tests/helpers/in-memory-db";
import { FINANCIAL_REFERENCES } from "../lib/references";
import {
  InvalidEarningTransitionError,
  SellerEarningService,
} from "../services/seller-earning.service";
import { SellerBalanceService } from "../services/seller-balance.service";
import { LedgerService } from "../services/ledger.service";

async function setupRecognizedOrder(options?: {
  brandId?: string;
  brandName?: string;
  sellerUserId?: string | null;
  rate?: string;
  gross?: string;
  orderItemId?: string;
  orderId?: string;
}) {
  const db = createInMemoryDb();
  const service = new SellerEarningService();

  const brandId = options?.brandId ?? "brand_a";
  const result = await service.recognizeForOrder(db, {
    orderId: options?.orderId ?? "order_1",
    items: [
      {
        orderItemId: options?.orderItemId ?? "item_1",
        sellerBrandId: brandId,
        sellerBrandName: options?.brandName ?? "Brand A",
        sellerUserId: options?.sellerUserId ?? "owner_a",
        grossAmount: options?.gross ?? "100000.00",
        commissionRate: options?.rate ?? "3",
      },
    ],
  });

  return { db, service, earning: result.earnings[0] };
}

describe("Phase 3 — seller earning lifecycle", () => {
  it("recognizes an earning as PENDING with the correct commission split", async () => {
    const { earning } = await setupRecognizedOrder();

    expect(earning.status).toBe("PENDING");
    expect(earning.grossAmount.toFixed(2)).toBe("100000.00");
    expect(earning.commissionAmount.toFixed(2)).toBe("3000.00");
    expect(earning.earningAmount.toFixed(2)).toBe("97000.00");
  });

  it("PENDING -> release -> AVAILABLE posts a balanced reclassification", async () => {
    const { db, service, earning } = await setupRecognizedOrder();

    const { earning: released, transaction } = await service.release(db, earning.id);

    expect(released.status).toBe("AVAILABLE");
    expect(released.releasedAt).not.toBeNull();
    expect(transaction.reference).toBe(
      FINANCIAL_REFERENCES.earningRelease(earning.id)
    );
    expect(transaction.type).toBe("EARNING_RELEASE");

    // Balanced: debit pending == credit available
    const debits = transaction.entries!.filter((e) => e.direction === "DEBIT");
    const credits = transaction.entries!.filter((e) => e.direction === "CREDIT");
    expect(debits).toHaveLength(1);
    expect(credits).toHaveLength(1);
    expect(debits[0].amount.toFixed(2)).toBe("97000.00");
    expect(credits[0].amount.toFixed(2)).toBe("97000.00");
  });

  it("AVAILABLE -> markPaid -> PAID records the payout (no provider)", async () => {
    const { db, service, earning } = await setupRecognizedOrder();
    await service.release(db, earning.id);

    const { earning: paid, transaction } = await service.markPaid(db, earning.id);

    expect(paid.status).toBe("PAID");
    expect(paid.paidAt).not.toBeNull();
    expect(transaction.type).toBe("SELLER_PAYOUT");
    expect(transaction.entries).toHaveLength(2);
  });

  it("PENDING -> reverse -> REVERSED posts the settlement reversal", async () => {
    const { db, service, earning } = await setupRecognizedOrder();

    const { earning: reversed, transaction } = await service.reverse(
      db,
      earning.id,
      "order cancelled"
    );

    expect(reversed.status).toBe("REVERSED");
    expect(reversed.reversedAt).not.toBeNull();
    expect(reversed.reversalReference).toBe(
      FINANCIAL_REFERENCES.earningReversal(earning.id)
    );
    expect(transaction.type).toBe("EARNING_REVERSAL");
    // debit payable (97,000) + debit commission (3,000) == credit clearing (100,000)
    const zero = new Prisma.Decimal(0);
    const totalDebits = transaction.entries!
      .filter((e) => e.direction === "DEBIT")
      .reduce((acc, e) => acc.plus(e.amount), zero);
    const totalCredits = transaction.entries!
      .filter((e) => e.direction === "CREDIT")
      .reduce((acc, e) => acc.plus(e.amount), new Prisma.Decimal(0));
    expect(totalDebits.toFixed(2)).toBe("100000.00");
    expect(totalCredits.toFixed(2)).toBe("100000.00");
  });

  it("AVAILABLE -> reverse -> REVERSED is allowed", async () => {
    const { db, service, earning } = await setupRecognizedOrder();
    await service.release(db, earning.id);

    const { earning: reversed } = await service.reverse(db, earning.id);
    expect(reversed.status).toBe("REVERSED");
  });

  it("INVALID transition: cannot release an AVAILABLE earning again (idempotent replay is fine)", async () => {
    const { db, service, earning } = await setupRecognizedOrder();
    await service.release(db, earning.id);

    // Replay returns the same result (idempotent) — no second transaction.
    const replay = await service.release(db, earning.id);
    expect(replay.earning.status).toBe("AVAILABLE");
    expect(db.ledgerTransaction.rows.filter((t) => t.type === "EARNING_RELEASE")).toHaveLength(1);
  });

  it("INVALID transition: cannot markPaid a PENDING earning", async () => {
    const { db, service, earning } = await setupRecognizedOrder();

    await expect(service.markPaid(db, earning.id)).rejects.toBeInstanceOf(
      InvalidEarningTransitionError
    );
    const refreshed = await db.sellerEarning.findUnique({ where: { id: earning.id } });
    expect(refreshed?.status).toBe("PENDING");
  });

  it("INVALID transition: cannot markPaid a REVERSED earning", async () => {
    const { db, service, earning } = await setupRecognizedOrder();
    await service.reverse(db, earning.id);

    await expect(service.markPaid(db, earning.id)).rejects.toBeInstanceOf(
      InvalidEarningTransitionError
    );
  });

  it("INVALID transition: cannot reverse a PAID earning (clawback is out of Phase 3 scope)", async () => {
    const { db, service, earning } = await setupRecognizedOrder();
    await service.release(db, earning.id);
    await service.markPaid(db, earning.id);

    await expect(service.reverse(db, earning.id)).rejects.toThrow(
      /PAID earnings cannot be reversed/
    );
  });

  it("INVALID transition: cannot release a PAID earning", async () => {
    const { db, service, earning } = await setupRecognizedOrder();
    await service.release(db, earning.id);
    await service.markPaid(db, earning.id);

    await expect(service.release(db, earning.id)).rejects.toBeInstanceOf(
      InvalidEarningTransitionError
    );
  });

  it("idempotency: recognizing the same order item twice creates one earning and one settlement", async () => {
    const db = createInMemoryDb();
    const service = new SellerEarningService();

    const items = [
      {
        orderItemId: "item_1",
        sellerBrandId: "brand_a",
        sellerBrandName: "Brand A",
        sellerUserId: "owner_a",
        grossAmount: "100000.00" as const,
        commissionRate: "3" as const,
      },
    ];

    await service.recognizeForOrder(db, { orderId: "order_1", items });
    await service.recognizeForOrder(db, { orderId: "order_1", items });

    expect(db.sellerEarning.rows).toHaveLength(1);
    expect(
      db.ledgerTransaction.rows.filter((t) => t.type === "ORDER_SETTLEMENT")
    ).toHaveLength(1);
  });

  it("multi-seller order: one settlement posting per seller, each balanced", async () => {
    const db = createInMemoryDb();
    const service = new SellerEarningService();

    await service.recognizeForOrder(db, {
      orderId: "order_multi",
      items: [
        {
          orderItemId: "item_a",
          sellerBrandId: "brand_a",
          sellerBrandName: "Brand A",
          sellerUserId: "owner_a",
          grossAmount: "100000.00",
          commissionRate: "3",
        },
        {
          orderItemId: "item_b",
          sellerBrandId: "brand_b",
          sellerBrandName: "Brand B",
          sellerUserId: "owner_b",
          grossAmount: "200000.00",
          commissionRate: "3",
        },
      ],
    });

    const settlements = db.ledgerTransaction.rows.filter(
      (t) => t.type === "ORDER_SETTLEMENT"
    );
    expect(settlements).toHaveLength(2);

    const ledger = new LedgerService();
    for (const settlement of settlements) {
      const verification = await ledger.verifyTransaction(db, settlement.reference);
      expect(verification.balanced).toBe(true);
    }

    // Both sellers have pending earnings
    const balanceService = new SellerBalanceService();
    const balanceA = await balanceService.get(db, "brand_a");
    const balanceB = await balanceService.get(db, "brand_b");
    expect(balanceA?.pendingAmount.toFixed(2)).toBe("97000.00");
    expect(balanceB?.pendingAmount.toFixed(2)).toBe("194000.00");
  });
});
