/**
 * API Configuration
 * Central configuration for all API-related settings
 */

export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // Auth endpoints (no /api prefix as they're at root)
  AUTH_URL: import.meta.env.VITE_AUTH_URL || 'http://localhost:8080',
  
  // WebSocket URL
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },
  
  // Token configuration
  TOKEN: {
    ACCESS_KEY: 'accessToken',
    REFRESH_KEY: 'refreshToken',
    USER_KEY: 'user',
  },
  
  // Headers
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    ACCEPT: 'application/json',
  },
};

// API Endpoints organized by domain
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REGISTER_INITIAL: '/auth/register/initial',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    ACTIVE: '/users/active',
    BY_ROLE: (role) => `/users/role/${role}`,
    RESET_PASSWORD: (id) => `/users/${id}/reset-password`,
  },
  
  // Branches
  BRANCHES: {
    BASE: '/branches',
    BY_ID: (id) => `/branches/${id}`,
    ACTIVE: '/branches/active',
    STAFF: (id) => `/branches/${id}/staff`,
  },
  
  // Branch Staff
  BRANCH_STAFF: {
    BASE: '/branch-staff',
    BY_ID: (id) => `/branch-staff/${id}`,
    BY_BRANCH: (branchId) => `/branch-staff/branch/${branchId}`,
  },
  
  // Products
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
    BY_CODE: (code) => `/products/code/${code}`,
    SEARCH: '/products/search',
    LOW_STOCK: '/products/low-stock',
    BARCODE: (barcode) => `/products/barcode/${barcode}`,
  },
  
  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
    ACTIVE: '/categories/active',
  },
  
  // Sub-Categories
  SUB_CATEGORIES: {
    BASE: '/subcategories',
    BY_ID: (id) => `/subcategories/${id}`,
    BY_CATEGORY: (categoryId) => `/subcategories/category/${categoryId}`,
  },
  
  // Units
  UNITS: {
    BASE: '/units',
    BY_ID: (id) => `/units/${id}`,
  },
  
  // Inventory
  INVENTORY: {
    BASE: '/inventory',
    BY_BRANCH: (branchId) => `/inventory/branch/${branchId}`,
    LOW_STOCK: (branchId) => `/inventory/branch/${branchId}/low-stock`,
    OUT_OF_STOCK: (branchId) => `/inventory/branch/${branchId}/out-of-stock`,
    EXPIRING: (branchId) => `/inventory/branch/${branchId}/expiring`,
    EXPIRED: (branchId) => `/inventory/branch/${branchId}/expired`,
    BATCHES: (branchId, productId) => `/inventory/branch/${branchId}/product/${productId}/batches`,
  },
  
  // Inventory Transactions
  INVENTORY_TRANSACTIONS: {
    BASE: '/inventory-transactions',
    BY_ID: (id) => `/inventory-transactions/${id}`,
    BY_BRANCH: (branchId) => `/inventory-transactions/branch/${branchId}`,
  },
  
  // GRN
  GRN: {
    BASE: '/grn',
    BY_ID: (id) => `/grn/${id}`,
    BY_BRANCH: (branchId) => `/grn/branch/${branchId}`,
    PENDING: (branchId) => `/grn/branch/${branchId}/pending`,
    APPROVE: (id) => `/grn/${id}/approve`,
    REJECT: (id) => `/grn/${id}/reject`,
  },
  
  // RGRN (Return GRN)
  RGRN: {
    BASE: '/rgrns',
    BY_ID: (id) => `/rgrns/${id}`,
    BY_BRANCH: (branchId) => `/rgrns/branch/${branchId}`,
  },
  
  // Stock Transfers
  STOCK_TRANSFERS: {
    BASE: '/stock-transfers',
    BY_ID: (id) => `/stock-transfers/${id}`,
    BY_BRANCH: (branchId) => `/stock-transfers/branch/${branchId}`,
    PENDING: (branchId) => `/stock-transfers/branch/${branchId}/pending`,
    APPROVE: (id) => `/stock-transfers/${id}/approve`,
    REJECT: (id) => `/stock-transfers/${id}/reject`,
    RECEIVE: (id) => `/stock-transfers/${id}/receive`,
  },
  
  // Suppliers
  SUPPLIERS: {
    BASE: '/suppliers',
    BY_ID: (id) => `/suppliers/${id}`,
    BY_CODE: (code) => `/suppliers/code/${code}`,
    SEARCH: '/suppliers/search',
    ACTIVE: '/suppliers/active',
  },
  
  // Purchase Orders
  PURCHASE_ORDERS: {
    BASE: '/purchase-orders',
    BY_ID: (id) => `/purchase-orders/${id}`,
    BY_BRANCH: (branchId) => `/purchase-orders/branch/${branchId}`,
    PENDING: (branchId) => `/purchase-orders/branch/${branchId}/pending`,
    APPROVE: (id) => `/purchase-orders/${id}/approve`,
    REJECT: (id) => `/purchase-orders/${id}/reject`,
    CANCEL: (id) => `/purchase-orders/${id}/cancel`,
  },
  
  // Supplier Payments
  SUPPLIER_PAYMENTS: {
    BASE: '/supplier-payments',
    BY_ID: (id) => `/supplier-payments/${id}`,
    BY_SUPPLIER: (supplierId) => `/supplier-payments/supplier/${supplierId}`,
  },
  
  // Customers
  CUSTOMERS: {
    BASE: '/customers',
    BY_ID: (id) => `/customers/${id}`,
    BY_CODE: (code) => `/customers/code/${code}`,
    SEARCH: '/customers/search',
    ACTIVE: '/customers/active',
  },
  
  // Sales
  SALES: {
    BASE: '/sales',
    BY_ID: (id) => `/sales/${id}`,
    BY_BRANCH: (branchId) => `/sales/branch/${branchId}`,
    DATE_RANGE: '/sales/date-range',
    CANCEL: (id) => `/sales/${id}/cancel`,
    VOID: (id) => `/sales/${id}/void`,
    TOTAL: (branchId) => `/sales/branch/${branchId}/total`,
    COUNT: (branchId) => `/sales/branch/${branchId}/count`,
  },
  
  // Sale Returns
  SALE_RETURNS: {
    BASE: '/sale-returns',
    BY_ID: (id) => `/sale-returns/${id}`,
    BY_BRANCH: (branchId) => `/sale-returns/branch/${branchId}`,
    BY_SALE: (saleId) => `/sale-returns/sale/${saleId}`,
  },
  
  // Invoices
  INVOICES: {
    BASE: '/invoices',
    BY_ID: (id) => `/invoices/${id}`,
    BY_SALE: (saleId) => `/invoices/sale/${saleId}`,
  },
  
  // Prescriptions
  PRESCRIPTIONS: {
    BASE: '/prescriptions',
    BY_ID: (id) => `/prescriptions/${id}`,
    BY_CUSTOMER: (customerId) => `/prescriptions/customer/${customerId}`,
  },
  
  // Customer Prescriptions
  CUSTOMER_PRESCRIPTIONS: {
    BASE: '/customer-prescriptions',
    BY_ID: (id) => `/customer-prescriptions/${id}`,
    BY_CUSTOMER: (customerId) => `/customer-prescriptions/customer/${customerId}`,
  },
  
  // Finance - Banks
  BANKS: {
    BASE: '/banks',
    BY_ID: (id) => `/banks/${id}`,
  },
  
  // Finance - Cash Book
  CASH_BOOK: {
    BASE: '/cashbook',
    BY_BRANCH: (branchId) => `/cashbook/branch/${branchId}`,
  },
  
  // Finance - Cheques
  CHEQUES: {
    BASE: '/cheques',
    BY_ID: (id) => `/cheques/${id}`,
  },
  
  // Payroll
  PAYROLL: {
    BASE: '/payroll',
    BY_ID: (id) => `/payroll/${id}`,
    BY_EMPLOYEE: (employeeId) => `/payroll/employee/${employeeId}`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    SALES_CHART: '/dashboard/sales-chart',
  },
  
  // Reports
  REPORTS: {
    SALES: '/reports/sales',
    SALES_DAILY: '/reports/sales/daily',
    SALES_TOP_PRODUCTS: '/reports/sales/top-products',
    SALES_BY_PAYMENT: '/reports/sales/by-payment-method',
    INVENTORY: '/reports/inventory',
    INVENTORY_VALUATION: '/reports/inventory/valuation',
    FINANCIAL: '/reports/financial',
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id) => `/notifications/${id}`,
    UNREAD: '/notifications/unread',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  
  // System Config
  SYSTEM_CONFIG: {
    BASE: '/system-config',
    BY_KEY: (key) => `/system-config/${key}`,
  },
  
  // Bin Cards
  BIN_CARDS: {
    BASE: '/bin-cards',
    BY_PRODUCT: (productId) => `/bin-cards/product/${productId}`,
    BY_BRANCH_PRODUCT: (branchId, productId) => `/bin-cards/branch/${branchId}/product/${productId}`,
  },
};
