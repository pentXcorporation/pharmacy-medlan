/**
 * Local Storage Utilities
 * Typed storage helpers with JSON serialization
 */

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

/**
 * Set item in localStorage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

/**
 * Clear all localStorage
 */
export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

/**
 * Get item from sessionStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export const getSessionItem = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

/**
 * Set item in sessionStorage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export const setSessionItem = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to sessionStorage:", error);
  }
};

/**
 * Remove item from sessionStorage
 * @param {string} key - Storage key
 */
export const removeSessionItem = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from sessionStorage:", error);
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  THEME: "theme",
  SIDEBAR_COLLAPSED: "sidebarCollapsed",
  SELECTED_BRANCH: "selectedBranch",
  CART: "cart",
  HELD_SALES: "heldSales",
  TABLE_PAGE_SIZE: "tablePageSize",
  RECENT_SEARCHES: "recentSearches",
};
