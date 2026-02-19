/**
 * Auth Hook
 * Provides authentication utilities and user state
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { ROUTES } from "@/config";
import { ROLES } from "@/constants";

/**
 * Hook for authentication operations
 * @returns {Object} Auth utilities and state
 */
export const useAuth = () => {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isLoading,
    setAuth,
    clearAuth,
    hasRole,
    hasAnyRole,
    hasMinimumRole,
    isSuperAdmin,
  } = useAuthStore();

  /**
   * Login handler - sets auth state and redirects
   * @param {Object} authData - { user, accessToken, refreshToken }
   */
  const login = useCallback(
    (authData) => {
      setAuth(authData);

      // Redirect based on role
      const role = authData.user?.role;
      if (role === ROLES.SUPER_ADMIN) {
        navigate(ROUTES.DASHBOARD);
      } else if (role === ROLES.BRANCH_ADMIN) {
        navigate(ROUTES.DASHBOARD);
      } else if (role === ROLES.PHARMACIST || role === ROLES.CASHIER) {
        navigate(ROUTES.POS.ROOT);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    },
    [setAuth, navigate]
  );

  /**
   * Logout handler - clears auth and redirects to login
   */
  const logout = useCallback(() => {
    clearAuth();
    navigate(ROUTES.AUTH.LOGIN);
  }, [clearAuth, navigate]);

  /**
   * Check if user can access a specific feature
   * @param {string} feature - Feature name
   * @returns {boolean}
   */
  const canAccess = useCallback(
    (feature) => {
      if (!user?.role) return false;

      const roleFeatures = {
        [ROLES.SUPER_ADMIN]: ["*"],
        [ROLES.ADMIN]: ["*"],
        [ROLES.OWNER]: ["*"],
        [ROLES.BRANCH_ADMIN]: [
          "dashboard",
          "pos",
          "inventory",
          "products",
          "categories",
          "suppliers",
          "customers",
          "employees",
          "reports",
          "settings",
          "finance",
          "payroll",
        ],
        [ROLES.MANAGER]: [
          "dashboard",
          "pos",
          "inventory",
          "products",
          "categories",
          "suppliers",
          "customers",
          "reports",
        ],
        [ROLES.PHARMACIST]: [
          "pos",
          "inventory",
          "products",
          "customers",
          "prescriptions",
        ],
        [ROLES.CASHIER]: ["pos", "customers"],
        [ROLES.INVENTORY_MANAGER]: [
          "inventory",
          "products",
          "suppliers",
          "purchase-orders",
          "grn",
        ],
        [ROLES.ACCOUNTANT]: ["finance", "reports", "payroll"],
      };

      const features = roleFeatures[user.role] || [];
      return features.includes("*") || features.includes(feature);
    },
    [user?.role]
  );

  /**
   * Get user's display name
   * @returns {string}
   */
  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username
    : "";

  /**
   * Get user's initials for avatar
   * @returns {string}
   */
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      user.username?.[0]?.toUpperCase()
    : "";

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    displayName,
    initials,

    // Role info
    role: user?.role,
    branchId: user?.branchId,

    // Actions
    login,
    logout,

    // Role checks
    hasRole,
    hasAnyRole,
    hasMinimumRole,
    isSuperAdmin,
    canAccess,
  };
};

export default useAuth;
