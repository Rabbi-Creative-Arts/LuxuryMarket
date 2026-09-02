/**
 * In-memory fake of the Prisma models used by the finance feature.
 *
 * It implements ONLY the surface in the FinanceDb port, but mirrors the
 * database constraints the Phase 3 migration installs:
 *
 *  - UNIQUE columns raise a Prisma-shaped P2002 error.
 *  - Writes apply immediately (services receive this same object across
 *    what would be transaction boundaries, simulating one serializable
 *    transaction).
 *
 * This lets behavioral tests run without PostgreSQL while still exercising
 * idempotency and duplicate protection.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";

import type { FinanceDb } from "../../src/features/finance/types";

type Row = any;

class UniqueViolation extends Error {
  code = "P2002";
  constructor(target: string) {
    super(`Unique constraint failed on the constraint: ${target}`);
    this.name = "PrismaClientKnownRequestError";
  }
}

let counter = 0;
function id(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter.toString().padStart(6, "0")}`;
}

/** Deep clone preserving Decimal and Date instances. */
function clone(value: any): any {
  if (value === null || value === undefined) return value;
  if (value instanceof Prisma.Decimal) {
    return new Prisma.Decimal(value.toString());
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (Array.isArray(value)) {
    return value.map((item) => clone(item));
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = clone(item);
    }
    return out;
  }
  return value;
}

export type InMemoryDb = FinanceDb & {
  ledgerAccount: FinanceDb["ledgerAccount"] & { rows: Row[] };
  ledgerTransaction: FinanceDb["ledgerTransaction"] & { rows: Row[] };
  ledgerEntry: FinanceDb["ledgerEntry"] & { rows: Row[] };
  sellerEarning: FinanceDb["sellerEarning"] & { rows: Row[] };
  sellerBalance: FinanceDb["sellerBalance"] & { rows: Row[] };
};

