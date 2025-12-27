/**
 * API URL Constants
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Application Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  
  // POS
  POS: '/pos',
  
  // Inventory
  INVENTORY: '/inventory',
  PRODUCTS: '/inventory/products',
  CATEGORIES: '/inventory/categories',
  STOCK_TRANSFER: '/inventory/stock-transfer',
  STOCK_ADJUSTMENT: '/inventory/adjustment',
  
  // Sales
  SALES: '/sales',
  SALE_RETURNS: '/sales/returns',
  
  // Purchases
  PURCHASES: '/purchases',
  PURCHASE_ORDERS: '/purchases/orders',
  GRN: '/purchases/grn',
  SUPPLIERS: '/purchases/suppliers',
  
  // Customers
  CUSTOMERS: '/customers',
  
  // Reports
  REPORTS: '/reports',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_BRANCHES: '/admin/branches',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  ADMIN_ANALYTICS: '/admin/analytics',
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebarState',
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MM/dd/yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

/**
 * Currency Settings
 */
export const CURRENCY = {
  DEFAULT: 'LKR',
  SYMBOL: 'Rs.',
  DECIMAL_PLACES: 2,
};

/**
 * Theme Constants
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * Breakpoints (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

/**
 * Query Keys for React Query
 */
export const QUERY_KEYS = {
  // Auth
  USER: ['user'],
  
  // Products
  PRODUCTS: ['products'],
  PRODUCT: (id) => ['product', id],
  
  // Categories
  CATEGORIES: ['categories'],
  CATEGORY: (id) => ['category', id],
  
  // Inventory
  INVENTORY: ['inventory'],
  STOCK: ['stock'],
  
  // Sales
  SALES: ['sales'],
  SALE: (id) => ['sale', id],
  
  // Purchases
  PURCHASE_ORDERS: ['purchaseOrders'],
  PURCHASE_ORDER: (id) => ['purchaseOrder', id],
  GRN: ['grn'],
  
  // Suppliers
  SUPPLIERS: ['suppliers'],
  SUPPLIER: (id) => ['supplier', id],
  
  // Customers
  CUSTOMERS: ['customers'],
  CUSTOMER: (id) => ['customer', id],
  
  // Users
  USERS: ['users'],
  USER_DETAIL: (id) => ['user', id],
  
  // Branches
  BRANCHES: ['branches'],
  BRANCH: (id) => ['branch', id],
  
  // Reports
  REPORTS: ['reports'],
  DASHBOARD_STATS: ['dashboardStats'],
  
  // Audit
  AUDIT_LOGS: ['auditLogs'],
  
  // Settings
  SETTINGS: ['settings'],
};

export default {
  API_BASE_URL,
  ROUTES,
  STORAGE_KEYS,
  HTTP_STATUS,
  PAGINATION,
  DATE_FORMATS,
  CURRENCY,
  THEMES,
  BREAKPOINTS,
  QUERY_KEYS,
};
