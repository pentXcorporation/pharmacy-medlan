import { useAuthStore } from './authSlice';
import { PERMISSIONS, ROLE_HIERARCHY } from '../constants/authConstants';

/**
 * Auth Selectors
 * Derived state selectors for auth store
 */

/**
 * Select current user
 */
export const selectUser = () => useAuthStore.getState().user;

/**
 * Select authentication status
 */
export const selectIsAuthenticated = () => useAuthStore.getState().isAuthenticated;

/**
 * Select current token
 */
export const selectToken = () => useAuthStore.getState().token;

/**
 * Select user role
 */
export const selectUserRole = () => useAuthStore.getState().user?.role;

/**
 * Select loading state
 */
export const selectIsLoading = () => useAuthStore.getState().isLoading;

/**
 * Select error state
 */
export const selectError = () => useAuthStore.getState().error;

/**
 * Select selected branch
 */
export const selectSelectedBranch = () => useAuthStore.getState().selectedBranch;

/**
 * Check if user has permission
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const selectHasPermission = (permission) => {
  const userRole = selectUserRole();
  if (!userRole) return false;
  return PERMISSIONS[permission]?.includes(userRole) || false;
};

/**
 * Check if user has any of the given permissions
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
export const selectHasAnyPermission = (permissions) => {
  return permissions.some(permission => selectHasPermission(permission));
};

/**
 * Check if user has all of the given permissions
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
export const selectHasAllPermissions = (permissions) => {
  return permissions.every(permission => selectHasPermission(permission));
};

/**
 * Check if user role is at or above given level
 * @param {string} role - Minimum required role
 * @returns {boolean}
 */
export const selectHasRoleLevel = (role) => {
  const userRole = selectUserRole();
  if (!userRole) return false;
  
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(role);
  
  return userIndex >= requiredIndex;
};

/**
 * Get user's full name
 */
export const selectUserFullName = () => {
  const user = selectUser();
  return user?.fullName || user?.username || '';
};

/**
 * Get user's branch
 */
export const selectUserBranch = () => {
  const user = selectUser();
  return user?.branch || null;
};
