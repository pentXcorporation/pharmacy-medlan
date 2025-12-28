/**
 * GRN Status - Matching backend GRNStatus.java enum
 */
export const GRN_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

export const GRN_STATUS_LABELS = {
  [GRN_STATUS.PENDING]: "Pending",
  [GRN_STATUS.APPROVED]: "Approved",
  [GRN_STATUS.REJECTED]: "Rejected",
  [GRN_STATUS.CANCELLED]: "Cancelled",
};

export const GRN_STATUS_COLORS = {
  [GRN_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [GRN_STATUS.APPROVED]: "bg-green-100 text-green-800",
  [GRN_STATUS.REJECTED]: "bg-red-100 text-red-800",
  [GRN_STATUS.CANCELLED]: "bg-gray-100 text-gray-800",
};

export const GRN_STATUS_OPTIONS = Object.entries(GRN_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
