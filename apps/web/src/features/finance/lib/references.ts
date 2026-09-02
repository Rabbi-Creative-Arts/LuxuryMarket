/**
 * Phase 3 — Financial Foundation: idempotent financial references.
 *
 * Every money-moving operation derives a DETERMINISTIC reference from the
 * business keys of the operation. Posting the same operation twice produces
 * the same reference, and `LedgerTransaction.reference` is UNIQUE at the
 * database level — so a duplicate can never create a duplicate money
 * movement, even if two requests race (the second INSERT fails with a
 * unique-violation, which the ledger service treats as idempotent success).
 */

const PREFIX = "TXN";

export const FINANCIAL_REFERENCES = {
  /**
   * Order settlement for one seller's portion of an order.
   * One settlement posting per (order, brand).
   */
  orderSettlement(orderId: string, brandId: string): string {
    return `${PREFIX}:ORDER:${orderId}:BRAND:${brandId}:SETTLE`;
  },

  /**
   * Release of one order item's earning from pending to available.
   */
  earningRelease(earningId: string): string {
    return `${PREFIX}:EARNING:${earningId}:RELEASE`;
  },

  /**
   * Recording of a payout for an available earning.
   */
  earningPayout(earningId: string): string {
    return `${PREFIX}:EARNING:${earningId}:PAYOUT`;
  },

  /**
   * Reversal of one order item's earning.
   */
  earningReversal(earningId: string): string {
    return `${PREFIX}:EARNING:${earningId}:REVERSE`;
  },

  /**
   * Manual admin adjustment (caller supplies a stable external key).
   */
  manualAdjustment(key: string): string {
    return `${PREFIX}:MANUAL:${key}`;
  },
} as const;

/** The SellerEarning row for an order item is itself idempotent on orderItemId. */
export function sellerEarningKey(orderItemId: string): string {
  return `EARNING:ITEM:${orderItemId}`;
}
