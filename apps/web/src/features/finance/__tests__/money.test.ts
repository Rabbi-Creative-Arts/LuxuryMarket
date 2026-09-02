import { describe, expect, it } from "vitest";
import { Prisma } from "@prisma/client";

import {
  addMoney,
  assertSumsToZero,
  commissionFor,
  earningFor,
  moneyEquals,
  multiplyMoney,
  subtractMoney,
  toMoney,
  toRate,
} from "../lib/money";

describe("Phase 3 — Decimal money arithmetic (exact, no floating point)", () => {
  it("keeps money as Decimal, never JS float", () => {
    const money = toMoney("100000.00");
    expect(money).toBeInstanceOf(Prisma.Decimal);
    expect(money.isFinite()).toBe(true);
  });

  it("adds exactly with no binary float drift", () => {
    // 0.1 + 0.2 === 0.30000000000000004 in JS floats — Decimal must not.
    expect(addMoney("0.10", "0.20").toFixed(2)).toBe("0.30");
    expect(addMoney("100000.00", "25000.50").toFixed(2)).toBe("125000.50");
  });

  it("subtracts exactly, allowing negative results", () => {
    expect(subtractMoney("100.00", "130.00").toFixed(2)).toBe("-30.00");
  });

  it("multiplies quantity × price exactly (the order line-total case)", () => {
    const lineTotal = multiplyMoney("49999.99", 3);
    expect(lineTotal.toFixed(2)).toBe("149999.97");
  });

  it("quantizes to 2 decimal places using HALF_UP", () => {
    expect(toMoney("1.005").toFixed(2)).toBe("1.01");
    expect(toMoney("2.344").toFixed(2)).toBe("2.34");
  });

  it("rejects non-finite money", () => {
    expect(() => toMoney("abc")).toThrow(/Invalid money amount/);
    expect(() => toMoney(Number.NaN)).toThrow(/Invalid money amount/);
  });

  it("commission is the single authoritative calculation path", () => {
    // ₦100,000 × 3% = ₦3,000 (the documented marketplace example)
    const commission = commissionFor("100000.00", "3");
    expect(commission.toFixed(2)).toBe("3000.00");
  });

  it("commission rounds HALF_UP to kobo so cents never drift", () => {
    // 33.33 × 5% = 1.6665 → 1.67
    expect(commissionFor("33.33", "5").toFixed(2)).toBe("1.67");
    // 19.99 × 7.5% = 1.49925 → 1.50
    expect(commissionFor("19.99", "7.5").toFixed(2)).toBe("1.50");
  });

  it("earning = gross − commission with no cent drift", () => {
    const gross = "100000.00";
    const commission = commissionFor(gross, "3");
    const earning = earningFor(gross, "3");
    expect(earning.toFixed(2)).toBe("97000.00");
    // Reconciliation identity: commission + earning === gross
    expect(commission.plus(earning).toFixed(2)).toBe("100000.00");
  });

  it("handles a messy multi-item split that sums back exactly", () => {
    const lines = ["1234.56", "789.10", "45.99", "9999.99", "0.01"];
    const rate = "12.5";

    let grossTotal = new Prisma.Decimal(0);
    let commissionTotal = new Prisma.Decimal(0);
    let earningTotal = new Prisma.Decimal(0);

    for (const gross of lines) {
      const commission = commissionFor(gross, rate);
      const earning = earningFor(gross, rate);
      // Per-line identity
      expect(commission.plus(earning).toFixed(2)).toBe(toMoney(gross).toFixed(2));
      grossTotal = grossTotal.plus(toMoney(gross));
      commissionTotal = commissionTotal.plus(commission);
      earningTotal = earningTotal.plus(earning);
    }

    // Aggregate identity still holds
    expect(commissionTotal.plus(earningTotal).equals(grossTotal)).toBe(true);
  });

  it("rate accepts percentage decimals and rejects negatives", () => {
    expect(toRate("3.5").toFixed(2)).toBe("3.50");
    expect(() => toRate("-1")).toThrow(/Invalid commission rate/);
  });

  it("moneyEquals compares quantized values", () => {
    expect(moneyEquals("100.000", "100.00")).toBe(true);
    expect(moneyEquals("100.01", "100.00")).toBe(false);
  });

  it("assertSumsToZero passes for balanced signed amounts and throws for imbalance", () => {
    expect(() =>
      assertSumsToZero(["100.00", "-60.00", "-40.00"])
    ).not.toThrow();

    expect(() =>
      assertSumsToZero(["100.00", "-60.00", "-39.99"])
    ).toThrow(/Unbalanced ledger/);
  });
});
