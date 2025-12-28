/**
 * Transaction Type - Matching backend TransactionType.java enum
 */
export const TRANSACTION_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
  TRANSFER: "TRANSFER",
  ADJUSTMENT: "ADJUSTMENT",
};

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPE.INCOME]: "Income",
  [TRANSACTION_TYPE.EXPENSE]: "Expense",
  [TRANSACTION_TYPE.TRANSFER]: "Transfer",
  [TRANSACTION_TYPE.ADJUSTMENT]: "Adjustment",
};

export const TRANSACTION_TYPE_COLORS = {
  [TRANSACTION_TYPE.INCOME]: "bg-green-100 text-green-800",
  [TRANSACTION_TYPE.EXPENSE]: "bg-red-100 text-red-800",
  [TRANSACTION_TYPE.TRANSFER]: "bg-blue-100 text-blue-800",
  [TRANSACTION_TYPE.ADJUSTMENT]: "bg-yellow-100 text-yellow-800",
};

export const TRANSACTION_TYPE_OPTIONS = Object.entries(
  TRANSACTION_TYPE_LABELS
).map(([value, label]) => ({
  value,
  label,
}));
