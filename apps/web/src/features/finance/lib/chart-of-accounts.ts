/**
 * Phase 3 — Financial Foundation: chart of accounts.
 *
 * Account codes are stable strings. Marketplace-level accounts have no
 * brand; seller accounts are derived per brand so each seller's payable
 * position is independently tracked and reconciled.
 *
 * Normal balances:
 *  - ASSET / EXPENSE accounts are DEBIT-normal.
 *  - LIABILITY / REVENUE / EQUITY accounts are CREDIT-normal.
 */

import type { LedgerAccountType, LedgerDirection } from "@prisma/client";

/** Marketplace-level account codes (no brand owner). */
export const MARKETPLACE_ACCOUNTS = {
  /**
   * Funds clearing account. Money in from settled orders is debited here;
   * money out (recorded payouts) is credited.
   */
  CLEARING: "1100.MP_CLEARING",

  /** Marketplace commission income. */
  COMMISSION_REVENUE: "4100.MP_COMMISSION",
} as const;

/** Per-seller liability account codes. */
export function sellerPendingPayableCode(brandId: string): string {
  return `2110.SELLER_PENDING:${brandId}`;
}

export function sellerAvailablePayableCode(brandId: string): string {
  return `2111.SELLER_AVAILABLE:${brandId}`;
}

interface AccountSeed {
  code: string;
  name: string;
  type: LedgerAccountType;
  normalDirection: LedgerDirection;
}

/** Marketplace chart of accounts seeded once. */
export const MARKETPLACE_ACCOUNT_SEEDS: AccountSeed[] = [
  {
    code: MARKETPLACE_ACCOUNTS.CLEARING,
    name: "Marketplace Clearing",
    type: "ASSET",
    normalDirection: "DEBIT",
  },
  {
    code: MARKETPLACE_ACCOUNTS.COMMISSION_REVENUE,
    name: "Marketplace Commission Revenue",
    type: "REVENUE",
    normalDirection: "CREDIT",
  },
];

/** Per-brand accounts created lazily for a seller. */
export function sellerAccountSeeds(
  brandId: string,
  brandName: string
): AccountSeed[] {
  return [
    {
      code: sellerPendingPayableCode(brandId),
      name: `${brandName} — Seller Payable (Pending)`,
      type: "LIABILITY",
      normalDirection: "CREDIT",
    },
    {
      code: sellerAvailablePayableCode(brandId),
      name: `${brandName} — Seller Payable (Available)`,
      type: "LIABILITY",
      normalDirection: "CREDIT",
    },
  ];
}
