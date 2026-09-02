/**
 * Phase 3 — Financial Foundation: double-entry posting builder (pure).
 *
 * This module contains NO database access. It constructs balanced
 * double-entry transactions and refuses anything that does not balance.
 * The ledger service persists the output of these builders.
 *
 * Invariants enforced:
 *  - Every transaction has at least one debit and one credit.
 *  - Total debits === total credits, exactly (Decimal, 2dp).
 *  - No entry may be zero or negative.
 *  - Entry directions are explicit; callers never "infer" a sign.
 */

import type { LedgerDirection, LedgerTransactionType } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { addMoney, assertSumsToZero, toMoney } from "./money";

export interface PostingLine {
  /** Chart-of-accounts code (see chart-of-accounts.ts). */
  accountCode: string;
  direction: LedgerDirection;
  amount: Prisma.Decimal | string | number;
}

export interface BalancedTransactionDraft {
  reference: string;
  type: LedgerTransactionType;
  description: string;
  amount: Prisma.Decimal;
  lines: Array<{
    accountCode: string;
    direction: LedgerDirection;
    amount: Prisma.Decimal;
  }>;
  orderId?: string | null;
  sellerEarningId?: string | null;
  brandId?: string | null;
  reversalOfId?: string | null;
  createdBy?: string | null;
}

/**
 * Build a balanced transaction draft from posting lines.
 * Throws if the transaction is unbalanced, has no entries, has no
 * debit/credit pair, or contains a non-positive amount.
 */
export function buildBalancedTransaction(input: {
  reference: string;
  type: LedgerTransactionType;
  description: string;
  orderId?: string | null;
  sellerEarningId?: string | null;
  brandId?: string | null;
  reversalOfId?: string | null;
  createdBy?: string | null;
  lines: PostingLine[];
}): BalancedTransactionDraft {
  if (!input.reference || input.reference.trim() === "") {
    throw new Error("Ledger transaction requires a unique reference.");
  }

  if (!input.lines || input.lines.length < 2) {
    throw new Error(
      `Ledger transaction ${input.reference} must have at least two entries (debit and credit).`
    );
  }

  const lines = input.lines.map((line) => {
    const amount = toMoney(line.amount);

    if (amount.lessThanOrEqualTo(0)) {
      throw new Error(
        `Ledger entry amount must be positive (got ${amount.toFixed(2)} on ${line.accountCode}).`
      );
    }

    if (line.direction !== "DEBIT" && line.direction !== "CREDIT") {
      throw new Error(`Ledger entry direction must be DEBIT or CREDIT.`);
    }

    return {
      accountCode: line.accountCode,
      direction: line.direction,
      amount,
    };
  });

  const debits = lines.filter((line) => line.direction === "DEBIT");
  const credits = lines.filter((line) => line.direction === "CREDIT");

  if (debits.length === 0 || credits.length === 0) {
    throw new Error(
      `Ledger transaction ${input.reference} must contain both debits and credits.`
    );
  }

  const totalDebits = debits.reduce<Prisma.Decimal>(
    (acc, line) => addMoney(acc, line.amount),
    new Prisma.Decimal(0)
  );

  const totalCredits = credits.reduce<Prisma.Decimal>(
    (acc, line) => addMoney(acc, line.amount),
    new Prisma.Decimal(0)
  );

  // Double-entry invariant: DEBITS === CREDITS.
  // We verify both as direct equality and via the signed-sum assertion
  // (debits positive, credits negative) so imbalance cannot slip through.
  if (!totalDebits.equals(totalCredits)) {
    throw new Error(
      `Unbalanced ledger transaction ${input.reference}: ` +
        `debits ${totalDebits.toFixed(2)} != credits ${totalCredits.toFixed(2)}`
    );
  }

  assertSumsToZero([
    ...debits.map((line) => line.amount),
    ...credits.map((line) => new Prisma.Decimal(line.amount).negated()),
  ]);

  return {
    reference: input.reference,
    type: input.type,
    description: input.description,
    amount: totalDebits,
    lines,
    orderId: input.orderId ?? null,
    sellerEarningId: input.sellerEarningId ?? null,
    brandId: input.brandId ?? null,
    reversalOfId: input.reversalOfId ?? null,
    createdBy: input.createdBy ?? null,
  };
}

/** Convenience: debit + one or more credits for the same total. */
export function debitCredit(input: {
  reference: string;
  type: LedgerTransactionType;
  description: string;
  debit: Omit<PostingLine, "direction">;
  credit: Omit<PostingLine, "direction"> | Array<Omit<PostingLine, "direction">>;
  orderId?: string | null;
  sellerEarningId?: string | null;
  brandId?: string | null;
  reversalOfId?: string | null;
  createdBy?: string | null;
}): BalancedTransactionDraft {
  const creditLines = Array.isArray(input.credit) ? input.credit : [input.credit];

  return buildBalancedTransaction({
    reference: input.reference,
    type: input.type,
    description: input.description,
    orderId: input.orderId,
    sellerEarningId: input.sellerEarningId,
    brandId: input.brandId,
    reversalOfId: input.reversalOfId,
    createdBy: input.createdBy,
    lines: [
      { ...input.debit, direction: "DEBIT" as LedgerDirection },
      ...creditLines.map((line) => ({
        ...line,
        direction: "CREDIT" as LedgerDirection,
      })),
    ],
  });
}
