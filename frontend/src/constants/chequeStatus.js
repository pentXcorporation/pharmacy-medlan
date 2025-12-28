/**
 * Cheque Status - Matching backend ChequeStatus.java enum
 */
export const CHEQUE_STATUS = {
  PENDING: 'PENDING',
  DEPOSITED: 'DEPOSITED',
  CLEARED: 'CLEARED',
  BOUNCED: 'BOUNCED',
  CANCELLED: 'CANCELLED',
  REPLACED: 'REPLACED',
};

export const CHEQUE_STATUS_LABELS = {
  [CHEQUE_STATUS.PENDING]: 'Pending',
  [CHEQUE_STATUS.DEPOSITED]: 'Deposited',
  [CHEQUE_STATUS.CLEARED]: 'Cleared',
  [CHEQUE_STATUS.BOUNCED]: 'Bounced',
  [CHEQUE_STATUS.CANCELLED]: 'Cancelled',
  [CHEQUE_STATUS.REPLACED]: 'Replaced',
};

export const CHEQUE_STATUS_COLORS = {
  [CHEQUE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [CHEQUE_STATUS.DEPOSITED]: 'bg-blue-100 text-blue-800',
  [CHEQUE_STATUS.CLEARED]: 'bg-green-100 text-green-800',
  [CHEQUE_STATUS.BOUNCED]: 'bg-red-100 text-red-800',
  [CHEQUE_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800',
  [CHEQUE_STATUS.REPLACED]: 'bg-purple-100 text-purple-800',
};

export const CHEQUE_STATUS_OPTIONS = Object.entries(CHEQUE_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
