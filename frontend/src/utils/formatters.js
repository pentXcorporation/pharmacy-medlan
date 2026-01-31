/**
 * Formatters
 * Date, currency, number, and text formatting utilities
 */
import {
  format,
  formatDistance,
  formatRelative,
  isValid,
  parseISO,
} from "date-fns";
import { APP_CONFIG } from "@/config/app.config";

// ============================================
// DATE FORMATTERS
// ============================================

/**
 * Format date to display format
 * @param {string|Date|Array} date - Date to format (string, Date object, or [year, month, day] array)
 * @param {string} formatStr - Format string (default from config)
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = APP_CONFIG.LOCALE.DATE_FORMAT) => {
  if (!date) return "-";
  
  let dateObj;
  
  // Handle different date formats
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === "string") {
    dateObj = parseISO(date);
  } else if (Array.isArray(date)) {
    // Handle array format [year, month, day] from backend (Java LocalDate)
    dateObj = new Date(date[0], date[1] - 1, date[2]);
  } else {
    return "-";
  }
  
  if (!isValid(dateObj)) return "-";
  return format(dateObj, formatStr);
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  return formatDate(date, APP_CONFIG.LOCALE.DATETIME_FORMAT);
};

/**
 * Format time only
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  return formatDate(date, APP_CONFIG.LOCALE.TIME_FORMAT);
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return "-";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "-";
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Format date for API (ISO format)
 * @param {Date} date - Date to format
 * @returns {string} ISO date string
 */
export const formatDateForApi = (date) => {
  if (!date || !isValid(date)) return null;
  return format(date, "yyyy-MM-dd");
};

/**
 * Format datetime for API (ISO format)
 * @param {Date} date - Date to format
 * @returns {string} ISO datetime string
 */
export const formatDateTimeForApi = (date) => {
  if (!date || !isValid(date)) return null;
  return date.toISOString();
};

// ============================================
// CURRENCY FORMATTERS
// ============================================

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default from config)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (
  amount,
  currency = APP_CONFIG.LOCALE.CURRENCY
) => {
  if (amount === null || amount === undefined) return "-";

  const formatter = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

/**
 * Format currency without symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted number string
 */
export const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return "-";

  return new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// ============================================
// NUMBER FORMATTERS
// ============================================

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return "-";

  return new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format percentage
 * @param {number} value - Value to format (0.15 = 15%)
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("en-LK", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format as compact number (e.g., 1K, 1M)
 * @param {number} num - Number to format
 * @returns {string} Compact number
 */
export const formatCompact = (num) => {
  if (num === null || num === undefined) return "-";

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

// ============================================
// TEXT FORMATTERS
// ============================================

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Truncate text with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return "-";
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");
  // Format based on length (Sri Lankan format)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Mask email address
 * @param {string} email - Email to mask
 * @returns {string} Masked email
 */
export const maskEmail = (email) => {
  if (!email) return "-";
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal = localPart.slice(0, 2) + "***";
  return `${maskedLocal}@${domain}`;
};

// ============================================
// INVENTORY FORMATTERS
// ============================================

/**
 * Format batch number
 * @param {string} batchNumber - Batch number
 * @returns {string} Formatted batch number
 */
export const formatBatchNumber = (batchNumber) => {
  return batchNumber || "-";
};

/**
 * Format quantity with unit
 * @param {number} quantity - Quantity
 * @param {string} unit - Unit of measure
 * @returns {string} Formatted quantity with unit
 */
export const formatQuantity = (quantity, unit = "") => {
  if (quantity === null || quantity === undefined) return "-";
  return `${formatNumber(quantity)} ${unit}`.trim();
};

/**
 * Format expiry date with status color class
 * @param {string|Date} expiryDate - Expiry date
 * @returns {object} { formatted, status, colorClass }
 */
export const formatExpiryDate = (expiryDate) => {
  if (!expiryDate) return { formatted: "-", status: "unknown", colorClass: "" };

  const date =
    typeof expiryDate === "string" ? parseISO(expiryDate) : expiryDate;
  if (!isValid(date))
    return { formatted: "-", status: "unknown", colorClass: "" };

  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  let status = "valid";
  let colorClass = "text-green-600";

  if (daysUntilExpiry < 0) {
    status = "expired";
    colorClass = "text-red-600 font-semibold";
  } else if (daysUntilExpiry <= APP_CONFIG.INVENTORY.EXPIRY_CRITICAL_DAYS) {
    status = "critical";
    colorClass = "text-orange-600 font-semibold";
  } else if (daysUntilExpiry <= APP_CONFIG.INVENTORY.EXPIRY_WARNING_DAYS) {
    status = "warning";
    colorClass = "text-yellow-600";
  }

  return {
    formatted: formatDate(date),
    status,
    colorClass,
    daysUntilExpiry,
  };
};
