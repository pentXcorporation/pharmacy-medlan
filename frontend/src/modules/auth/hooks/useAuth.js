import { useAuthStore } from '../store/authSlice';
import { hasPermission, canAccessRoute, getDefaultPathForRole } from '../utils/authHelpers';

/**
 * useAuth Hook
 * Provides authentication state and utility methods
 */
export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    selectedBranch,
    login,
    logout,
    updateUser,
    setSelectedBranch,
    hasRole,
    clearError,
  } = useAuthStore();

  /**
   * Check if user has specific permission
   */
  const checkPermission = (permission) => {
    return hasPermission(user?.role, permission);
  };

  /**
   * Check if user can access specific route
   */
  const checkRouteAccess = (route) => {
    return canAccessRoute(user?.role, route);
  };

  /**
   * Get default redirect path for current user
   */
  const getDefaultPath = () => {
    return getDefaultPathForRole(user?.role);
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles) => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    selectedBranch,
    
    // Actions
    login,
    logout,
    updateUser,
    setSelectedBranch,
    clearError,
    
    // Utility methods
    hasRole,
    hasAnyRole,
    checkPermission,
    checkRouteAccess,
    getDefaultPath,
  };
}

export default useAuth;
