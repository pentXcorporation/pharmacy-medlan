import { authService } from '../services/authService';
import { useAuthStore } from './authSlice';
import { tokenService } from '../services/tokenService';

/**
 * Auth Actions
 * Async actions for authentication
 */

/**
 * Login action
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>} - User data
 */
export const loginAction = async (credentials) => {
  const { setLoading, setError, login } = useAuthStore.getState();
  
  setLoading(true);
  setError(null);
  
  try {
    const response = await authService.login(credentials);
    
    if (response.success && response.data) {
      const { accessToken, refreshToken, ...userData } = response.data;
      
      // Store tokens
      tokenService.setTokens(accessToken, refreshToken);
      
      // Update store
      login(userData, accessToken);
      
      return { success: true, data: userData };
    }
    
    throw new Error('Invalid response from server');
  } catch (error) {
    const errorMessage = error.message || 'Login failed';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

/**
 * Logout action
 */
export const logoutAction = async () => {
  const { logout, setLoading } = useAuthStore.getState();
  
  setLoading(true);
  
  try {
    // Call logout API (optional, might fail if token is already invalid)
    await authService.logout().catch(() => {});
  } finally {
    logout();
    setLoading(false);
  }
};

/**
 * Refresh token action
 * @returns {Promise<boolean>} - Success status
 */
export const refreshTokenAction = async () => {
  const { login, logout } = useAuthStore.getState();
  
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    logout();
    return false;
  }
  
  try {
    const response = await authService.refreshToken(refreshToken);
    
    if (response.success && response.data) {
      const { accessToken, refreshToken: newRefreshToken, ...userData } = response.data;
      
      tokenService.setTokens(accessToken, newRefreshToken);
      login(userData, accessToken);
      
      return true;
    }
    
    throw new Error('Failed to refresh token');
  } catch (error) {
    logout();
    return false;
  }
};

/**
 * Change password action
 * @param {Object} data - { currentPassword, newPassword }
 * @returns {Promise<Object>}
 */
export const changePasswordAction = async (data) => {
  const { setLoading, setError } = useAuthStore.getState();
  
  setLoading(true);
  setError(null);
  
  try {
    const response = await authService.changePassword(data);
    return { success: true, data: response };
  } catch (error) {
    const errorMessage = error.message || 'Failed to change password';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

/**
 * Forgot password action
 * @param {string} email
 * @returns {Promise<Object>}
 */
export const forgotPasswordAction = async (email) => {
  const { setLoading, setError } = useAuthStore.getState();
  
  setLoading(true);
  setError(null);
  
  try {
    const response = await authService.forgotPassword(email);
    return { success: true, data: response };
  } catch (error) {
    const errorMessage = error.message || 'Failed to send reset email';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

/**
 * Reset password action
 * @param {Object} data - { token, newPassword }
 * @returns {Promise<Object>}
 */
export const resetPasswordAction = async (data) => {
  const { setLoading, setError } = useAuthStore.getState();
  
  setLoading(true);
  setError(null);
  
  try {
    const response = await authService.resetPassword(data);
    return { success: true, data: response };
  } catch (error) {
    const errorMessage = error.message || 'Failed to reset password';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

/**
 * Initialize auth from storage action
 */
export const initializeAuthAction = () => {
  const { initializeFromStorage } = useAuthStore.getState();
  initializeFromStorage();
};
