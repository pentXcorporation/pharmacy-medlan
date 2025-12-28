/**
 * Transfer Status - Matching backend TransferStatus.java enum
 */
export const TRANSFER_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  IN_TRANSIT: "IN_TRANSIT",
  RECEIVED: "RECEIVED",
  CANCELLED: "CANCELLED",
};

export const TRANSFER_STATUS_LABELS = {
  [TRANSFER_STATUS.PENDING]: "Pending",
  [TRANSFER_STATUS.APPROVED]: "Approved",
  [TRANSFER_STATUS.REJECTED]: "Rejected",
  [TRANSFER_STATUS.IN_TRANSIT]: "In Transit",
  [TRANSFER_STATUS.RECEIVED]: "Received",
  [TRANSFER_STATUS.CANCELLED]: "Cancelled",
};

export const TRANSFER_STATUS_COLORS = {
  [TRANSFER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [TRANSFER_STATUS.APPROVED]: "bg-blue-100 text-blue-800",
  [TRANSFER_STATUS.REJECTED]: "bg-red-100 text-red-800",
  [TRANSFER_STATUS.IN_TRANSIT]: "bg-purple-100 text-purple-800",
  [TRANSFER_STATUS.RECEIVED]: "bg-green-100 text-green-800",
  [TRANSFER_STATUS.CANCELLED]: "bg-gray-100 text-gray-800",
};

export const TRANSFER_STATUS_OPTIONS = Object.entries(
  TRANSFER_STATUS_LABELS
).map(([value, label]) => ({
  value,
  label,
}));
