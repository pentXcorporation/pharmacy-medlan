// Admin Module Constants

/**
 * Admin navigation items
 */
export const ADMIN_NAVIGATION = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: 'Users',
  },
  {
    name: 'Roles & Permissions',
    path: '/admin/roles',
    icon: 'Shield',
  },
  {
    name: 'Branches',
    path: '/admin/branches',
    icon: 'Building2',
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: 'Settings',
  },
  {
    name: 'Audit Logs',
    path: '/admin/audit-logs',
    icon: 'FileText',
  },
];

/**
 * User status options
 */
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
};

/**
 * Audit log action types
 */
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  SETTING_CHANGE: 'SETTING_CHANGE',
};

/**
 * System settings categories
 */
export const SETTINGS_CATEGORIES = {
  GENERAL: 'general',
  SECURITY: 'security',
  NOTIFICATIONS: 'notifications',
  APPEARANCE: 'appearance',
  INTEGRATIONS: 'integrations',
};

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};
