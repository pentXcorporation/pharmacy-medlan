/**
 * Permission Utilities
 * Helper functions for role-based access control
 */
import { PERMISSIONS, hasPermission as checkPermission } from '@/constants/permissions';
import { ROLES, ROLE_HIERARCHY } from '@/constants/roles';

/**
 * Check if user has permission for a feature action
 * @param {object} user - User object with role
 * @param {string} feature - Feature name
 * @param {string} action - Action name
 * @returns {boolean}
 */
export const hasPermission = (user, feature, action) => {
  if (!user?.role) return false;
  return checkPermission(user.role, feature, action);
};

/**
 * Check if user has any of the specified roles
 * @param {object} user - User object with role
 * @param {string[]} roles - Array of role names
 * @returns {boolean}
 */
export const hasAnyRole = (user, roles) => {
  if (!user?.role) return false;
  return roles.includes(user.role);
};

/**
 * Check if user has all of the specified roles
 * @param {object} user - User object with role
 * @param {string[]} roles - Array of role names
 * @returns {boolean}
 */
export const hasAllRoles = (user, roles) => {
  if (!user?.role) return false;
  // Single role per user, so this checks if user's role is in all required roles
  return roles.every(role => role === user.role);
};

/**
 * Check if user's role is at least as high as the specified role
 * @param {object} user - User object with role
 * @param {string} minimumRole - Minimum required role
 * @returns {boolean}
 */
export const hasMinimumRole = (user, minimumRole) => {
  if (!user?.role) return false;
  const userLevel = ROLE_HIERARCHY[user.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userLevel >= requiredLevel;
};

/**
 * Check if user is super admin
 * @param {object} user - User object with role
 * @returns {boolean}
 */
export const isSuperAdmin = (user) => {
  return user?.role === ROLES.SUPER_ADMIN;
};

/**
 * Check if user is admin or super admin
 * @param {object} user - User object with role
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return hasAnyRole(user, [ROLES.SUPER_ADMIN, ROLES.ADMIN]);
};

/**
 * Check if user can access POS
 * @param {object} user - User object with role
 * @returns {boolean}
 */
export const canAccessPOS = (user) => {
  return hasAnyRole(user, [ROLES.PHARMACIST, ROLES.CASHIER, ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);
};

/**
 * Check if user can manage inventory
 * @param {object} user - User object with role
 * @returns {boolean}
 */
export const canManageInventory = (user) => {
  return hasPermission(user, 'inventory', 'adjust');
};

/**
 * Check if user can approve orders
 * @param {object} user - User object with role
 * @returns {boolean}
 */
export const canApproveOrders = (user) => {
  return hasPermission(user, 'purchaseOrders', 'approve');
};

/**
 * Get maximum discount percentage for user
 * @param {object} user - User object with role
 * @returns {number}
 */
export const getMaxDiscount = (user) => {
  if (!user?.role) return 0;
  return PERMISSIONS[user.role]?.sales?.discount || 0;
};

/**
 * Check if user can give credit
 * @param {object} user - User object with role
 * @returns {boolean}
 */
export const canGiveCredit = (user) => {
  if (!user?.role) return false;
  return PERMISSIONS[user.role]?.sales?.credit || false;
};

/**
 * Get credit limit for user
 * @param {object} user - User object with role
 * @returns {number}
 */
export const getCreditLimit = (user) => {
  if (!user?.role) return 0;
  return PERMISSIONS[user.role]?.sales?.creditLimit || 0;
};

/**
 * Get all permissions for a role
 * @param {string} role - Role name
 * @returns {object} Permission object
 */
export const getRolePermissions = (role) => {
  return PERMISSIONS[role] || {};
};

/**
 * Get accessible features for a role
 * @param {string} role - Role name
 * @returns {string[]} Array of feature names user can view
 */
export const getAccessibleFeatures = (role) => {
  const permissions = PERMISSIONS[role];
  if (!permissions) return [];
  
  return Object.entries(permissions)
    .filter(([_, perms]) => perms.view)
    .map(([feature]) => feature);
};

/**
 * Filter navigation items based on user permissions
 * @param {object[]} navItems - Navigation items with roles array
 * @param {object} user - User object with role
 * @returns {object[]} Filtered navigation items
 */
export const filterNavByPermissions = (navItems, user) => {
  if (!user?.role) return [];
  
  return navItems.filter(item => {
    if (item.roles && !item.roles.includes(user.role)) {
      return false;
    }
    if (item.feature && item.action) {
      return hasPermission(user, item.feature, item.action);
    }
    return true;
  }).map(item => {
    if (item.children) {
      return {
        ...item,
        children: filterNavByPermissions(item.children, user),
      };
    }
    return item;
  });
};
