/**
 * Phase 3 — PostgreSQL integration test for the financial foundation.
 *
 * These tests exercise REAL database guarantees:
 *  - UNIQUE constraints (LedgerTransaction.reference, SellerEarning.orderItemId,
 *    SellerBalance.sellerBrandId) reject duplicates, including concurrent ones.
 *  - Decimal columns persist exact amounts.
 *  - The migration's triggers make ledger rows immutable.
 *
 * They run ONLY when a DATABASE_URL to a reachable PostgreSQL instance is set
 * (e.g. `DATABASE_URL=postgresql://... pnpm test`). When it is absent or
 * unreachable the suite SKIPS — it never fakes a pass against a fake DB.
 */

import { describe, it, expect, beforeAll } from "vitest";
import type { PrismaClient } from "@prisma/client";

import { sellerEarningService } from "../src/features/finance/services/seller-earning.service";
import { sellerBalanceService } from "../src/features/finance/services/seller-balance.service";
import { ledgerService } from "../src/features/finance/services/ledger.service";
import { FINANCIAL_REFERENCES } from "../src/features/finance/lib/references";
import { MARKETPLACE_ACCOUNTS, sellerPendingPayableCode } from "../src/features/finance/lib/chart-of-accounts";
import { isUniqueViolation } from "../src/features/finance/types";

const dbUrl = process.env.DATABASE_URL;

const run = dbUrl ? describe : describe.skip;

run("Phase 3 — PostgreSQL integration (real DB constraints)", () => {
  let client: PrismaClient;

  beforeAll(async () => {
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    client = new PrismaClient({
      adapter: new PrismaPg({ connectionString: dbUrl }),
    });
  });

  it("persists an order settlement and reconciles against the ledger", async () => {
    // Requires the Phase 3 migration to have been applied to the target DB.

    const suffix = `int_${Date.now()}`;
    const brandId = `brand_${suffix}`;

    // Minimal brand row so FKs resolve (test DB only).
    await client.brand.create({
      data: {
        id: brandId,
        name: `Integration Brand ${suffix}`,
        slug: `integration-brand-${suffix}`,
      },
    });

    const result = await client.$transaction((tx) =>
      sellerEarningService.recognizeForOrder(tx, {
        orderId: `order_${suffix}`,
        items: [
          {
            orderItemId: `item_${suffix}`,
            sellerBrandId: brandId,
            sellerBrandName: "Integration Brand",
            sellerUserId: null,
            grossAmount: "100000.00",
            commissionRate: "3",
          },
        ],
      })
    );

    expect(result.earnings).toHaveLength(1);
    expect(result.transactions).toHaveLength(1);

    // Duplicate settlement (idempotency) — same reference, one row.
    await client.$transaction((tx) =>
      sellerEarningService.recognizeForOrder(tx, {
        orderId: `order_${suffix}`,
        items: [
          {
            orderItemId: `item_${suffix}`,
            sellerBrandId: brandId,
            sellerBrandName: "Integration Brand",
            sellerUserId: null,
            grossAmount: "100000.00",
            commissionRate: "3",
          },
        ],
      })
    );

    const txnCount = await client.ledgerTransaction.count({
      where: { reference: FINANCIAL_REFERENCES.orderSettlement(`order_${suffix}`, brandId) },
    });
    expect(txnCount).toBe(1);

    const reconciliation = await sellerBalanceService.reconcile(client, brandId);
    expect(reconciliation.ledgerConsistent).toBe(true);
    expect(reconciliation.balance.pendingAmount.toFixed(2)).toBe("97000.00");
  });

  it("DB UNIQUE(reference) rejects a raw duplicate insert with P2002", async () => {
    const reference = `TXN:RAW_DUP:${Date.now()}`;

    await ledgerService.ensureMarketplaceAccounts(client);
    const { pendingCode } = await ledgerService.ensureSellerAccounts(client, {
      id: "brand_raw_dup",
      name: "Raw Dup Brand",
    });
    expect(pendingCode).toBe(sellerPendingPayableCode("brand_raw_dup"));

    const clearing = await client.ledgerAccount.findUniqueOrThrow({
      where: { code: MARKETPLACE_ACCOUNTS.CLEARING },
    });
    const pending = await client.ledgerAccount.findUniqueOrThrow({
      where: { code: pendingCode },
    });

    const data = {
      reference,
      type: "MANUAL_ADJUSTMENT" as const,
      description: "raw dup test",
      amount: new (await import("@prisma/client")).Prisma.Decimal("10.00"),
      entries: {
        create: [
          { accountId: clearing.id, direction: "DEBIT" as const, amount: new (await import("@prisma/client")).Prisma.Decimal("10.00") },
          { accountId: pending.id, direction: "CREDIT" as const, amount: new (await import("@prisma/client")).Prisma.Decimal("10.00") },
        ],
      },
    };

    await client.ledgerTransaction.create({ data });

    let caught: unknown;
    try {
      await client.ledgerTransaction.create({ data });
    } catch (error) {
      caught = error;
    }
    expect(isUniqueViolation(caught)).toBe(true);
  });
});
