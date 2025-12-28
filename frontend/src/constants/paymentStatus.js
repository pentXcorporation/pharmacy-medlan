/**
 * Payment Status - Matching backend PaymentStatus.java enum
 */
export const PAYMENT_STATUS = {
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE',
  REFUNDED: 'REFUNDED',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.PARTIAL]: 'Partial',
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.OVERDUE]: 'Overdue',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PAID]: 'bg-green-100 text-green-800',
  [PAYMENT_STATUS.PARTIAL]: 'bg-yellow-100 text-yellow-800',
  [PAYMENT_STATUS.PENDING]: 'bg-blue-100 text-blue-800',
  [PAYMENT_STATUS.OVERDUE]: 'bg-red-100 text-red-800',
  [PAYMENT_STATUS.REFUNDED]: 'bg-purple-100 text-purple-800',
};

export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
