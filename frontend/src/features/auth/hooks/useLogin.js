/**
 * useLogin Hook
 * Handles login API call and authentication state
 */

import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/utils";
import { useAuthStore } from "@/store";
import { API_ENDPOINTS, ROUTES } from "@/config";
import { ROLES } from "@/constants";

/**
 * Get the default landing page based on user role
 * @param {string} role - User's role
 * @returns {string} - Route path for the role
 */
const getDefaultRouteForRole = (role) => {
  switch (role) {
    // POS-focused roles go directly to POS
    case ROLES.CASHIER:
    case ROLES.PHARMACIST:
      return ROUTES.POS.ROOT;
    
    // Finance-focused role
    case ROLES.ACCOUNTANT:
      return ROUTES.DASHBOARD; // Could be ROUTES.FINANCE.ROOT
    
    // Inventory-focused role
    case ROLES.INVENTORY_MANAGER:
      return ROUTES.DASHBOARD; // Could be ROUTES.INVENTORY.ROOT
    
    // Admin roles go to dashboard
    case ROLES.SUPER_ADMIN:
    case ROLES.ADMIN:
    case ROLES.BRANCH_MANAGER:
    default:
      return ROUTES.DASHBOARD;
  }
};

/**
 * Login mutation hook
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  // Get redirect path from location state (if user was redirected from a protected route)
  const intendedDestination = location.state?.from;

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      // Backend returns: { success, message, data: { accessToken, refreshToken, userId, username, ... } }
      return response.data.data; // Extract the actual login data from ApiResponse wrapper
    },
    onSuccess: (data) => {
      // Build user object from response fields
      const user = {
        id: data.userId,
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };

      // Set auth state
      setAuth({
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      toast.success(`Welcome back, ${user.fullName || user.username}!`);

      // Navigate to intended destination if exists, otherwise role-based default
      const destination = intendedDestination || getDefaultRouteForRole(user.role);
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message);
    },
  });
};

/**
 * Logout hook
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      try {
        // Call logout endpoint if exists
        await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      } catch {
        // Ignore logout API errors
      }
    },
    onSettled: () => {
      // Always clear auth state
      clearAuth();
      toast.success("Logged out successfully");
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    },
  });
};

export default useLogin;
