/**
 * Route Configuration
 * Central configuration for all application routes
 */

export const ROUTES = {
  // Auth routes (public)
  AUTH: {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    CHANGE_PASSWORD: "/change-password",
  },

  // Dashboard
  DASHBOARD: "/dashboard",

  // POS (Point of Sale)
  POS: {
    ROOT: "/pos",
    NEW_SALE: "/pos/new",
    HELD_SALES: "/pos/held",
    HISTORY: "/pos/history",
    RETURNS: "/pos/returns",
  },

  // Products
  PRODUCTS: {
    ROOT: "/products",
    LIST: "/products",
    NEW: "/products/new",
    EDIT: (id = ":id") => `/products/${id}/edit`,
    VIEW: (id = ":id") => `/products/${id}`,
    LOW_STOCK: "/products/low-stock",
    EXPIRING: "/products/expiring",
  },

  // Categories
  CATEGORIES: {
    ROOT: "/categories",
    LIST: "/categories",
    SUB_CATEGORIES: "/categories/sub",
    UNITS: "/units",
  },

  // Inventory
  INVENTORY: {
    ROOT: "/inventory",
    STOCK: "/inventory",
    LIST: "/inventory",
    MOVEMENTS: "/inventory/movements",
    TRANSFERS: "/inventory/transfers",
    BATCHES: "/inventory/batches",
    ADJUSTMENTS: "/inventory/adjustments",
    LOW_STOCK: "/inventory/low-stock",
    EXPIRY: "/inventory/expiry",
    BIN_CARD: (productId = ":productId") => `/inventory/bin-card/${productId}`,
  },

  // Purchase Orders
  PURCHASE_ORDERS: {
    ROOT: "/purchase-orders",
    LIST: "/purchase-orders",
    NEW: "/purchase-orders/new",
    CREATE: "/purchase-orders/new",
    EDIT: (id = ":id") => `/purchase-orders/${id}/edit`,
    VIEW: (id = ":id") => `/purchase-orders/${id}`,
  },

  // GRN (Goods Received Note)
  GRN: {
    ROOT: "/grn",
    LIST: "/grn",
    CREATE: "/grn/new",
    VIEW: (id = ":id") => `/grn/${id}`,
  },

  // RGRN (Return GRN)
  RGRN: {
    ROOT: "/rgrn",
    LIST: "/rgrn",
    CREATE: "/rgrn/new",
    VIEW: (id = ":id") => `/rgrn/${id}`,
  },

  // Suppliers
  SUPPLIERS: {
    ROOT: "/suppliers",
    LIST: "/suppliers",
    NEW: "/suppliers/new",
    CREATE: "/suppliers/new",
    EDIT: (id = ":id") => `/suppliers/${id}/edit`,
    VIEW: (id = ":id") => `/suppliers/${id}`,
  },

  // Customers
  CUSTOMERS: {
    ROOT: "/customers",
    LIST: "/customers",
    NEW: "/customers/new",
    CREATE: "/customers/new",
    EDIT: (id = ":id") => `/customers/${id}/edit`,
    VIEW: (id = ":id") => `/customers/${id}`,
    CREDITS: "/customers/credits",
  },

  // Finance
  FINANCE: {
    ROOT: "/finance",
    OVERVIEW: "/finance",
    TRANSACTIONS: "/finance/transactions",
    INVOICES: "/finance/invoices",
    CHEQUES: "/finance/cheques",
    CASH_REGISTER: "/finance/cash-register",
    BANKS: "/finance/banks",
    CASH_BOOK: "/finance/cash-book",
    SUMMARY: "/finance/summary",
  },

  // Payroll
  PAYROLL: {
    ROOT: "/payroll",
    LIST: "/payroll",
    SALARIES: "/payroll/salaries",
    ATTENDANCE: "/payroll/attendance",
    ADVANCES: "/payroll/advances",
    PAYSLIP: (id = ":id") => `/payroll/${id}`,
  },

  // Reports
  REPORTS: {
    ROOT: "/reports",
    SALES: "/reports/sales",
    INVENTORY: "/reports/inventory",
    FINANCIAL: "/reports/financial",
    EMPLOYEES: "/reports/employees",
    AUDIT: "/reports/audit",
    PURCHASE: "/reports/purchase",
    EXPIRY: "/reports/expiry",
    PROFIT_LOSS: "/reports/profit-loss",
  },

  // Employees
  EMPLOYEES: {
    ROOT: "/employees",
    LIST: "/employees",
    NEW: "/employees/new",
    EDIT: (id = ":id") => `/employees/${id}/edit`,
    VIEW: (id = ":id") => `/employees/${id}`,
    ATTENDANCE: "/employees/attendance",
  },

  // Branches
  BRANCHES: {
    ROOT: "/branches",
    LIST: "/branches",
    NEW: "/branches/new",
    CREATE: "/branches/new",
    EDIT: (id = ":id") => `/branches/${id}/edit`,
    STAFF: (id = ":id") => `/branches/${id}/staff`,
  },

  // Users
  USERS: {
    ROOT: "/users",
    LIST: "/users",
    NEW: "/users/new",
    CREATE: "/users/new",
    EDIT: (id = ":id") => `/users/${id}/edit`,
    VIEW: (id = ":id") => `/users/${id}`,
  },

  // Settings
  SETTINGS: {
    ROOT: "/settings",
    GENERAL: "/settings/general",
    BRANCH: "/settings/branch",
    TAX: "/settings/tax",
    NOTIFICATIONS: "/settings/notifications",
    PROFILE: "/settings/profile",
    SYSTEM: "/settings/system",
    BACKUP: "/settings/backup",
  },

  // Sales
  SALES: {
    LIST: "/sales",
    VIEW: (id = ":id") => `/sales/${id}`,
  },

  // Sale Returns
  SALE_RETURNS: {
    LIST: "/sale-returns",
    CREATE: "/sale-returns/new",
    VIEW: (id = ":id") => `/sale-returns/${id}`,
  },

  // Invoices
  INVOICES: {
    LIST: "/invoices",
    VIEW: (id = ":id") => `/invoices/${id}`,
  },

  // Prescriptions
  PRESCRIPTIONS: {
    LIST: "/prescriptions",
    VIEW: (id = ":id") => `/prescriptions/${id}`,
  },

  // Supplier Payments
  SUPPLIER_PAYMENTS: {
    LIST: "/supplier-payments",
    CREATE: "/supplier-payments/new",
    VIEW: (id = ":id") => `/supplier-payments/${id}`,
  },

  // Stock Transfers
  STOCK_TRANSFERS: {
    LIST: "/stock-transfers",
    CREATE: "/stock-transfers/new",
    VIEW: (id = ":id") => `/stock-transfers/${id}`,
  },

  // Audit
  AUDIT: {
    LOGS: "/audit/logs",
  },

  // Error pages
  ERRORS: {
    NOT_FOUND: "/404",
    UNAUTHORIZED: "/401",
    SERVER_ERROR: "/500",
  },
};
