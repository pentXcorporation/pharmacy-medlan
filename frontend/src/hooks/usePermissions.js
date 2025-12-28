/**
 * Permissions Hook
 * Provides role-based permission checking utilities
 */

import { useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store';
import { ROLES, PERMISSIONS, ROLE_HIERARCHY } from '@/constants';

/**
 * Hook for permission-based access control
 * @returns {Object} Permission utilities
 */
export const usePermissions = () => {
  const { user } = useAuthStore();
  const role = user?.role;

  /**
   * Check if user has permission for a specific action on a feature
   * @param {string} feature - Feature name (e.g., 'products', 'inventory')
   * @param {string} action - Action name (e.g., 'view', 'create', 'edit', 'delete')
   * @returns {boolean}
   */
  const hasPermission = useCallback((feature, action) => {
    if (!role) return false;
    
    // Super admin has all permissions
    if (role === ROLES.SUPER_ADMIN) return true;
    
    const rolePermissions = PERMISSIONS[role];
    if (!rolePermissions) return false;
    
    const featurePermissions = rolePermissions[feature];
    if (!featurePermissions) return false;
    
    // Check if action is allowed
    if (Array.isArray(featurePermissions)) {
      return featurePermissions.includes(action);
    }
    
    // If featurePermissions is true, all actions are allowed
    return featurePermissions === true;
  }, [role]);

  /**
   * Check if user can view a feature
   */
  const canView = useCallback((feature) => hasPermission(feature, 'view'), [hasPermission]);

  /**
   * Check if user can create in a feature
   */
  const canCreate = useCallback((feature) => hasPermission(feature, 'create'), [hasPermission]);

  /**
   * Check if user can edit in a feature
   */
  const canEdit = useCallback((feature) => hasPermission(feature, 'edit'), [hasPermission]);

  /**
   * Check if user can delete in a feature
   */
  const canDelete = useCallback((feature) => hasPermission(feature, 'delete'), [hasPermission]);

  /**
   * Check if user has any of the specified roles
   * @param {Array<string>} roles - Array of role names
   * @returns {boolean}
   */
  const hasAnyRole = useCallback((roles) => {
    if (!role) return false;
    return roles.includes(role);
  }, [role]);

  /**
   * Check if user has minimum role level
   * @param {string} minimumRole - Minimum role required
   * @returns {boolean}
   */
  const hasMinimumRole = useCallback((minimumRole) => {
    if (!role) return false;
    const userLevel = ROLE_HIERARCHY[role] ?? 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] ?? 999;
    return userLevel >= requiredLevel;
  }, [role]);

  /**
   * Check if user is super admin
   */
  const isSuperAdmin = useMemo(() => role === ROLES.SUPER_ADMIN, [role]);

  /**
   * Check if user is owner or above
   */
  const isOwnerOrAbove = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER]), 
    [hasAnyRole]
  );

  /**
   * Check if user is branch admin or above
   */
  const isBranchAdminOrAbove = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]), 
    [hasAnyRole]
  );

  /**
   * Check if user can access POS
   */
  const canAccessPOS = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN, ROLES.PHARMACIST, ROLES.CASHIER]), 
    [hasAnyRole]
  );

  /**
   * Check if user can access inventory management
   */
  const canAccessInventory = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN, ROLES.PHARMACIST, ROLES.INVENTORY_MANAGER]), 
    [hasAnyRole]
  );

  /**
   * Check if user can access finance
   */
  const canAccessFinance = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]), 
    [hasAnyRole]
  );

  /**
   * Check if user can access reports
   */
  const canAccessReports = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN, ROLES.ACCOUNTANT]), 
    [hasAnyRole]
  );

  /**
   * Check if user can manage employees
   */
  const canManageEmployees = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]), 
    [hasAnyRole]
  );

  /**
   * Check if user can handle prescriptions (controlled drugs)
   */
  const canHandlePrescriptions = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN, ROLES.PHARMACIST]), 
    [hasAnyRole]
  );

  /**
   * Get maximum discount percentage allowed for user
   * @returns {number}
   */
  const maxDiscount = useMemo(() => {
    const discountLimits = {
      [ROLES.SUPER_ADMIN]: 100,
      [ROLES.OWNER]: 100,
      [ROLES.BRANCH_ADMIN]: 25,
      [ROLES.PHARMACIST]: 10,
      [ROLES.CASHIER]: 5,
      [ROLES.INVENTORY_MANAGER]: 0,
      [ROLES.ACCOUNTANT]: 0,
    };
    return discountLimits[role] ?? 0;
  }, [role]);

  /**
   * Check if user can give credit to customers
   * @returns {boolean}
   */
  const canGiveCredit = useMemo(() => 
    hasAnyRole([ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]), 
    [hasAnyRole]
  );

  /**
   * Get list of features user can access
   * @returns {Array<string>}
   */
  const accessibleFeatures = useMemo(() => {
    if (!role) return [];
    if (role === ROLES.SUPER_ADMIN) return ['*'];
    
    const rolePermissions = PERMISSIONS[role];
    if (!rolePermissions) return [];
    
    return Object.keys(rolePermissions);
  }, [role]);

  return {
    // Role info
    role,
    
    // Permission checks
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    
    // Role checks
    hasAnyRole,
    hasMinimumRole,
    
    // Convenience flags
    isSuperAdmin,
    isOwnerOrAbove,
    isBranchAdminOrAbove,
    
    // Feature access
    canAccessPOS,
    canAccessInventory,
    canAccessFinance,
    canAccessReports,
    canManageEmployees,
    canHandlePrescriptions,
    
    // Limits
    maxDiscount,
    canGiveCredit,
    
    // Features list
    accessibleFeatures,
  };
};

export default usePermissions;
