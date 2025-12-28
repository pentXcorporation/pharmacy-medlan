/**
 * Return Reason - Matching backend ReturnReason.java enum
 */
export const RETURN_REASON = {
  DAMAGED: "DAMAGED",
  EXPIRED: "EXPIRED",
  WRONG_ITEM: "WRONG_ITEM",
  QUALITY_ISSUE: "QUALITY_ISSUE",
  CUSTOMER_REQUEST: "CUSTOMER_REQUEST",
  OTHER: "OTHER",
};

export const RETURN_REASON_LABELS = {
  [RETURN_REASON.DAMAGED]: "Damaged",
  [RETURN_REASON.EXPIRED]: "Expired",
  [RETURN_REASON.WRONG_ITEM]: "Wrong Item",
  [RETURN_REASON.QUALITY_ISSUE]: "Quality Issue",
  [RETURN_REASON.CUSTOMER_REQUEST]: "Customer Request",
  [RETURN_REASON.OTHER]: "Other",
};

export const RETURN_REASON_COLORS = {
  [RETURN_REASON.DAMAGED]: "bg-red-100 text-red-800",
  [RETURN_REASON.EXPIRED]: "bg-orange-100 text-orange-800",
  [RETURN_REASON.WRONG_ITEM]: "bg-yellow-100 text-yellow-800",
  [RETURN_REASON.QUALITY_ISSUE]: "bg-purple-100 text-purple-800",
  [RETURN_REASON.CUSTOMER_REQUEST]: "bg-blue-100 text-blue-800",
  [RETURN_REASON.OTHER]: "bg-gray-100 text-gray-800",
};

export const RETURN_REASON_OPTIONS = Object.entries(RETURN_REASON_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
