/**
 * Sale Status - Matching backend SaleStatus.java enum
 */
export const SALE_STATUS = {
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  VOIDED: 'VOIDED',
  PENDING: 'PENDING',
  ON_HOLD: 'ON_HOLD',
};

export const SALE_STATUS_LABELS = {
  [SALE_STATUS.COMPLETED]: 'Completed',
  [SALE_STATUS.CANCELLED]: 'Cancelled',
  [SALE_STATUS.VOIDED]: 'Voided',
  [SALE_STATUS.PENDING]: 'Pending',
  [SALE_STATUS.ON_HOLD]: 'On Hold',
};

export const SALE_STATUS_COLORS = {
  [SALE_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [SALE_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [SALE_STATUS.VOIDED]: 'bg-gray-100 text-gray-800',
  [SALE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [SALE_STATUS.ON_HOLD]: 'bg-orange-100 text-orange-800',
};

export const SALE_STATUS_OPTIONS = Object.entries(SALE_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
