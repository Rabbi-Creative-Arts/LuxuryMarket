--
-- Phase 3: Financial Foundation
--
-- ADDITIVE ONLY. This migration never drops, alters, or resets existing
-- marketplace tables/columns. All new OrderItem columns are nullable or have
-- defaults so existing OrderItem rows remain valid.
--

-- ============================================
-- Enums
-- ============================================

-- CreateEnum
CREATE TYPE "LedgerAccountType" AS ENUM ('ASSET', 'LIABILITY', 'REVENUE', 'EXPENSE', 'EQUITY');

-- CreateEnum
CREATE TYPE "LedgerDirection" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "LedgerTransactionType" AS ENUM ('ORDER_SETTLEMENT', 'EARNING_RELEASE', 'SELLER_PAYOUT', 'EARNING_REVERSAL', 'MANUAL_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'AVAILABLE', 'PAID', 'REVERSED');

-- ============================================
-- LedgerAccount
-- ============================================

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LedgerAccountType" NOT NULL,
    "normalDirection" "LedgerDirection" NOT NULL,
    "brandId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LedgerAccount_code_key" ON "LedgerAccount"("code");

-- CreateIndex
CREATE INDEX "LedgerAccount_brandId_idx" ON "LedgerAccount"("brandId");

-- CreateIndex
CREATE INDEX "LedgerAccount_type_idx" ON "LedgerAccount"("type");

-- ============================================
-- LedgerTransaction
-- ============================================

-- CreateTable
CREATE TABLE "LedgerTransaction" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "LedgerTransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "orderId" TEXT,
    "sellerEarningId" TEXT,
    "brandId" TEXT,
    "reversalOfId" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerTransaction_pkey" PRIMARY KEY ("id")
);

-- DB-level idempotency: a duplicated financial reference can never create a
-- second money movement, even under concurrent requests.
-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_reference_key" ON "LedgerTransaction"("reference");

-- CreateIndex
CREATE INDEX "LedgerTransaction_orderId_idx" ON "LedgerTransaction"("orderId");

-- CreateIndex
CREATE INDEX "LedgerTransaction_sellerEarningId_idx" ON "LedgerTransaction"("sellerEarningId");

-- CreateIndex
CREATE INDEX "LedgerTransaction_brandId_idx" ON "LedgerTransaction"("brandId");

-- CreateIndex
CREATE INDEX "LedgerTransaction_type_idx" ON "LedgerTransaction"("type");

-- CreateIndex
CREATE INDEX "LedgerTransaction_createdAt_idx" ON "LedgerTransaction"("createdAt");

-- ============================================
-- LedgerEntry
-- ============================================

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "direction" "LedgerDirection" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LedgerEntry_transactionId_idx" ON "LedgerEntry"("transactionId");

-- CreateIndex
CREATE INDEX "LedgerEntry_accountId_idx" ON "LedgerEntry"("accountId");

-- ============================================
-- SellerEarning
-- ============================================

-- CreateTable
CREATE TABLE "SellerEarning" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sellerBrandId" TEXT NOT NULL,
    "sellerBrandName" TEXT NOT NULL,
    "sellerUserId" TEXT,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "grossAmount" DECIMAL(14,2) NOT NULL,
    "commissionAmount" DECIMAL(14,2) NOT NULL,
    "earningAmount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "status" "EarningStatus" NOT NULL DEFAULT 'PENDING',
    "releasedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "reversedAt" TIMESTAMP(3),
    "reversalReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerEarning_pkey" PRIMARY KEY ("id")
);

-- DB-level idempotency: exactly one earning per order item.
-- CreateIndex
CREATE UNIQUE INDEX "SellerEarning_orderItemId_key" ON "SellerEarning"("orderItemId");

-- CreateIndex
CREATE INDEX "SellerEarning_sellerBrandId_idx" ON "SellerEarning"("sellerBrandId");

-- CreateIndex
CREATE INDEX "SellerEarning_orderId_idx" ON "SellerEarning"("orderId");

-- CreateIndex
CREATE INDEX "SellerEarning_status_idx" ON "SellerEarning"("status");

-- ============================================
-- SellerBalance (cached / reconciled read model)
-- ============================================

-- CreateTable
CREATE TABLE "SellerBalance" (
    "id" TEXT NOT NULL,
    "sellerBrandId" TEXT NOT NULL,
    "sellerBrandName" TEXT NOT NULL,
    "sellerUserId" TEXT,
    "pendingAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "availableAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "reversedAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "lifetimeEarnings" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "lastReconciledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerBalance_pkey" PRIMARY KEY ("id")
);

-- One balance row per seller.
-- CreateIndex
CREATE UNIQUE INDEX "SellerBalance_sellerBrandId_key" ON "SellerBalance"("sellerBrandId");

-- CreateIndex
CREATE INDEX "SellerBalance_sellerUserId_idx" ON "SellerBalance"("sellerUserId");

-- ============================================
-- OrderItem: seller attribution snapshot
-- (all additive; existing rows stay valid)
-- ============================================

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "sellerBrandId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "sellerBrandName" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "sellerUserId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "commissionRate" DECIMAL(5,2) NOT NULL DEFAULT 0;
ALTER TABLE "OrderItem" ADD COLUMN "commissionAmount" DECIMAL(14,2) NOT NULL DEFAULT 0;
ALTER TABLE "OrderItem" ADD COLUMN "earningAmount" DECIMAL(14,2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "OrderItem_sellerBrandId_idx" ON "OrderItem"("sellerBrandId");

-- ============================================
-- Foreign keys
-- ============================================

-- AddForeignKey
ALTER TABLE "LedgerAccount" ADD CONSTRAINT "LedgerAccount_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_sellerEarningId_fkey" FOREIGN KEY ("sellerEarningId") REFERENCES "SellerEarning"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_reversalOfId_fkey" FOREIGN KEY ("reversalOfId") REFERENCES "LedgerTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "LedgerTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerEarning" ADD CONSTRAINT "SellerEarning_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerEarning" ADD CONSTRAINT "SellerEarning_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerBalance" ADD CONSTRAINT "SellerBalance_sellerBrandId_fkey" FOREIGN KEY ("sellerBrandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_sellerBrandId_fkey" FOREIGN KEY ("sellerBrandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- Immutability / audit triggers
--
-- The ledger is the source of truth and must be append-only. These
-- triggers reject UPDATE and DELETE on ledger tables at the database
-- level — immutability is enforced by the database, not just convention.
-- (Reversals are NEW transactions, never edits of existing rows.)
-- ============================================

CREATE OR REPLACE FUNCTION "ledger_reject_mutation"()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Ledger rows are immutable: % on % is not allowed. Post a reversal transaction instead.', TG_OP, TG_TABLE_NAME
        USING ERRCODE = 'check_violation';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "LedgerTransaction_immutable_update"
    BEFORE UPDATE ON "LedgerTransaction"
    FOR EACH ROW EXECUTE FUNCTION "ledger_reject_mutation"();

CREATE TRIGGER "LedgerTransaction_immutable_delete"
    BEFORE DELETE ON "LedgerTransaction"
    FOR EACH ROW EXECUTE FUNCTION "ledger_reject_mutation"();

CREATE TRIGGER "LedgerEntry_immutable_update"
    BEFORE UPDATE ON "LedgerEntry"
    FOR EACH ROW EXECUTE FUNCTION "ledger_reject_mutation"();

CREATE TRIGGER "LedgerEntry_immutable_delete"
    BEFORE DELETE ON "LedgerEntry"
    FOR EACH ROW EXECUTE FUNCTION "ledger_reject_mutation"();
