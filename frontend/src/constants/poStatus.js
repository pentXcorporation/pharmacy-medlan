/**
 * Purchase Order Status - Matching backend POStatus.java enum
 */
export const PO_STATUS = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PARTIAL: "PARTIAL",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const PO_STATUS_LABELS = {
  [PO_STATUS.DRAFT]: "Draft",
  [PO_STATUS.PENDING]: "Pending Approval",
  [PO_STATUS.APPROVED]: "Approved",
  [PO_STATUS.REJECTED]: "Rejected",
  [PO_STATUS.PARTIAL]: "Partially Received",
  [PO_STATUS.COMPLETED]: "Completed",
  [PO_STATUS.CANCELLED]: "Cancelled",
};

export const PO_STATUS_COLORS = {
  [PO_STATUS.DRAFT]: "bg-gray-100 text-gray-800",
  [PO_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [PO_STATUS.APPROVED]: "bg-blue-100 text-blue-800",
  [PO_STATUS.REJECTED]: "bg-red-100 text-red-800",
  [PO_STATUS.PARTIAL]: "bg-orange-100 text-orange-800",
  [PO_STATUS.COMPLETED]: "bg-green-100 text-green-800",
  [PO_STATUS.CANCELLED]: "bg-gray-200 text-gray-600",
};

export const PO_STATUS_OPTIONS = Object.entries(PO_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
