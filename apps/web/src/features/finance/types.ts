/**
 * Phase 3 — Financial Foundation: database port.
 *
 * Finance services depend only on the Prisma model methods they actually
 * use, expressed as a structural interface. Both `PrismaClient` and
 * `Prisma.TransactionClient` satisfy it (so order checkout passes its `tx`),
 * and the in-memory fake used by unit tests satisfies it too.
 *
 * Method inputs are intentionally permissive (the services pass fully-formed
 * Prisma payloads); return types are concrete rows.
 */

import type {
  LedgerAccount,
  LedgerEntry,
  LedgerTransaction,
  SellerBalance,
  SellerEarning,
} from "@prisma/client";

export type LedgerAccountWithEntries = LedgerAccount & {
  entries?: LedgerEntry[];
};

export type LedgerTransactionWithEntries = LedgerTransaction & {
  entries?: LedgerEntry[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FinanceDb {
  ledgerAccount: {
    create(args: { data: any; include?: any }): Promise<LedgerAccount>;
    findUnique(args: { where: any; include?: any }): Promise<LedgerAccountWithEntries | null>;
    findMany(args?: { where?: any; include?: any }): Promise<LedgerAccountWithEntries[]>;
  };

  ledgerTransaction: {
    create(args: { data: any; include?: any }): Promise<LedgerTransactionWithEntries>;
    findUnique(args: { where: any; include?: any }): Promise<LedgerTransactionWithEntries | null>;
    findFirst(args: { where: any }): Promise<LedgerTransaction | null>;
  };

  // Entries are read via account/transaction includes only; no direct
  // delegate methods are used by finance services (permissive object type
  // satisfied by both PrismaClient and the in-memory fake).
  ledgerEntry: { [key: string]: any } | Record<string, unknown>;

  sellerEarning: {
    create(args: { data: any }): Promise<SellerEarning>;
    findUnique(args: { where: any }): Promise<SellerEarning | null>;
    findMany(args?: { where?: any }): Promise<SellerEarning[]>;
    update(args: { where: any; data: any }): Promise<SellerEarning>;
  };

  sellerBalance: {
    upsert(args: { where: any; create: any; update: any }): Promise<SellerBalance>;
    findUnique(args: { where: any }): Promise<SellerBalance | null>;
    findUniqueOrThrow(args: { where: any }): Promise<SellerBalance>;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Prisma unique-constraint violation code. */
export const PRISMA_UNIQUE_CONSTRAINT = "P2002";

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === PRISMA_UNIQUE_CONSTRAINT
  );
}
