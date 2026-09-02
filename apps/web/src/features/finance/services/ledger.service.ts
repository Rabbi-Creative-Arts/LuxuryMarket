/**
 * Phase 3 — Financial Foundation: ledger service.
 *
 * Responsibilities:
 *  - Provision the deterministic chart of accounts (marketplace + per-seller).
 *  - Persist balanced double-entry transactions atomically.
 *  - Enforce idempotency: `LedgerTransaction.reference` is UNIQUE in the
 *    database. A duplicate post (including a racing duplicate) either finds
 *    the existing transaction or hits a unique violation — it NEVER creates
 *    a second money movement.
 *  - Provide audit queries (transaction verification).
 *
 * The ledger is immutable by contract; the Phase 3 migration additionally
 * installs database triggers that reject UPDATE/DELETE on
 * `LedgerTransaction` and `LedgerEntry`.
 */

import { Prisma } from "@prisma/client";
import type { LedgerTransactionWithEntries } from "../types";

import {
  MARKETPLACE_ACCOUNT_SEEDS,
  sellerAccountSeeds,
} from "../lib/chart-of-accounts";
import {
  buildBalancedTransaction,
  type BalancedTransactionDraft,
  type PostingLine,
} from "../lib/ledger-posting";
import { toMoney } from "../lib/money";
import { isUniqueViolation, type FinanceDb } from "../types";

export class LedgerService {
  /**
   * Ensure the marketplace chart of accounts exists.
   * Safe to call repeatedly; idempotent on `code`.
   */
  async ensureMarketplaceAccounts(db: FinanceDb): Promise<void> {
    for (const seed of MARKETPLACE_ACCOUNT_SEEDS) {
      const existing = await db.ledgerAccount.findUnique({
        where: { code: seed.code },
      });

      if (!existing) {
        try {
          await db.ledgerAccount.create({ data: seed });
        } catch (error) {
          // A concurrent provision may have won; that's fine.
          if (!isUniqueViolation(error)) throw error;
        }
      }
    }
  }

  /**
   * Ensure a seller's two payable accounts exist. Idempotent on `code`.
   * Returns their account codes (which are deterministic regardless).
   */
  async ensureSellerAccounts(
    db: FinanceDb,
    brand: { id: string; name: string }
  ): Promise<{ pendingCode: string; availableCode: string }> {
    const seeds = sellerAccountSeeds(brand.id, brand.name);

    for (const seed of seeds) {
      const existing = await db.ledgerAccount.findUnique({
        where: { code: seed.code },
      });

      if (!existing) {
        try {
          await db.ledgerAccount.create({
            data: { ...seed, brandId: brand.id },
          });
        } catch (error) {
          if (!isUniqueViolation(error)) throw error;
        }
      }
    }

    const pendingCode = seeds[0].code;
    const availableCode = seeds[1].code;

    return { pendingCode, availableCode };
  }

  /**
   * Post a balanced double-entry transaction.
   *
   * `reference` is the idempotency key: if a transaction with the same
   * reference already exists it is returned unchanged (whether it was posted
   * earlier in this process or by a concurrent request that won the unique
   * constraint race). The caller never needs to pre-check for duplicates.
   */
  async postTransaction(
    db: FinanceDb,
    input: {
      reference: string;
      type: Parameters<typeof buildBalancedTransaction>[0]["type"];
      description: string;
      lines: PostingLine[];
      orderId?: string | null;
      sellerEarningId?: string | null;
      brandId?: string | null;
      reversalOfId?: string | null;
      createdBy?: string | null;
    }
  ): Promise<LedgerTransactionWithEntries> {
    // Re-balance check at the service boundary (the builder also checks).
    const draft = buildBalancedTransaction(input);

    return this.postDraft(db, draft);
  }

  /**
   * Persist an already-built balanced draft with idempotency handling.
   */
  async postDraft(
    db: FinanceDb,
    draft: BalancedTransactionDraft
  ): Promise<LedgerTransactionWithEntries> {
    // Fast path: already posted (retries after a timeout, replay, etc.).
    const existing = await db.ledgerTransaction.findUnique({
      where: { reference: draft.reference },
      include: { entries: true },
    });

    if (existing) {
      return existing;
    }

    try {
      return await db.ledgerTransaction.create({
        data: {
          reference: draft.reference,
          type: draft.type,
          description: draft.description,
          amount: draft.amount,
          orderId: draft.orderId ?? null,
          sellerEarningId: draft.sellerEarningId ?? null,
          brandId: draft.brandId ?? null,
          reversalOfId: draft.reversalOfId ?? null,
          createdBy: draft.createdBy ?? null,
          entries: {
            create: await this.resolveEntries(db, draft.lines),
          },
        },
        include: { entries: true },
      });
    } catch (error) {
      // Concurrent duplicate lost the UNIQUE(reference) race.
      if (isUniqueViolation(error)) {
        const winner = await db.ledgerTransaction.findUnique({
          where: { reference: draft.reference },
          include: { entries: true },
        });

        if (winner) {
          return winner;
        }
      }

      throw error;
    }
  }

  /**
   * Resolve account codes to account ids, creating marketplace accounts on
   * demand. Seller accounts must be provisioned explicitly via
   * `ensureSellerAccounts` before their codes are referenced.
   */
  private async resolveEntries(
    db: FinanceDb,
    lines: BalancedTransactionDraft["lines"]
  ): Promise<
    Array<{
      accountId: string;
      direction: "DEBIT" | "CREDIT";
      amount: Prisma.Decimal;
    }>
  > {
    await this.ensureMarketplaceAccounts(db);

    const resolved: Array<{
      accountId: string;
      direction: "DEBIT" | "CREDIT";
      amount: Prisma.Decimal;
    }> = [];

    for (const line of lines) {
      const account = await db.ledgerAccount.findUnique({
        where: { code: line.accountCode },
      });

      if (!account) {
        throw new Error(
          `Ledger account "${line.accountCode}" does not exist. Provision seller accounts before posting.`
        );
      }

      resolved.push({
        accountId: account.id,
        direction: line.direction,
        amount: toMoney(line.amount),
      });
    }

    return resolved;
  }

  /**
   * Audit a transaction: re-verify that its persisted entries balance.
   * Returns the totals for reporting.
   */
  async verifyTransaction(
    db: FinanceDb,
    reference: string
  ): Promise<{
    reference: string;
    balanced: boolean;
    totalDebits: Prisma.Decimal;
    totalCredits: Prisma.Decimal;
    entryCount: number;
  }> {
    const transaction = await db.ledgerTransaction.findUnique({
      where: { reference },
      include: { entries: true },
    });

    if (!transaction) {
      throw new Error(`Ledger transaction not found: ${reference}`);
    }

    const entries = transaction.entries ?? [];
    const zero = new Prisma.Decimal(0);

    const totalDebits = entries
      .filter((entry) => entry.direction === "DEBIT")
      .reduce((acc, entry) => acc.plus(toMoney(entry.amount)), zero);

    const totalCredits = entries
      .filter((entry) => entry.direction === "CREDIT")
      .reduce((acc, entry) => acc.plus(toMoney(entry.amount)), zero);

    return {
      reference,
      balanced: totalDebits.equals(totalCredits),
      totalDebits,
      totalCredits,
      entryCount: entries.length,
    };
  }
}

export const ledgerService = new LedgerService();
