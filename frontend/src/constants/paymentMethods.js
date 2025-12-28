/**
 * Payment Methods - Matching backend PaymentMethod.java enum
 */
export const PAYMENT_METHOD = {
  CASH: "CASH",
  CARD: "CARD",
  UPI: "UPI",
  BANK_TRANSFER: "BANK_TRANSFER",
  CHEQUE: "CHEQUE",
  CREDIT: "CREDIT",
  MIXED: "MIXED",
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.CASH]: "Cash",
  [PAYMENT_METHOD.CARD]: "Card",
  [PAYMENT_METHOD.UPI]: "UPI",
  [PAYMENT_METHOD.BANK_TRANSFER]: "Bank Transfer",
  [PAYMENT_METHOD.CHEQUE]: "Cheque",
  [PAYMENT_METHOD.CREDIT]: "Credit",
  [PAYMENT_METHOD.MIXED]: "Mixed Payment",
};

export const PAYMENT_METHOD_COLORS = {
  [PAYMENT_METHOD.CASH]: "bg-green-100 text-green-800",
  [PAYMENT_METHOD.CARD]: "bg-blue-100 text-blue-800",
  [PAYMENT_METHOD.UPI]: "bg-purple-100 text-purple-800",
  [PAYMENT_METHOD.BANK_TRANSFER]: "bg-cyan-100 text-cyan-800",
  [PAYMENT_METHOD.CHEQUE]: "bg-yellow-100 text-yellow-800",
  [PAYMENT_METHOD.CREDIT]: "bg-orange-100 text-orange-800",
  [PAYMENT_METHOD.MIXED]: "bg-gray-100 text-gray-800",
};

export const PAYMENT_METHOD_ICONS = {
  [PAYMENT_METHOD.CASH]: "Banknote",
  [PAYMENT_METHOD.CARD]: "CreditCard",
  [PAYMENT_METHOD.UPI]: "Smartphone",
  [PAYMENT_METHOD.BANK_TRANSFER]: "Building2",
  [PAYMENT_METHOD.CHEQUE]: "FileText",
  [PAYMENT_METHOD.CREDIT]: "Clock",
  [PAYMENT_METHOD.MIXED]: "Layers",
};

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
