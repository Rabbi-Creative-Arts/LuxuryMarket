/**
 * Phase 3 — Financial Foundation: money primitives.
 *
 * ALL financial arithmetic in the marketplace goes through this module.
 * It uses `Prisma.Decimal` (decimal.js) exclusively — there is deliberately
 * NO JavaScript floating-point (`number`) math anywhere in the financial
 * pipeline. Floating point (`number`) is only accepted at the boundary and
 * immediately converted to Decimal.
 *
 * Rules enforced here:
 *  - Money is quantized to 2 decimal places (minor units of NGN/etc).
 *  - Commission uses 5 decimal places for the *rate* only; money is 2dp.
 *  - Percentages are expressed as whole numbers (3 means 3%), matching the
 *    existing `MarketplaceSettings.commissionRate` / `Order.marketplaceCommissionRate`
 *    `Decimal(5,2)` columns.
 */

import { Prisma } from "@prisma/client";

/** Decimal constructor / type reused across the finance feature. */
export type DecimalValue = Prisma.Decimal;

export const Decimal = Prisma.Decimal;

/** Number of decimal places used for every monetary amount. */
export const MONEY_DECIMALS = 2;

/** Number of decimal places used for commission rates. */
export const RATE_DECIMALS = 2;

const MONEY_ROUNDING = Prisma.Decimal.ROUND_HALF_UP;

/**
 * Convert anything Decimal-constructible (string, Decimal, or a `number`
 * boundary value) into a money Decimal quantized to 2 decimal places.
 *
 * Strings are strongly preferred for `number` inputs because a JS `number`
 * like 0.1 has already lost precision; callers should pass strings from
 * form inputs wherever possible.
 */
export function toMoney(value: Prisma.Decimal | string | number): Prisma.Decimal {
  let decimal: Prisma.Decimal;

  try {
    decimal = new Prisma.Decimal(value as Prisma.Decimal.Value);
  } catch {
    throw new Error(`Invalid money amount: ${String(value)}`);
  }

  if (!decimal.isFinite()) {
    throw new Error(`Invalid money amount: ${String(value)}`);
  }

  return decimal.toDecimalPlaces(MONEY_DECIMALS, MONEY_ROUNDING);
}

/** Convert a value to a commission-rate Decimal (percentage, 2dp). */
export function toRate(value: Prisma.Decimal | string | number): Prisma.Decimal {
  const decimal = new Prisma.Decimal(value as Prisma.Decimal.Value);

  if (!decimal.isFinite() || decimal.isNegative()) {
    throw new Error(`Invalid commission rate: ${String(value)}`);
  }

  return decimal.toDecimalPlaces(RATE_DECIMALS, MONEY_ROUNDING);
}

/** a + b */
export function addMoney(
  a: Prisma.Decimal | string | number,
  b: Prisma.Decimal | string | number
): Prisma.Decimal {
  return toMoney(toMoney(a).plus(toMoney(b)));
}

/** a - b */
export function subtractMoney(
  a: Prisma.Decimal | string | number,
  b: Prisma.Decimal | string | number
): Prisma.Decimal {
  return toMoney(toMoney(a).minus(toMoney(b)));
}

/** a * b (quantized after multiplication) */
export function multiplyMoney(
  a: Prisma.Decimal | string | number,
  b: Prisma.Decimal | string | number
): Prisma.Decimal {
  return toMoney(toMoney(a).times(new Prisma.Decimal(b)));
}

/**
 * Commission for a gross amount at a percentage rate.
 *
 *   commission = gross * rate / 100   (quantized HALF_UP to 2dp)
 *
 * This is the SINGLE authoritative commission calculation used by order
 * totals, seller earnings and ledger amounts — nothing else may compute
 * commission independently.
 */
export function commissionFor(
  gross: Prisma.Decimal | string | number,
  ratePercent: Prisma.Decimal | string | number
): Prisma.Decimal {
  const grossDecimal = toMoney(gross);
  const rateDecimal = toRate(ratePercent);

  const commission = grossDecimal
    .times(rateDecimal)
    .dividedBy(100)
    .toDecimalPlaces(MONEY_DECIMALS, MONEY_ROUNDING);

  return commission;
}

/**
 * Seller earning for a gross amount at a percentage rate:
 *
 *   earning = gross - commission
 *
 * Derived from the SAME `commissionFor` result so commission + earning can
 * never drift apart (no cent drift).
 */
export function earningFor(
  gross: Prisma.Decimal | string | number,
  ratePercent: Prisma.Decimal | string | number
): Prisma.Decimal {
  return subtractMoney(gross, commissionFor(gross, ratePercent));
}

/** Strict zero comparison for money values (after 2dp quantization). */
export function isZeroMoney(value: Prisma.Decimal | string | number): boolean {
  return toMoney(value).isZero();
}

/** Exact equality for two money values. */
export function moneyEquals(
  a: Prisma.Decimal | string | number,
  b: Prisma.Decimal | string | number
): boolean {
  return toMoney(a).equals(toMoney(b));
}

/**
 * Assert a collection of signed amounts sums to exactly zero (used to verify
 * balanced ledger postings before persistence).
 */
export function assertSumsToZero(
  values: Array<Prisma.Decimal | string | number>
): void {
  const sum = values.reduce<Prisma.Decimal>(
    (acc, value) => acc.plus(toMoney(value)),
    new Prisma.Decimal(0)
  );

  if (!sum.isZero()) {
    throw new Error(
      `Unbalanced ledger: postings sum to ${sum.toFixed(MONEY_DECIMALS)}, expected 0.00`
    );
  }
}
