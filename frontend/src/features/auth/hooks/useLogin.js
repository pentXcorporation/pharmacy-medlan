/**
 * useLogin Hook
 * Handles login API call and authentication state
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/utils';
import { useAuthStore } from '@/store';
import { API_ENDPOINTS, ROUTES } from '@/config';

/**
 * Login mutation hook
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from || ROUTES.DASHBOARD;

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Set auth state
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      toast.success(`Welcome back, ${data.user.firstName || data.user.username}!`);
      
      // Navigate to intended destination
      navigate(from, { replace: true });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Invalid credentials';
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
      toast.success('Logged out successfully');
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    },
  });
};

export default useLogin;
