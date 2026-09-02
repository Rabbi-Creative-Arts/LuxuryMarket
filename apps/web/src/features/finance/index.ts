/**
 * Phase 3 — Financial Foundation public surface.
 */

export { ledgerService, LedgerService } from "./services/ledger.service";
export {
  sellerEarningService,
  SellerEarningService,
  InvalidEarningTransitionError,
  type OrderItemFinancialInput,
} from "./services/seller-earning.service";
export {
  sellerBalanceService,
  SellerBalanceService,
  type ReconciliationResult,
} from "./services/seller-balance.service";

export {
  MARKETPLACE_ACCOUNTS,
  sellerPendingPayableCode,
  sellerAvailablePayableCode,
} from "./lib/chart-of-accounts";

export { FINANCIAL_REFERENCES } from "./lib/references";

export {
  buildBalancedTransaction,
  debitCredit,
  type BalancedTransactionDraft,
  type PostingLine,
} from "./lib/ledger-posting";

export {
  toMoney,
  toRate,
  addMoney,
  subtractMoney,
  multiplyMoney,
  commissionFor,
  earningFor,
  moneyEquals,
  isZeroMoney,
  assertSumsToZero,
} from "./lib/money";

export {
  buildOrderItemSnapshot,
  buildOrderItemSnapshots,
  summarizeOrder,
  type CartLineForAttribution,
  type OrderItemSellerSnapshot,
} from "./lib/seller-attribution";

export type { FinanceDb } from "./types";
