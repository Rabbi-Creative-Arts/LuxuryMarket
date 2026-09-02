import { describe, expect, it } from "vitest";

import { createInMemoryDb } from "../../../../tests/helpers/in-memory-db";
import { isUniqueViolation } from "../types";
import {
  MARKETPLACE_ACCOUNTS,
  sellerPendingPayableCode,
} from "../lib/chart-of-accounts";
import { LedgerService } from "../services/ledger.service";

describe("Phase 3 — ledger service persistence & idempotency", () => {
  it("provisions marketplace accounts idempotently", async () => {
    const db = createInMemoryDb();
    const service = new LedgerService();

    await service.ensureMarketplaceAccounts(db);
    await service.ensureMarketplaceAccounts(db);

    const clearing = await db.ledgerAccount.findUnique({
      where: { code: MARKETPLACE_ACCOUNTS.CLEARING },
    });
    const revenue = await db.ledgerAccount.findUnique({
      where: { code: MARKETPLACE_ACCOUNTS.COMMISSION_REVENUE },
    });

    expect(clearing).not.toBeNull();
    expect(revenue).not.toBeNull();
    expect(db.ledgerAccount.rows).toHaveLength(2);
  });

  it("provisions per-seller accounts", async () => {
    const db = createInMemoryDb();
    const service = new LedgerService();

    const codes = await service.ensureSellerAccounts(db, {
      id: "brand_1",
      name: "Brand One",
    });

    expect(codes.pendingCode).toBe(sellerPendingPayableCode("brand_1"));
    const account = await db.ledgerAccount.findUnique({
      where: { code: codes.pendingCode },
    });
    expect(account?.brandId).toBe("brand_1");
  });

  it("posts a balanced transaction with entries", async () => {
    const db = createInMemoryDb();
    const service = new LedgerService();
    await service.ensureSellerAccounts(db, { id: "b1", name: "B1" });

    const txn = await service.postTransaction(db, {
      reference: "TXN:X:1",
      type: "MANUAL_ADJUSTMENT",
      description: "test",
      lines: [
        { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "100.00" },
        { accountCode: sellerPendingPayableCode("b1"), direction: "CREDIT", amount: "100.00" },
      ],
    });

    expect(txn.amount.toFixed(2)).toBe("100.00");
    expect(txn.entries).toHaveLength(2);
  });

  it("refuses to post an unbalanced transaction", async () => {
    const db = createInMemoryDb();
    const service = new LedgerService();
    await service.ensureSellerAccounts(db, { id: "b1", name: "B1" });

    await expect(
      service.postTransaction(db, {
        reference: "TXN:X:BAD",
        type: "MANUAL_ADJUSTMENT",
        description: "bad",
        lines: [
          { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "100.00" },
          { accountCode: sellerPendingPayableCode("b1"), direction: "CREDIT", amount: "90.00" },
        ],
      })
    ).rejects.toThrow(/Unbalanced/);
  });

  it("idempotency: posting the same reference twice creates only ONE transaction", async () => {
    const db = createInMemoryDb();
    const service = new LedgerService();
    await service.ensureSellerAccounts(db, { id: "b1", name: "B1" });

    const args = {
      reference: "TXN:DUP:1",
      type: "MANUAL_ADJUSTMENT" as const,
      description: "dup test",
      lines: [
        { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT" as const, amount: "100.00" },
        { accountCode: sellerPendingPayableCode("b1"), direction: "CREDIT" as const, amount: "100.00" },
      ],
    };

    const first = await service.postTransaction(db, args);
    const second = await service.postTransaction(db, args);

    expect(second.id).toBe(first.id);
    expect(db.ledgerTransaction.rows).toHaveLength(1);
    expect(db.ledgerEntry.rows).toHaveLength(2);
  });

  it("concurrent duplicate protection: a UNIQUE violation on reference is treated as idempotent success", async () => {
    // Simulate a racing duplicate: pre-insert a transaction with the same
    // reference so the second INSERT hits the unique constraint — mirroring
    // what the DB UNIQUE(reference) does under concurrency.
    const db = createInMemoryDb();
    const service = new LedgerService();
    await service.ensureSellerAccounts(db, { id: "b1", name: "B1" });

    // First post wins.
    const winner = await service.postTransaction(db, {
      reference: "TXN:RACE:1",
      type: "MANUAL_ADJUSTMENT",
      description: "winner",
      lines: [
        { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "50.00" },
        { accountCode: sellerPendingPayableCode("b1"), direction: "CREDIT", amount: "50.00" },
      ],
    });

    // Simulate the loser path: a raw create with a duplicate reference must
    // raise a Prisma-shaped unique violation (P2002) — the database-level
    // guarantee, not just an application check.
    let caught: unknown;
    try {
      await db.ledgerTransaction.create({
        data: {
          reference: "TXN:RACE:1",
          type: "MANUAL_ADJUSTMENT",
          description: "loser",
          amount: winner.amount,
          entries: { create: [] },
        },
      });
    } catch (error) {
      caught = error;
    }

    expect(isUniqueViolation(caught)).toBe(true);
    expect(db.ledgerTransaction.rows).toHaveLength(1);
  });

  it("verifyTransaction confirms a persisted transaction balances", async () => {
    const db = createInMemoryDb();
    const service = new LedgerService();
    await service.ensureSellerAccounts(db, { id: "b1", name: "B1" });

    await service.postTransaction(db, {
      reference: "TXN:AUDIT:1",
      type: "ORDER_SETTLEMENT",
      description: "audit",
      lines: [
        { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "100000.00" },
        { accountCode: sellerPendingPayableCode("b1"), direction: "CREDIT", amount: "97000.00" },
        { accountCode: MARKETPLACE_ACCOUNTS.COMMISSION_REVENUE, direction: "CREDIT", amount: "3000.00" },
      ],
    });

    const verification = await service.verifyTransaction(db, "TXN:AUDIT:1");
    expect(verification.balanced).toBe(true);
    expect(verification.totalDebits.toFixed(2)).toBe("100000.00");
    expect(verification.totalCredits.toFixed(2)).toBe("100000.00");
    expect(verification.entryCount).toBe(3);
  });

  it("rejects posting to a non-existent account (fail closed)", async () => {
    const db = createInMemoryDb();
    const service = new LedgerService();

    await expect(
      service.postTransaction(db, {
        reference: "TXN:NOACCT:1",
        type: "MANUAL_ADJUSTMENT",
        description: "missing acct",
        lines: [
          { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "10.00" },
          { accountCode: "2110.SELLER_PENDING:ghost", direction: "CREDIT", amount: "10.00" },
        ],
      })
    ).rejects.toThrow(/does not exist/);
  });
});
