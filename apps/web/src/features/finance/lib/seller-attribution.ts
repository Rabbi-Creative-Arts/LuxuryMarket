/**
 * Phase 3 — Financial Foundation: seller attribution snapshot.
 *
 * At order creation the seller identity and the commission rate ACTUALLY
 * APPLIED are snapshotted onto each OrderItem. Historical financial records
 * therefore never depend on later Product/Brand mutations (renames, owner
 * changes, deletions) or on Admin changing the marketplace commission rate.
 *
 * This module is pure (no database) so it is fully unit-testable; the order
 * service calls it inside its existing `createFromCart` transaction.
 */

import { Prisma } from "@prisma/client";

import { commissionFor, earningFor, toMoney, toRate } from "./money";

/** Shape of a cart line with its product and the product's brand. */
export interface CartLineForAttribution {
  productId: string;
  quantity: number;
  product: {
    id: string;
    price: Prisma.Decimal | string | number;
    brand: {
      id: string;
      name: string;
      ownerId: string | null;
    } | null;
  };
}

export interface OrderItemSellerSnapshot {
  productId: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  total: Prisma.Decimal;
  // Seller snapshot (the Phase 3 requirement)
  sellerBrandId: string | null;
  sellerBrandName: string | null;
  sellerUserId: string | null;
  commissionRate: Prisma.Decimal;
  commissionAmount: Prisma.Decimal;
  earningAmount: Prisma.Decimal;
}

/**
 * Build the OrderItem create payload (including the seller snapshot) for one
 * cart line. All money flows through the single authoritative commission
 * path (`commissionFor` / `earningFor`), so order totals, order item
 * commission and ledger amounts all derive from the SAME numbers.
 */
export function buildOrderItemSnapshot(
  line: CartLineForAttribution,
  commissionRatePercent: Prisma.Decimal | string | number
): OrderItemSellerSnapshot {
  const rate = toRate(commissionRatePercent);
  const unitPrice = toMoney(line.product.price);
  const total = toMoney(unitPrice.times(line.quantity));

  // Commission is always computed on the LINE TOTAL, never re-derived
  // independently elsewhere.
  const commissionAmount = commissionFor(total, rate);
  const earningAmount = earningFor(total, rate);

  const brand = line.product.brand;

  return {
    productId: line.productId,
    quantity: line.quantity,
    unitPrice,
    total,
    sellerBrandId: brand?.id ?? null,
    sellerBrandName: brand?.name ?? null,
    sellerUserId: brand?.ownerId ?? null,
    commissionRate: rate,
    commissionAmount,
    earningAmount,
  };
}

/**
 * Build snapshots for every cart line, preserving multi-seller orders
 * (lines are returned in the same order and are NOT grouped by seller).
 */
export function buildOrderItemSnapshots(
  lines: CartLineForAttribution[],
  commissionRatePercent: Prisma.Decimal | string | number
): OrderItemSellerSnapshot[] {
  return lines.map((line) => buildOrderItemSnapshot(line, commissionRatePercent));
}

/**
 * Aggregate order-level money from the item snapshots. This is the ONLY
 * place order subtotal/commission are computed during checkout — the order
 * header and the ledger postings consume these same values.
 */
export function summarizeOrder(snapshots: OrderItemSellerSnapshot[]): {
  subtotal: Prisma.Decimal;
  totalCommission: Prisma.Decimal;
  totalSellerEarning: Prisma.Decimal;
} {
  const zero = new Prisma.Decimal(0);

  const subtotal = snapshots.reduce(
    (acc, snapshot) => acc.plus(snapshot.total),
    zero
  );

  const totalCommission = snapshots.reduce(
    (acc, snapshot) => acc.plus(snapshot.commissionAmount),
    zero
  );

  const totalSellerEarning = snapshots.reduce(
    (acc, snapshot) => acc.plus(snapshot.earningAmount),
    zero
  );

  return { subtotal, totalCommission, totalSellerEarning };
}
