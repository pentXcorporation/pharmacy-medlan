/**
 * Authorization Status - Matching backend AuthorizationStatus.java enum
 */
export const AUTHORIZATION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
};

export const AUTHORIZATION_STATUS_LABELS = {
  [AUTHORIZATION_STATUS.PENDING]: "Pending",
  [AUTHORIZATION_STATUS.APPROVED]: "Approved",
  [AUTHORIZATION_STATUS.REJECTED]: "Rejected",
  [AUTHORIZATION_STATUS.EXPIRED]: "Expired",
  [AUTHORIZATION_STATUS.CANCELLED]: "Cancelled",
};

export const AUTHORIZATION_STATUS_COLORS = {
  [AUTHORIZATION_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [AUTHORIZATION_STATUS.APPROVED]: "bg-green-100 text-green-800",
  [AUTHORIZATION_STATUS.REJECTED]: "bg-red-100 text-red-800",
  [AUTHORIZATION_STATUS.EXPIRED]: "bg-gray-100 text-gray-800",
  [AUTHORIZATION_STATUS.CANCELLED]: "bg-gray-200 text-gray-600",
};

export const AUTHORIZATION_STATUS_OPTIONS = Object.entries(
  AUTHORIZATION_STATUS_LABELS
).map(([value, label]) => ({
  value,
  label,
}));
