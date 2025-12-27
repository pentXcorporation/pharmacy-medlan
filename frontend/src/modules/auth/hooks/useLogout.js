import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authSlice';
import { authService } from '../services/authService';
import { sessionService } from '../services/sessionService';
import { toast } from 'sonner';

/**
 * useLogout Hook
 * Handles logout functionality
 */
export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  /**
   * Perform logout
   * @param {Object} options - { redirect, showToast, message }
   */
  const handleLogout = useCallback(async (options = {}) => {
    const {
      redirect = '/login',
      showToast = true,
      message = 'You have been logged out',
    } = options;
    
    try {
      // Call logout API (optional, might fail if token is already invalid)
      await authService.logout().catch(() => {});
    } catch {
      // Ignore API errors on logout
    } finally {
      // Destroy session service
      sessionService.destroy();
      
      // Clear auth state
      logout();
      
      // Show toast notification
      if (showToast) {
        toast.success(message);
      }
      
      // Redirect to login
      if (redirect) {
        navigate(redirect, { replace: true });
      }
    }
  }, [logout, navigate]);

  /**
   * Logout due to session expiry
   */
  const handleSessionExpired = useCallback(() => {
    handleLogout({
      showToast: true,
      message: 'Your session has expired. Please login again.',
    });
  }, [handleLogout]);

  /**
   * Logout due to unauthorized access
   */
  const handleUnauthorized = useCallback(() => {
    handleLogout({
      showToast: true,
      message: 'You are not authorized. Please login again.',
    });
  }, [handleLogout]);

  return {
    logout: handleLogout,
    handleSessionExpired,
    handleUnauthorized,
  };
}

export default useLogout;
