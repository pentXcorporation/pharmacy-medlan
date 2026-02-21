/**
 * API Configuration
 * Central configuration for all API-related settings
 */

export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_BASE_URL,

  // Auth endpoints (no /api prefix as they're at root)
  AUTH_URL: import.meta.env.VITE_AUTH_URL,

  // WebSocket URL
  WS_URL: import.meta.env.VITE_WS_URL,

  // Enable WebSocket features
  ENABLE_WEBSOCKET: import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false',

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
  },

  // Token configuration
  TOKEN: {
    ACCESS_KEY: "accessToken",
    REFRESH_KEY: "refreshToken",
    USER_KEY: "user",
  },

  // Headers
  HEADERS: {
    CONTENT_TYPE: "application/json",
    ACCEPT: "application/json",
  },
};

// API Endpoints organized by domain
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REGISTER_INITIAL: "/auth/register/initial",
  },

  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id) => `/users/${id}`,
    BY_USERNAME: (username) => `/users/username/${username}`,
    ACTIVE: "/users/active",
    BY_ROLE: (role) => `/users/role/${role}`,
    BY_BRANCH: (branchId) => `/users/branch/${branchId}`,
    RESET_PASSWORD: (id) => `/users/${id}/reset-password`,
    ACTIVATE: (id) => `/users/${id}/activate`,
    DEACTIVATE: (id) => `/users/${id}/deactivate`,
  },

  // Branches
  BRANCHES: {
    BASE: "/branches",
    BY_ID: (id) => `/branches/${id}`,
    BY_CODE: (code) => `/branches/code/${code}`,
    ALL: "/branches/all",
    ACTIVE: "/branches/active",
    STAFF: (id) => `/branches/${id}/staff`,
    ACTIVATE: (id) => `/branches/${id}/activate`,
    DEACTIVATE: (id) => `/branches/${id}/deactivate`,
  },

  // Branch Staff
  BRANCH_STAFF: {
    BASE: "/branch-staff",
    BY_ID: (id) => `/branch-staff/${id}`,
    BY_BRANCH: (branchId) => `/branch-staff/branch/${branchId}`,
    BY_USER: (userId) => `/branch-staff/user/${userId}`,
    PRIMARY: (userId) => `/branch-staff/user/${userId}/primary`,
  },

  // Smart Scanning
  SCAN: {
    PROCESS: "/scan",
    POS_LOOKUP: (barcode) => `/scan/pos/${barcode}`,
    RECEIVING_LOOKUP: (barcode) => `/scan/receiving/${barcode}`,
    STOCK_TAKING: (barcode) => `/scan/stock-taking/${barcode}`,
    VERIFY: "/scan/verify",
    BATCH_QR: "/scan/batch-qr",
    BULK: "/scan/bulk",
    HISTORY: "/scan/history",
    CONTEXTS: "/scan/contexts",
  },

  // Products
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id) => `/products/${id}`,
    BY_CODE: (code) => `/products/code/${code}`,
    SEARCH: "/products/search",
    LOW_STOCK: "/products/low-stock",
    BARCODE: (barcode) => `/products/barcode/${barcode}`,
    DISCONTINUE: (id) => `/products/${id}/discontinue`,
    EXPORT: "/products/export",
    IMPORT: "/products/import",
    TEMPLATE: "/products/import/template",
  },

  // Categories
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id) => `/categories/${id}`,
    ACTIVE: "/categories/active",
  },

  // Sub-Categories
  SUB_CATEGORIES: {
    BASE: "/sub-categories",
    BY_ID: (id) => `/sub-categories/${id}`,
    BY_CATEGORY: (categoryId) => `/sub-categories/category/${categoryId}`,
  },

  // Units
  UNITS: {
    BASE: "/units",
    BY_ID: (id) => `/units/${id}`,
    ACTIVE: "/units/active",
  },

  // Inventory
  INVENTORY: {
    BASE: "/inventory",
    BY_BRANCH: (branchId) => `/inventory/branch/${branchId}`,
    BY_PRODUCT_AND_BRANCH: (productId, branchId) =>
      `/inventory/product/${productId}/branch/${branchId}`,
    LOW_STOCK: (branchId) => `/inventory/branch/${branchId}/low-stock`,
    OUT_OF_STOCK: (branchId) => `/inventory/branch/${branchId}/out-of-stock`,
    EXPIRING: (branchId) => `/inventory/branch/${branchId}/expiring`,
    EXPIRED: (branchId) => `/inventory/branch/${branchId}/expired`,
    BATCHES: (productId, branchId) =>
      `/inventory/product/${productId}/branch/${branchId}/batches`,
    AVAILABLE_QUANTITY: (productId, branchId) =>
      `/inventory/product/${productId}/branch/${branchId}/available`,
    ALL_LOW_STOCK: "/inventory/low-stock",
    ALL_OUT_OF_STOCK: "/inventory/out-of-stock",
    ALL_EXPIRING: "/inventory/expiring",
    ALL_EXPIRED: "/inventory/expired",
  },

  // Inventory Transactions
  INVENTORY_TRANSACTIONS: {
    BASE: "/inventory-transactions",
    BY_ID: (id) => `/inventory-transactions/${id}`,
    BY_BRANCH: (branchId) => `/inventory-transactions/branch/${branchId}`,
  },

  // GRN (Goods Received Note)
  GRN: {
    BASE: "/grn",
    BY_ID: (id) => `/grn/${id}`,
    BY_NUMBER: (number) => `/grn/number/${number}`,
    BY_BRANCH: (branchId) => `/grn/branch/${branchId}`,
    BY_SUPPLIER: (supplierId) => `/grn/supplier/${supplierId}`,
    BY_STATUS: (status) => `/grn/status/${status}`,
    PENDING: (branchId) => `/grn/branch/${branchId}/pending`,
    APPROVE: (id) => `/grn/${id}/approve`,
    REJECT: (id) => `/grn/${id}/reject`,
    CANCEL: (id) => `/grn/${id}/cancel`,
  },

  // RGRN (Return GRN)
  RGRN: {
    BASE: "/rgrns",
    BY_ID: (id) => `/rgrns/${id}`,
    BY_NUMBER: (number) => `/rgrns/number/${number}`,
    BY_BRANCH: (branchId) => `/rgrns/branch/${branchId}`,
    BY_SUPPLIER: (supplierId) => `/rgrns/supplier/${supplierId}`,
    BY_GRN: (grnId) => `/rgrns/grn/${grnId}`,
    UPDATE_REFUND_STATUS: (id) => `/rgrns/${id}/refund-status`,
  },

  // Stock Transfers
  STOCK_TRANSFERS: {
    BASE: "/stock-transfers",
    BY_ID: (id) => `/stock-transfers/${id}`,
    BY_NUMBER: (number) => `/stock-transfers/number/${number}`,
    BY_BRANCH: (branchId) => `/stock-transfers/branch/${branchId}`,
    BY_SOURCE: (branchId) => `/stock-transfers/from-branch/${branchId}`,
    BY_DESTINATION: (branchId) => `/stock-transfers/to-branch/${branchId}`,
    BY_STATUS: (status) => `/stock-transfers/status/${status}`,
    PENDING: (branchId) => `/stock-transfers/branch/${branchId}/pending`,
    APPROVE: (id) => `/stock-transfers/${id}/approve`,
    REJECT: (id) => `/stock-transfers/${id}/reject`,
    RECEIVE: (id) => `/stock-transfers/${id}/receive`,
    CANCEL: (id) => `/stock-transfers/${id}/cancel`,
  },

  // Suppliers
  SUPPLIERS: {
    BASE: "/suppliers",
    BY_ID: (id) => `/suppliers/${id}`,
    BY_CODE: (code) => `/suppliers/code/${code}`,
    SEARCH: "/suppliers/search",
    ACTIVE: "/suppliers/active",
    ACTIVATE: (id) => `/suppliers/${id}/activate`,
    DEACTIVATE: (id) => `/suppliers/${id}/deactivate`,
  },

  // Purchase Orders
  PURCHASE_ORDERS: {
    BASE: "/purchase-orders",
    BY_ID: (id) => `/purchase-orders/${id}`,
    BY_NUMBER: (number) => `/purchase-orders/number/${number}`,
    BY_BRANCH: (branchId) => `/purchase-orders/branch/${branchId}`,
    BY_SUPPLIER: (supplierId) => `/purchase-orders/supplier/${supplierId}`,
    BY_STATUS: (status) => `/purchase-orders/status/${status}`,
    PENDING: (branchId) => `/purchase-orders/branch/${branchId}/pending`,
    DRAFTS: (branchId) => `/purchase-orders/branch/${branchId}/drafts`,
    UPDATE_STATUS: (id) => `/purchase-orders/${id}/status`,
    SUBMIT: (id) => `/purchase-orders/${id}/submit`,
    APPROVE: (id) => `/purchase-orders/${id}/approve`,
    REJECT: (id) => `/purchase-orders/${id}/reject`,
    CANCEL: (id) => `/purchase-orders/${id}/cancel`,
  },

  // Supplier Payments
  SUPPLIER_PAYMENTS: {
    BASE: "/supplier-payments",
    BY_ID: (id) => `/supplier-payments/${id}`,
    BY_SUPPLIER: (supplierId) => `/supplier-payments/supplier/${supplierId}`,
  },

  // Customers
  CUSTOMERS: {
    BASE: "/customers",
    BY_ID: (id) => `/customers/${id}`,
    BY_CODE: (code) => `/customers/code/${code}`,
    SEARCH: "/customers/search",
    ACTIVE: "/customers/active",
    ACTIVATE: (id) => `/customers/${id}/activate`,
    DEACTIVATE: (id) => `/customers/${id}/deactivate`,
  },

  // Sales
  SALES: {
    BASE: "/sales",
    LIST: "/sales",
    BY_ID: (id) => `/sales/${id}`,
    BY_NUMBER: (number) => `/sales/number/${number}`,
    BY_BRANCH: (branchId) => `/sales/branch/${branchId}`,
    BY_CUSTOMER: (customerId) => `/sales/customer/${customerId}`,
    BY_DATE_RANGE: "/sales/date-range",
    BY_STATUS: (status) => `/sales/status/${status}`,
    CANCEL: (id) => `/sales/${id}/cancel`,
    VOID: (id) => `/sales/${id}/void`,
    TOTAL_AMOUNT: "/sales/total-amount",
    COUNT: "/sales/count",
  },

  // Sale Returns
  SALE_RETURNS: {
    BASE: "/sale-returns",
    BY_ID: (id) => `/sale-returns/${id}`,
    BY_NUMBER: (number) => `/sale-returns/number/${number}`,
    BY_BRANCH: (branchId) => `/sale-returns/branch/${branchId}`,
    BY_CUSTOMER: (customerId) => `/sale-returns/customer/${customerId}`,
    BY_SALE: (saleId) => `/sale-returns/sale/${saleId}`,
  },

  // Invoices
  INVOICES: {
    BASE: "/invoices",
    BY_ID: (id) => `/invoices/${id}`,
    BY_NUMBER: (number) => `/invoices/number/${number}`,
    BY_BRANCH: (branchId) => `/invoices/branch/${branchId}`,
    BY_CUSTOMER: (customerId) => `/invoices/customer/${customerId}`,
    BY_STATUS: (status) => `/invoices/status/${status}`,
    BY_PAYMENT_STATUS: (status) => `/invoices/payment-status/${status}`,
    OVERDUE: "/invoices/overdue",
    RECORD_PAYMENT: (id) => `/invoices/${id}/payment`,
    OUTSTANDING_BY_CUSTOMER: (customerId) =>
      `/invoices/customer/${customerId}/outstanding`,
    BY_SALE: (saleId) => `/invoices/sale/${saleId}`,
  },

  // Prescriptions
  PRESCRIPTIONS: {
    BASE: "/prescriptions",
    BY_ID: (id) => `/prescriptions/${id}`,
    BY_CUSTOMER: (customerId) => `/prescriptions/customer/${customerId}`,
  },

  // Customer Prescriptions
  CUSTOMER_PRESCRIPTIONS: {
    BASE: "/customer-prescriptions",
    BY_ID: (id) => `/customer-prescriptions/${id}`,
    BY_CUSTOMER: (customerId) =>
      `/customer-prescriptions/customer/${customerId}`,
  },

  // Finance - Banks
  BANKS: {
    BASE: "/banks",
    BY_ID: (id) => `/banks/${id}`,
    ACTIVE: "/banks/active",
    TOTAL_BALANCE: "/banks/total-balance",
  },

  // Finance - Cash Book
  CASH_BOOK: {
    BASE: "/cashbook",
    BY_ID: (id) => `/cashbook/${id}`,
    BY_BRANCH: (branchId) => `/cashbook/branch/${branchId}`,
    DATE_RANGE: "/cashbook/date-range",
    BRANCH_DATE_RANGE: (branchId) => `/cashbook/branch/${branchId}/date-range`,
    SUMMARY: "/cashbook/summary",
    EXPORT: "/cashbook/export",
  },

  // Finance - Cheques
  CHEQUES: {
    BASE: "/cheques",
    BY_ID: (id) => `/cheques/${id}`,
    UPDATE_STATUS: (id) => `/cheques/${id}/status`,
    DEPOSIT: (id) => `/cheques/${id}/deposit`,
    CLEAR: (id) => `/cheques/${id}/clear`,
    BOUNCE: (id) => `/cheques/${id}/bounce`,
    CANCEL: (id) => `/cheques/${id}/cancel`,
    RECONCILE: (id) => `/cheques/${id}/reconcile`,
    STATS: "/cheques/stats",
    STATS_DATE_RANGE: "/cheques/stats/date-range",
  },

  // Finance - Cash Register
  CASH_REGISTER: {
    BASE: "/cash-register",
    OPEN: "/cash-register/open",
    CLOSE: (id) => `/cash-register/${id}/close`,
    CASH_IN: (id) => `/cash-register/${id}/cash-in`,
    CASH_OUT: (id) => `/cash-register/${id}/cash-out`,
    DEPOSIT: (id) => `/cash-register/${id}/deposit`,
    CURRENT: "/cash-register/current",
    BY_ID: (id) => `/cash-register/${id}`,
    BY_BRANCH: (branchId) => `/cash-register/branch/${branchId}`,
    BRANCH_DATE_RANGE: (branchId) => `/cash-register/branch/${branchId}/date-range`,
    TRANSACTIONS: (id) => `/cash-register/${id}/transactions`,
    DAILY_SUMMARY: "/cash-register/daily-summary",
  },

  // Transaction Types
  TRANSACTION_TYPES: {
    BASE: "/transaction-types",
    BY_ID: (id) => `/transaction-types/${id}`,
    BY_NAME: (name) => `/transaction-types/name/${name}`,
    ACTIVE: "/transaction-types/active",
    BY_INCOME_TYPE: (isIncome) => `/transaction-types/income-type/${isIncome}`,
    ACTIVATE: (id) => `/transaction-types/${id}/activate`,
    DEACTIVATE: (id) => `/transaction-types/${id}/deactivate`,
  },

  // Payroll
  PAYROLL: {
    BASE: "/payroll",
    BY_ID: (id) => `/payroll/${id}`,
    BY_EMPLOYEE: (employeeId) => `/payroll/employee/${employeeId}`,
    DATE_RANGE: "/payroll/date-range",
    EXPORT: "/payroll/export",
  },

  // Employees
  EMPLOYEES: {
    BASE: "/employees",
    BY_ID: (id) => `/employees/${id}`,
  },

  // Attendance
  ATTENDANCE: {
    BASE: "/attendance",
    BY_ID: (id) => `/attendance/${id}`,
    STATS_TODAY: "/attendance/stats/today",
    BY_EMPLOYEE: (id) => `/attendance/employee/${id}`,
    APPROVE: (id) => `/attendance/${id}/approve`,
  },

  // Employee Authorization
  EMPLOYEE_AUTH: {
    REQUEST: "/employee-authorizations/request",
    APPROVE: (id) => `/employee-authorizations/${id}/approve`,
    REJECT: (id) => `/employee-authorizations/${id}/reject`,
    BY_ID: (id) => `/employee-authorizations/${id}`,
    BY_CODE: (code) => `/employee-authorizations/code/${code}`,
    BY_EMPLOYEE: (id) => `/employee-authorizations/employee/${id}`,
    BY_STATUS: (status) => `/employee-authorizations/status/${status}`,
    PENDING: (branchId) => `/employee-authorizations/branch/${branchId}/pending`,
    VALIDATE: (code) => `/employee-authorizations/validate/${code}`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/summary",
    SUMMARY: "/dashboard/summary",
    SALES_CHART: "/dashboard/sales-chart",
  },

  // Super Admin Dashboard
  SUPER_ADMIN_DASHBOARD: {
    BASE: "/dashboard/super-admin",
    SYSTEM_METRICS: "/dashboard/super-admin/system-metrics",
    BRANCH_ANALYTICS: "/dashboard/super-admin/branch-analytics",
    BUSINESS_METRICS: "/dashboard/super-admin/business-metrics",
    INVENTORY_OVERVIEW: "/dashboard/super-admin/inventory-overview",
    USER_STATISTICS: "/dashboard/super-admin/user-statistics",
    FINANCIAL_SUMMARY: "/dashboard/super-admin/financial-summary",
    RECENT_ACTIVITIES: "/dashboard/super-admin/recent-activities",
    HEALTH: "/dashboard/super-admin/health",
  },

  // Reports
  REPORTS: {
    // Sales Reports (Core)
    SALES: {
      TOTAL: "/reports/sales/total",
      COUNT: "/reports/sales/count",
      DETAILS: "/reports/sales/details",
      DAILY: "/reports/sales/daily",
      TOP_PRODUCTS: "/reports/sales/top-products",
      BY_PAYMENT_METHOD: "/reports/sales/by-payment-method",
      COMPARISON: "/reports/sales/comparison",
      // Enhanced Sales Analytics
      HOURLY: "/reports/sales/hourly",
      BY_DAY_OF_WEEK: "/reports/sales/by-day-of-week",
      WEEKLY: "/reports/sales/weekly",
      MONTHLY: "/reports/sales/monthly",
      TREND: "/reports/sales/trend",
      DASHBOARD: "/reports/sales/dashboard",
      // Customer Analysis
      TOP_CUSTOMERS: "/reports/sales/top-customers",
      CUSTOMER_FREQUENCY: "/reports/sales/customer-frequency",
      NEW_VS_RETURNING: "/reports/sales/new-vs-returning-customers",
      // Returns & Discounts
      RETURNS_SUMMARY: "/reports/sales/returns/summary",
      RETURNS_DAILY_TREND: "/reports/sales/returns/daily-trend",
      DISCOUNTS: "/reports/sales/discounts",
    },
    // Product Reports
    PRODUCTS: {
      TOP_BY_QUANTITY: "/reports/products/top-by-quantity",
      TOP_BY_REVENUE: "/reports/products/top-by-revenue",
      SLOWEST_MOVING: "/reports/products/slowest-moving",
      NEVER_SOLD: "/reports/products/never-sold",
      SALES_VELOCITY: "/reports/products/sales-velocity",
      BY_CATEGORY: "/reports/products/by-category",
      BY_SUB_CATEGORY: "/reports/products/by-sub-category",
      STOCK_BY_CATEGORY: "/reports/products/stock-by-category",
      COUNT_BY_CATEGORY: "/reports/products/count-by-category",
      MARGINS: "/reports/products/margins",
      HIGHEST_MARGIN: "/reports/products/highest-margin",
      LOWEST_MARGIN: "/reports/products/lowest-margin",
      PROFIT_CONTRIBUTION: "/reports/products/profit-contribution",
      HIGH_RETURN_RATE: "/reports/products/high-return-rate",
      DISCOUNT_ANALYSIS: "/reports/products/discount-analysis",
      BY_PRICE_RANGE: "/reports/products/by-price-range",
      BATCH_REPORT: "/reports/products/batch-report",
      MULTI_BATCH: "/reports/products/multi-batch",
      EXPIRY_LOSS_PROJECTION: "/reports/products/expiry-loss-projection",
      MASTER: "/reports/products/master",
      ACTIVITY_SUMMARY: "/reports/products/activity-summary",
    },
    // Inventory Reports
    INVENTORY: {
      STOCK_VALUE: "/reports/inventory/stock-value",
      VALUE_BY_CATEGORY: "/reports/inventory/stock-value/by-category",
      STOCK_MOVEMENT: "/reports/inventory/stock-movement",
      STOCK_IN_VS_OUT: "/reports/inventory/stock-in-vs-out",
      LOW_STOCK: "/reports/inventory/low-stock",
      EXPIRING: "/reports/inventory/expiring",
      EXPIRED: "/reports/inventory/expired",
      TURNOVER: "/reports/inventory/turnover",
      TURNOVER_BY_PRODUCT: "/reports/inventory/turnover/by-product",
      DEAD_STOCK: "/reports/inventory/dead-stock",
      VALUATION: "/reports/inventory/valuation",
      BATCH_AGING: "/reports/inventory/batch-aging",
      CROSS_BRANCH: "/reports/inventory/cross-branch",
      STOCK_TRANSFER_SUMMARY: "/reports/inventory/stock-transfer-summary",
      SUMMARY: "/reports/inventory/summary",
      HEALTH_DASHBOARD: "/reports/inventory/health-dashboard",
    },
    // Financial Reports
    FINANCIAL: {
      REVENUE: "/reports/financial/revenue",
      DAILY_REVENUE: "/reports/financial/daily-revenue",
      REVENUE_BY_CATEGORY: "/reports/financial/revenue-by-category",
      PROFIT_LOSS: "/reports/financial/profit-loss",
      CASH_FLOW: "/reports/financial/cash-flow",
      RECEIVABLES: "/reports/financial/receivables",
      AGEING: "/reports/financial/ageing",
      TAX: "/reports/financial/tax-summary",
      SUMMARY: "/reports/financial/summary",
    },
    // Employee Reports
    EMPLOYEES: {
      ATTENDANCE_SUMMARY: "/reports/employees/attendance-summary",
      ATTENDANCE_DETAIL: (id) => `/reports/employees/${id}/attendance`,
      ATTENDANCE_RATE: "/reports/employees/attendance-rate",
      TOP_ABSENTEES: "/reports/employees/top-absentees",
      LATE_ARRIVALS: "/reports/employees/late-arrivals",
      WORK_HOURS: "/reports/employees/work-hours",
      OVERTIME: "/reports/employees/overtime",
      PAYROLL_SUMMARY: "/reports/employees/payroll-summary",
      PAYROLL_BREAKDOWN: "/reports/employees/payroll-breakdown",
      PAYROLL_TREND: "/reports/employees/payroll-trend",
      PAYROLL_BY_TYPE: "/reports/employees/payroll-by-employment-type",
      SALES_PERFORMANCE: "/reports/employees/sales-performance",
      TRANSACTION_COUNT: "/reports/employees/transaction-count",
      TOP_PERFORMERS: "/reports/employees/top-performers",
      SCORECARD: (id) => `/reports/employees/${id}/scorecard`,
      HEADCOUNT: "/reports/employees/headcount",
      TENURE: "/reports/employees/tenure",
      SALARY_DISTRIBUTION: "/reports/employees/salary-distribution",
      MASTER: "/reports/employees/master",
    },
    // Supplier Reports
    SUPPLIERS: {
      PURCHASE_SUMMARY: "/reports/suppliers/purchase-summary",
      PURCHASE_BY_SUPPLIER: "/reports/suppliers/purchase-by-supplier",
      PURCHASE_TREND: "/reports/suppliers/purchase-trend",
      TOP: "/reports/suppliers/top",
      GRN_REPORT: "/reports/suppliers/grn-report",
      PAYMENT_SUMMARY: "/reports/suppliers/payment-summary",
      PAYABLES_AGEING: "/reports/suppliers/payables-ageing",
      PAYMENT_HISTORY: (id) => `/reports/suppliers/${id}/payment-history`,
      OVERDUE_PAYMENTS: "/reports/suppliers/overdue-payments",
      DELIVERY_PERFORMANCE: "/reports/suppliers/delivery-performance",
      RETURN_RATE: "/reports/suppliers/return-rate",
      PRODUCT_MIX: (id) => `/reports/suppliers/${id}/product-mix`,
      MASTER: "/reports/suppliers/master",
    },
    // Alerts
    ALERTS: {
      ALL: "/reports/alerts",
      COUNT: "/reports/alerts/count",
      LOW_STOCK: "/reports/alerts/low-stock",
      EXPIRY: "/reports/alerts/expiry",
      OVERDUE: "/reports/alerts/overdue-invoices",
      ACKNOWLEDGE: (id) => `/reports/alerts/${id}/acknowledge`,
    },
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: "/notifications",
    BY_ID: (id) => `/notifications/${id}`,
    UNREAD: "/notifications/unread",
    UNREAD_COUNT: "/notifications/count",
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
    SEND_BULK: "/notifications/bulk",
    SEND_TO_BRANCH: (branchId) => `/notifications/branch/${branchId}`,
    SEND_TO_ROLE: "/notifications/role",
    DELETE_ALL: "/notifications/all",
  },

  // System Config
  SYSTEM_CONFIG: {
    BASE: "/system-config",
    BY_ID: (id) => `/system-config/${id}`,
    BY_KEY: (key) => `/system-config/key/${key}`,
    BY_CATEGORY: (cat) => `/system-config/category/${cat}`,
    EDITABLE: "/system-config/editable",
  },

  // Bin Cards
  BIN_CARDS: {
    BY_PRODUCT: (productId) => `/bin-cards/product/${productId}`,
    BY_PRODUCT_BRANCH: (productId, branchId) =>
      `/bin-cards/product/${productId}/branch/${branchId}`,
    BY_PRODUCT_BRANCH_DATE: (productId, branchId) =>
      `/bin-cards/product/${productId}/branch/${branchId}/date-range`,
    BY_BRANCH: (branchId) => `/bin-cards/branch/${branchId}`,
    BALANCE: (productId, branchId) =>
      `/bin-cards/product/${productId}/branch/${branchId}/balance`,
  },

  // Barcode & QR
  BARCODES: {
    GENERATE: "/barcodes/generate",
    PRODUCT_BARCODE: (productId) => `/barcodes/product/${productId}`,
    BULK: "/barcodes/bulk",
    SHELF_LABEL: (productId) => `/barcodes/shelf-label/${productId}`,
    QR_GENERATE: "/barcodes/qr/generate",
    QR_PRODUCT: (productId) => `/barcodes/qr/product/${productId}`,
    QR_BATCH: (batchId) => `/barcodes/qr/batch/${batchId}`,
    QR_INVOICE: (invoiceId) => `/barcodes/qr/invoice/${invoiceId}`,
    QR_PRESCRIPTION: (prescriptionId) => `/barcodes/qr/prescription/${prescriptionId}`,
    DECODE_BARCODE: "/barcodes/decode/barcode",
    DECODE_QR: "/barcodes/decode/qr",
    VALIDATE: "/barcodes/validate",
    GENERATE_UNIQUE: "/barcodes/generate-unique",
    GENERATE_EAN13: "/barcodes/generate-ean13",
    FORMATS: "/barcodes/formats",
  },

  // Inventory Maintenance
  INVENTORY_MAINTENANCE: {
    SYNC_BRANCH: "/inventory/maintenance/sync-branch-inventory",
    STATUS: "/inventory/maintenance/branch-inventory-status",
    DIAGNOSTIC: (productId, branchId) =>
      `/inventory/maintenance/diagnostic/${productId}/${branchId}`,
  },

  // Sync
  SYNC: {
    START: "/sync/start",
    COMPLETE: (id) => `/sync/${id}/complete`,
    FAIL: (id) => `/sync/${id}/fail`,
    BY_BRANCH: (branchId) => `/sync/branch/${branchId}`,
    BY_TYPE: (type) => `/sync/type/${type}`,
    BY_STATUS: (status) => `/sync/status/${status}`,
    LATEST: (type) => `/sync/latest/${type}`,
  },
};