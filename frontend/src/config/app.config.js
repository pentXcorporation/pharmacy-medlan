/**
 * Application Configuration
 * Central configuration for app-wide settings
 */

export const APP_CONFIG = {
  // App info
  NAME: import.meta.env.VITE_APP_NAME || "MedLan Pharmacy",
  SHORT_NAME: "MedLan",
  VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  DESCRIPTION: "Pharmacy Management System",

  // Locale settings
  LOCALE: {
    CURRENCY: "LKR",
    CURRENCY_SYMBOL: "Rs.",
    DATE_FORMAT: "dd/MM/yyyy",
    TIME_FORMAT: "HH:mm",
    DATETIME_FORMAT: "dd/MM/yyyy HH:mm",
    TIMEZONE: "Asia/Colombo",
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  // UI settings
  UI: {
    SIDEBAR_COLLAPSED_KEY: "sidebarCollapsed",
    THEME_KEY: "theme",
    DEFAULT_THEME: "light",
  },

  // Debounce delays (ms)
  DEBOUNCE: {
    SEARCH: 300,
    INPUT: 500,
  },

  // Toast durations (ms)
  TOAST: {
    SUCCESS: 3000,
    ERROR: 5000,
    INFO: 4000,
    WARNING: 4000,
  },

  // File upload
  UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif"],
  },

  // Inventory settings
  INVENTORY: {
    LOW_STOCK_THRESHOLD: 10,
    EXPIRY_WARNING_DAYS: 90, // 3 months
    EXPIRY_CRITICAL_DAYS: 30, // 1 month
  },

  // POS settings
  POS: {
    DEFAULT_TAX_RATE: 0, // No tax by default
    MAX_DISCOUNT_PERCENT: 100,
    PRINT_RECEIPT_AUTO: true,
    SHOW_STOCK_WARNING: true,
  },

  // Session settings
  SESSION: {
    IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh 5 minutes before expiry
  },
};

// Feature flags
export const FEATURES = {
  PRESCRIPTION_REQUIRED: true,
  DRUG_INTERACTION_CHECK: true,
  MULTI_BRANCH: true,
  OFFLINE_MODE: false,
  BARCODE_SCANNER: true,
  BATCH_TRACKING: true,
  EXPIRY_ALERTS: true,
  LOW_STOCK_ALERTS: true,
  REAL_TIME_NOTIFICATIONS: true,
};
