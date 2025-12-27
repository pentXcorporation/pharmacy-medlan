import { PERMISSIONS, ROLE_HIERARCHY } from '../constants/authConstants';

/**
 * Auth Helper Functions
 */

/**
 * Check if user has permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return PERMISSIONS[permission]?.includes(userRole) || false;
};

/**
 * Check if user can access route
 * @param {string} userRole - User's role
 * @param {string} route - Route path
 * @returns {boolean}
 */
export const canAccessRoute = (userRole, route) => {
  const routePermissions = {
    '/': 'VIEW_DASHBOARD',
    '/pos': 'ACCESS_POS',
    '/products': 'VIEW_PRODUCTS',
    '/categories': 'VIEW_CATEGORIES',
    '/inventory': 'VIEW_INVENTORY',
    '/purchase-orders': 'VIEW_PURCHASE_ORDERS',
    '/grn': 'VIEW_GRN',
    '/sales': 'VIEW_SALES',
    '/sale-returns': 'ACCESS_POS',
    '/customers': 'VIEW_CUSTOMERS',
    '/suppliers': 'VIEW_SUPPLIERS',
    '/reports': 'VIEW_REPORTS',
    '/users': 'VIEW_USERS',
    '/branches': 'VIEW_BRANCHES',
    '/settings': 'VIEW_SETTINGS',
    '/audit-logs': 'VIEW_AUDIT_LOGS',
  };
  
  const permission = routePermissions[route];
  return permission ? hasPermission(userRole, permission) : false;
};

/**
 * Get user's role level
 * @param {string} role - Role to check
 * @returns {number} - Role level index
 */
export const getRoleLevel = (role) => {
  return ROLE_HIERARCHY.indexOf(role);
};

/**
 * Check if user role is at or above given level
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required minimum role
 * @returns {boolean}
 */
export const hasRoleLevel = (userRole, requiredRole) => {
  const userLevel = getRoleLevel(userRole);
  const requiredLevel = getRoleLevel(requiredRole);
  return userLevel >= requiredLevel;
};

/**
 * Check if user has any of the given roles
 * @param {string} userRole - User's role
 * @param {string[]} roles - Roles to check
 * @returns {boolean}
 */
export const hasAnyRole = (userRole, roles) => {
  return roles.includes(userRole);
};

/**
 * Get default redirect path based on role
 * @param {string} role - User's role
 * @returns {string} - Default path for role
 */
export const getDefaultPathForRole = (role) => {
  const rolePaths = {
    ADMIN: '/admin/dashboard',
    MANAGER: '/branch-manager/dashboard',
    BRANCH_MANAGER: '/branch-manager/dashboard',
    PHARMACIST: '/pharmacist/dashboard',
    CASHIER: '/employee/pos',
    INVENTORY_MANAGER: '/employee/inventory',
    EMPLOYEE: '/employee/dashboard',
  };
  
  return rolePaths[role] || '/';
};

/**
 * Get allowed routes for role
 * @param {string} role - User's role
 * @returns {string[]} - Array of allowed routes
 */
export const getAllowedRoutesForRole = (role) => {
  const allowedRoutes = [];
  
  for (const [route, permission] of Object.entries({
    '/': 'VIEW_DASHBOARD',
    '/pos': 'ACCESS_POS',
    '/products': 'VIEW_PRODUCTS',
    '/categories': 'VIEW_CATEGORIES',
    '/inventory': 'VIEW_INVENTORY',
    '/purchase-orders': 'VIEW_PURCHASE_ORDERS',
    '/grn': 'VIEW_GRN',
    '/sales': 'VIEW_SALES',
    '/sale-returns': 'ACCESS_POS',
    '/customers': 'VIEW_CUSTOMERS',
    '/suppliers': 'VIEW_SUPPLIERS',
    '/reports': 'VIEW_REPORTS',
    '/users': 'VIEW_USERS',
    '/branches': 'VIEW_BRANCHES',
  })) {
    if (hasPermission(role, permission)) {
      allowedRoutes.push(route);
    }
  }
  
  return allowedRoutes;
};

/**
 * Format user display name
 * @param {Object} user - User object
 * @returns {string} - Formatted display name
 */
export const formatUserDisplayName = (user) => {
  if (!user) return '';
  return user.fullName || user.username || user.email || '';
};

/**
 * Get user initials
 * @param {Object} user - User object
 * @returns {string} - User initials (max 2 chars)
 */
export const getUserInitials = (user) => {
  if (!user) return '';
  
  const name = user.fullName || user.username || '';
  const parts = name.split(' ').filter(Boolean);
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  return name.slice(0, 2).toUpperCase();
};
