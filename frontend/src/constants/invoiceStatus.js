/**
 * Invoice Status - Matching backend InvoiceStatus.java enum
 */
export const INVOICE_STATUS = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  PAID: "PAID",
  PARTIAL: "PARTIAL",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
};

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: "Draft",
  [INVOICE_STATUS.SENT]: "Sent",
  [INVOICE_STATUS.PAID]: "Paid",
  [INVOICE_STATUS.PARTIAL]: "Partial Payment",
  [INVOICE_STATUS.OVERDUE]: "Overdue",
  [INVOICE_STATUS.CANCELLED]: "Cancelled",
};

export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUS.DRAFT]: "bg-gray-100 text-gray-800",
  [INVOICE_STATUS.SENT]: "bg-blue-100 text-blue-800",
  [INVOICE_STATUS.PAID]: "bg-green-100 text-green-800",
  [INVOICE_STATUS.PARTIAL]: "bg-yellow-100 text-yellow-800",
  [INVOICE_STATUS.OVERDUE]: "bg-red-100 text-red-800",
  [INVOICE_STATUS.CANCELLED]: "bg-gray-200 text-gray-600",
};

export const INVOICE_STATUS_OPTIONS = Object.entries(INVOICE_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
