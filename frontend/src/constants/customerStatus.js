/**
 * Customer Status - Matching backend CustomerStatus.java enum
 */
export const CUSTOMER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING: 'PENDING',
};

export const CUSTOMER_STATUS_LABELS = {
  [CUSTOMER_STATUS.ACTIVE]: 'Active',
  [CUSTOMER_STATUS.INACTIVE]: 'Inactive',
  [CUSTOMER_STATUS.BLOCKED]: 'Blocked',
  [CUSTOMER_STATUS.PENDING]: 'Pending',
};

export const CUSTOMER_STATUS_COLORS = {
  [CUSTOMER_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [CUSTOMER_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
  [CUSTOMER_STATUS.BLOCKED]: 'bg-red-100 text-red-800',
  [CUSTOMER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
};

export const CUSTOMER_STATUS_OPTIONS = Object.entries(CUSTOMER_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));
