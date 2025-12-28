/**
 * Sync Status - Matching backend SyncStatus.java enum
 */
export const SYNC_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export const SYNC_STATUS_LABELS = {
  [SYNC_STATUS.PENDING]: "Pending",
  [SYNC_STATUS.IN_PROGRESS]: "In Progress",
  [SYNC_STATUS.COMPLETED]: "Completed",
  [SYNC_STATUS.FAILED]: "Failed",
};

export const SYNC_STATUS_COLORS = {
  [SYNC_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [SYNC_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [SYNC_STATUS.COMPLETED]: "bg-green-100 text-green-800",
  [SYNC_STATUS.FAILED]: "bg-red-100 text-red-800",
};

export const SYNC_STATUS_OPTIONS = Object.entries(SYNC_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
