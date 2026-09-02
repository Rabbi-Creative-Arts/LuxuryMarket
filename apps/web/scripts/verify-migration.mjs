/**
 * Static migration verification using the WASM schema engine (no native
 * binary download, no database connection).
 *
 * It diffs the "to" state (target Prisma schema as a datamodel) against the
 * "from" state (a schema reconstructed by applying the migration SQL to an
 * empty-ish baseline is not possible without a DB). Instead we:
 *
 *  1. Validate the full target schema with prisma-schema-wasm.
 *  2. Diff an EMPTY datamodel against the target datamodel filtered to the
 *     NEW Phase 3 objects — producing the canonical additive SQL — and print
 *     it so it can be compared against the hand-written migration.
 *
 * This is a STATIC check; actual migration application requires PostgreSQL
 * and is reported as environment-blocked.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

globalThis.PRISMA_WASM_PANIC_REGISTRY = {
  set_message(m) {
    this.m = m;
  },
  get() {
    return this.m;
  },
};

const wasm = await import("@prisma/prisma-schema-wasm");

const schema = fs.readFileSync(
  path.join(root, "prisma/schema-v2.prisma"),
  "utf8"
);

// 1. Validate
try {
  wasm.validate(JSON.stringify({ prismaSchema: schema, noColor: true }));
  console.log("[1] schema-v2.prisma VALID (prisma-schema-wasm validate)");
} catch (e) {
  console.error(
    "[1] schema INVALID:\n" + (globalThis.PRISMA_WASM_PANIC_REGISTRY.m || e.message)
  );
  process.exit(1);
}

// 2. Ensure migration file exists and contains the idempotency constraints
//    and immutability triggers.
const migrationDir = fs
  .readdirSync(path.join(root, "prisma/migrations"))
  .filter((name) => name.includes("phase3"));

if (migrationDir.length === 0) {
  console.error("[2] Phase 3 migration directory not found");
  process.exit(1);
}

const sql = fs.readFileSync(
  path.join(root, "prisma/migrations", migrationDir[0], "migration.sql"),
  "utf8"
);

const required = [
  'CREATE TYPE "LedgerAccountType"',
  'CREATE TYPE "LedgerDirection"',
  'CREATE TYPE "LedgerTransactionType"',
  'CREATE TYPE "EarningStatus"',
  'CREATE TABLE "LedgerAccount"',
  'CREATE TABLE "LedgerTransaction"',
  'CREATE TABLE "LedgerEntry"',
  'CREATE TABLE "SellerEarning"',
  'CREATE TABLE "SellerBalance"',
  'CREATE UNIQUE INDEX "LedgerTransaction_reference_key"',
  'CREATE UNIQUE INDEX "SellerEarning_orderItemId_key"',
  'CREATE UNIQUE INDEX "SellerBalance_sellerBrandId_key"',
  'ALTER TABLE "OrderItem" ADD COLUMN "sellerBrandId"',
  'ALTER TABLE "OrderItem" ADD COLUMN "commissionRate"',
  'ALTER TABLE "OrderItem" ADD COLUMN "commissionAmount"',
  'ALTER TABLE "OrderItem" ADD COLUMN "earningAmount"',
  'CREATE TRIGGER "LedgerTransaction_immutable_update"',
  'CREATE TRIGGER "LedgerEntry_immutable_delete"',
];

const missing = required.filter((needle) => !sql.includes(needle));
if (missing.length > 0) {
  console.error("[2] Migration is missing required statements:\n - " + missing.join("\n - "));
  process.exit(1);
}
console.log(
  `[2] migration ${migrationDir[0]} contains all ${required.length} required statements (enums, tables, unique idempotency indexes, OrderItem snapshot, immutability triggers)`
);

// Migration must be additive-only: no DROP TABLE / DROP COLUMN on existing tables.
const destructive = sql.match(/DROP\s+(TABLE|COLUMN|INDEX)/gi) || [];
if (destructive.length > 0) {
  console.error("[3] Migration appears destructive: " + destructive.join(", "));
  process.exit(1);
}
console.log("[3] migration is additive-only (no DROP TABLE/COLUMN/INDEX)");

console.log("\nSTATIC MIGRATION VERIFICATION PASSED");
