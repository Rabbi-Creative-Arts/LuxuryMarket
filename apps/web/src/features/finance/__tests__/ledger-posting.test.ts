import { describe, expect, it } from "vitest";

import {
  MARKETPLACE_ACCOUNTS,
  sellerAvailablePayableCode,
  sellerPendingPayableCode,
} from "../lib/chart-of-accounts";
import {
  buildBalancedTransaction,
  debitCredit,
} from "../lib/ledger-posting";

const BRAND = "brand_seller_a";

describe("Phase 3 — double-entry ledger posting builder", () => {
  it("accepts a balanced transaction (debits === credits)", () => {
    const draft = buildBalancedTransaction({
      reference: "TXN:TEST:1",
      type: "ORDER_SETTLEMENT",
      description: "test settlement",
      lines: [
        { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "100000.00" },
        { accountCode: sellerPendingPayableCode(BRAND), direction: "CREDIT", amount: "97000.00" },
        { accountCode: MARKETPLACE_ACCOUNTS.COMMISSION_REVENUE, direction: "CREDIT", amount: "3000.00" },
      ],
    });

    expect(draft.amount.toFixed(2)).toBe("100000.00");
    expect(draft.lines).toHaveLength(3);
  });

  it("rejects an unbalanced transaction before persistence", () => {
    expect(() =>
      buildBalancedTransaction({
        reference: "TXN:TEST:BAD",
        type: "MANUAL_ADJUSTMENT",
        description: "broken",
        lines: [
          { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "100.00" },
          { accountCode: sellerPendingPayableCode(BRAND), direction: "CREDIT", amount: "99.00" },
        ],
      })
    ).toThrow(/Unbalanced ledger transaction/);
  });

  it("rejects a transaction with only debits", () => {
    expect(() =>
      buildBalancedTransaction({
        reference: "TXN:TEST:DEBITS_ONLY",
        type: "MANUAL_ADJUSTMENT",
        description: "all debits",
        lines: [
          { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "100.00" },
          { accountCode: sellerPendingPayableCode(BRAND), direction: "DEBIT", amount: "100.00" },
        ],
      })
    ).toThrow(/both debits and credits/);
  });

  it("rejects zero or negative entry amounts", () => {
    expect(() =>
      buildBalancedTransaction({
        reference: "TXN:TEST:ZERO",
        type: "MANUAL_ADJUSTMENT",
        description: "zero",
        lines: [
          { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "0" },
          { accountCode: sellerPendingPayableCode(BRAND), direction: "CREDIT", amount: "0" },
        ],
      })
    ).toThrow(/positive/);
  });

  it("rejects a transaction without a reference (idempotency key)", () => {
    expect(() =>
      buildBalancedTransaction({
        reference: "  ",
        type: "MANUAL_ADJUSTMENT",
        description: "no ref",
        lines: [
          { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "DEBIT", amount: "100.00" },
          { accountCode: sellerPendingPayableCode(BRAND), direction: "CREDIT", amount: "100.00" },
        ],
      })
    ).toThrow(/unique reference/);
  });

  it("balances the earning release reclassification (pending -> available)", () => {
    const draft = buildBalancedTransaction({
      reference: "TXN:TEST:RELEASE",
      type: "EARNING_RELEASE",
      description: "release",
      lines: [
        { accountCode: sellerPendingPayableCode(BRAND), direction: "DEBIT", amount: "97000.00" },
        { accountCode: sellerAvailablePayableCode(BRAND), direction: "CREDIT", amount: "97000.00" },
      ],
    });
    expect(draft.amount.toFixed(2)).toBe("97000.00");
  });

  it("balances a reversal (debits to payable + commission, credit to clearing)", () => {
    const draft = buildBalancedTransaction({
      reference: "TXN:TEST:REVERSE",
      type: "EARNING_REVERSAL",
      description: "reverse",
      lines: [
        { accountCode: sellerPendingPayableCode(BRAND), direction: "DEBIT", amount: "97000.00" },
        { accountCode: MARKETPLACE_ACCOUNTS.COMMISSION_REVENUE, direction: "DEBIT", amount: "3000.00" },
        { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, direction: "CREDIT", amount: "100000.00" },
      ],
    });
    expect(draft.amount.toFixed(2)).toBe("100000.00");
  });

  it("debitCredit helper produces equal debits and credits", () => {
    const draft = debitCredit({
      reference: "TXN:TEST:DC",
      type: "SELLER_PAYOUT",
      description: "payout",
      debit: { accountCode: sellerAvailablePayableCode(BRAND), amount: "97000.00" },
      credit: { accountCode: MARKETPLACE_ACCOUNTS.CLEARING, amount: "97000.00" },
    });
    expect(draft.amount.toFixed(2)).toBe("97000.00");
  });
});
