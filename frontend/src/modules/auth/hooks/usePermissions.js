import { useMemo, useCallback } from 'react';
import { useAuthStore } from '../store/authSlice';
import { PERMISSIONS } from '../constants/authConstants';
import { hasPermission, canAccessRoute, hasRoleLevel } from '../utils/authHelpers';

/**
 * usePermissions Hook
 * Provides permission checking utilities
 */
export function usePermissions() {
  const { user } = useAuthStore();
  const userRole = user?.role;

  /**
   * Check single permission
   */
  const checkPermission = useCallback((permission) => {
    return hasPermission(userRole, permission);
  }, [userRole]);

  /**
   * Check multiple permissions (all must pass)
   */
  const checkAllPermissions = useCallback((permissions) => {
    return permissions.every(permission => hasPermission(userRole, permission));
  }, [userRole]);

  /**
   * Check multiple permissions (any must pass)
   */
  const checkAnyPermission = useCallback((permissions) => {
    return permissions.some(permission => hasPermission(userRole, permission));
  }, [userRole]);

  /**
   * Check route access
   */
  const checkRoute = useCallback((route) => {
    return canAccessRoute(userRole, route);
  }, [userRole]);

  /**
   * Check role level
   */
  const checkRoleLevel = useCallback((requiredRole) => {
    return hasRoleLevel(userRole, requiredRole);
  }, [userRole]);

  /**
   * Get all user permissions
   */
  const userPermissions = useMemo(() => {
    if (!userRole) return [];
    
    return Object.entries(PERMISSIONS)
      .filter(([, roles]) => roles.includes(userRole))
      .map(([permission]) => permission);
  }, [userRole]);

  /**
   * Permission flags for common operations
   */
  const permissions = useMemo(() => ({
    // Dashboard
    canViewDashboard: checkPermission('VIEW_DASHBOARD'),
    
    // POS
    canAccessPOS: checkPermission('ACCESS_POS'),
    
    // Products
    canViewProducts: checkPermission('VIEW_PRODUCTS'),
    canCreateProduct: checkPermission('CREATE_PRODUCT'),
    canEditProduct: checkPermission('EDIT_PRODUCT'),
    canDeleteProduct: checkPermission('DELETE_PRODUCT'),
    
    // Inventory
    canViewInventory: checkPermission('VIEW_INVENTORY'),
    canManageInventory: checkPermission('MANAGE_INVENTORY'),
    
    // Purchase Orders
    canViewPurchaseOrders: checkPermission('VIEW_PURCHASE_ORDERS'),
    canCreatePurchaseOrder: checkPermission('CREATE_PURCHASE_ORDER'),
    canApprovePurchaseOrder: checkPermission('APPROVE_PURCHASE_ORDER'),
    
    // GRN
    canViewGRN: checkPermission('VIEW_GRN'),
    canCreateGRN: checkPermission('CREATE_GRN'),
    
    // Sales
    canViewSales: checkPermission('VIEW_SALES'),
    canCreateSale: checkPermission('CREATE_SALE'),
    
    // Customers
    canViewCustomers: checkPermission('VIEW_CUSTOMERS'),
    canManageCustomers: checkPermission('MANAGE_CUSTOMERS'),
    
    // Suppliers
    canViewSuppliers: checkPermission('VIEW_SUPPLIERS'),
    canManageSuppliers: checkPermission('MANAGE_SUPPLIERS'),
    
    // Reports
    canViewReports: checkPermission('VIEW_REPORTS'),
    canExportReports: checkPermission('EXPORT_REPORTS'),
    
    // Users
    canViewUsers: checkPermission('VIEW_USERS'),
    canManageUsers: checkPermission('MANAGE_USERS'),
    
    // Branches
    canViewBranches: checkPermission('VIEW_BRANCHES'),
    canManageBranches: checkPermission('MANAGE_BRANCHES'),
    
    // Settings
    canViewSettings: checkPermission('VIEW_SETTINGS'),
    canManageSettings: checkPermission('MANAGE_SETTINGS'),
    
    // Audit Logs
    canViewAuditLogs: checkPermission('VIEW_AUDIT_LOGS'),
    
    // Staff
    canViewStaff: checkPermission('VIEW_STAFF'),
    canManageStaff: checkPermission('MANAGE_STAFF'),
    
    // Attendance
    canViewAttendance: checkPermission('VIEW_ATTENDANCE'),
    canManageAttendance: checkPermission('MANAGE_ATTENDANCE'),
    canRequestLeave: checkPermission('REQUEST_LEAVE'),
    canApproveLeave: checkPermission('APPROVE_LEAVE'),
  }), [checkPermission]);

  return {
    userRole,
    userPermissions,
    permissions,
    checkPermission,
    checkAllPermissions,
    checkAnyPermission,
    checkRoute,
    checkRoleLevel,
  };
}

export default usePermissions;