export function createInMemoryDb(): InMemoryDb {
  const ledgerAccountRows: Row[] = [];
  const ledgerTransactionRows: Row[] = [];
  const ledgerEntryRows: Row[] = [];
  const sellerEarningRows: Row[] = [];
  const sellerBalanceRows: Row[] = [];

  const db = {
    ledgerAccount: {
      rows: ledgerAccountRows,
      async create({ data }: any) {
        const row: Row = {
          id: id("acct"),
          createdAt: new Date(),
          ...clone(data),
        };
        if (ledgerAccountRows.some((r) => r.code === row.code)) {
          throw new UniqueViolation("LedgerAccount_code_key");
        }
        ledgerAccountRows.push(row);
        return clone(row);
      },
      async findUnique({ where }: any) {
        const row = ledgerAccountRows.find(
          (r) =>
            (where.id !== undefined && r.id === where.id) ||
            (where.code !== undefined && r.code === where.code)
        );
        if (!row) return null;
        const result = clone(row);
        if (where.__includeEntries || result.entries) {
          result.entries = ledgerEntryRows.filter((e) => e.accountId === row.id).map((e) => clone(e));
        }
        return result;
      },
      async findMany(args?: any) {
        let rows = ledgerAccountRows;
        if (args?.where?.code?.in) {
          rows = rows.filter((r) => args.where.code.in.includes(r.code));
        }
        return rows.map((r) => {
          const result = clone(r);
          if (args?.include?.entries) {
            result.entries = ledgerEntryRows.filter((e) => e.accountId === r.id).map((e) => clone(e));
          }
          return result;
        });
      },
    },

    ledgerTransaction: {
      rows: ledgerTransactionRows,
      async create({ data, include }: any) {
        const reference: string = data.reference;
        if (ledgerTransactionRows.some((r) => r.reference === reference)) {
          throw new UniqueViolation("LedgerTransaction_reference_key");
        }

        const transactionId = id("txn");
        const row: Row = {
          id: transactionId,
          createdAt: new Date(),
          reference,
          type: data.type,
          description: data.description,
          amount: data.amount,
          currency: data.currency ?? "NGN",
          orderId: data.orderId ?? null,
          sellerEarningId: data.sellerEarningId ?? null,
          brandId: data.brandId ?? null,
          reversalOfId: data.reversalOfId ?? null,
          createdBy: data.createdBy ?? null,
        };
        ledgerTransactionRows.push(row);

        const entries: Row[] = (data.entries?.create ?? []).map((entry: any) => {
          const entryRow = {
            id: id("entry"),
            transactionId,
            accountId: entry.accountId,
            direction: entry.direction,
            amount: entry.amount,
            createdAt: new Date(),
          };
          ledgerEntryRows.push(entryRow);
          return entryRow;
        });

        const result = clone(row);
        if (include?.entries) result.entries = entries.map((e) => clone(e));
        return result;
      },
      async findUnique({ where, include }: any) {
        const row = ledgerTransactionRows.find(
          (r) =>
            (where.id !== undefined && r.id === where.id) ||
            (where.reference !== undefined && r.reference === where.reference)
        );
        if (!row) return null;
        const result = clone(row);
        if (include?.entries) {
          result.entries = ledgerEntryRows
            .filter((e) => e.transactionId === row.id)
            .map((e) => clone(e));
        }
        return result;
      },
      async findFirst({ where }: any) {
        const row = ledgerTransactionRows.find((r) =>
          Object.entries(where).every(([key, value]) => value === undefined || r[key] === value)
        );
        return row ? clone(row) : null;
      },
    },

    ledgerEntry: {
      rows: ledgerEntryRows,
    },

    sellerEarning: {
      rows: sellerEarningRows,
      async create({ data }: any) {
        if (sellerEarningRows.some((r) => r.orderItemId === data.orderItemId)) {
          throw new UniqueViolation("SellerEarning_orderItemId_key");
        }
        const row: Row = {
          id: id("earn"),
          status: "PENDING",
          currency: data.currency ?? "NGN",
          releasedAt: null,
          paidAt: null,
          reversedAt: null,
          reversalReference: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...clone(data),
        };
        sellerEarningRows.push(row);
        return clone(row);
      },
      async findUnique({ where }: any) {
        const row = sellerEarningRows.find(
          (r) =>
            (where.id !== undefined && r.id === where.id) ||
            (where.orderItemId !== undefined && r.orderItemId === where.orderItemId)
        );
        return row ? clone(row) : null;
      },
      async findMany(args?: any) {
        const rows = args?.where
          ? sellerEarningRows.filter((r) =>
              Object.entries(args.where).every(([k, v]) => r[k] === v)
            )
          : sellerEarningRows;
        return rows.map((r) => clone(r));
      },
      async update({ where, data }: any) {
        const index = sellerEarningRows.findIndex((r) => r.id === where.id);
        if (index === -1) throw new Error(`SellerEarning not found: ${where.id as string}`);
        sellerEarningRows[index] = {
          ...sellerEarningRows[index],
          ...clone(data),
          updatedAt: new Date(),
        };
        return clone(sellerEarningRows[index]);
      },
    },

    sellerBalance: {
      rows: sellerBalanceRows,
      async upsert({ where, create, update }: any) {
        const index = sellerBalanceRows.findIndex(
          (r) => r.sellerBrandId === where.sellerBrandId
        );
        if (index === -1) {
          const row: Row = {
            id: id("bal"),
            sellerBrandId: where.sellerBrandId,
            currency: "NGN",
            createdAt: new Date(),
            updatedAt: new Date(),
            ...clone(create),
          };
          if (sellerBalanceRows.some((r) => r.sellerBrandId === row.sellerBrandId)) {
            throw new UniqueViolation("SellerBalance_sellerBrandId_key");
          }
          sellerBalanceRows.push(row);
          return clone(row);
        }
        sellerBalanceRows[index] = {
          ...sellerBalanceRows[index],
          ...clone(update),
          updatedAt: new Date(),
        };
        return clone(sellerBalanceRows[index]);
      },
      async findUnique({ where }: any) {
        const row = sellerBalanceRows.find((r) => r.sellerBrandId === where.sellerBrandId);
        return row ? clone(row) : null;
      },
      async findUniqueOrThrow({ where }: any) {
        const row = sellerBalanceRows.find((r) => r.sellerBrandId === where.sellerBrandId);
        if (!row) throw new Error(`SellerBalance not found: ${where.sellerBrandId as string}`);
        return clone(row);
      },
    },
  };

  return db as unknown as InMemoryDb;
}
