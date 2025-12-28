/**
 * Alert Level - Matching backend AlertLevel.java enum
 */
export const ALERT_LEVEL = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const ALERT_LEVEL_LABELS = {
  [ALERT_LEVEL.INFO]: 'Information',
  [ALERT_LEVEL.WARNING]: 'Warning',
  [ALERT_LEVEL.CRITICAL]: 'Critical',
  [ALERT_LEVEL.LOW]: 'Low',
  [ALERT_LEVEL.MEDIUM]: 'Medium',
  [ALERT_LEVEL.HIGH]: 'High',
};

export const ALERT_LEVEL_COLORS = {
  [ALERT_LEVEL.INFO]: 'bg-blue-100 text-blue-800',
  [ALERT_LEVEL.WARNING]: 'bg-yellow-100 text-yellow-800',
  [ALERT_LEVEL.CRITICAL]: 'bg-red-100 text-red-800',
  [ALERT_LEVEL.LOW]: 'bg-green-100 text-green-800',
  [ALERT_LEVEL.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [ALERT_LEVEL.HIGH]: 'bg-red-100 text-red-800',
};

export const ALERT_LEVEL_OPTIONS = Object.entries(ALERT_LEVEL_LABELS).map(([value, label]) => ({
  value,
  label,
}));
