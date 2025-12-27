import api from '@/lib/api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Login user with credentials
   * @param {Object} credentials - { username, password }
   * @returns {Promise} - User data with tokens
   */
  login: (credentials) => api.post('/api/auth/login', credentials),

  /**
   * Register initial admin user
   * @param {Object} userData - User registration data
   * @returns {Promise}
   */
  registerInitial: (userData) => api.post('/api/auth/register/initial', userData),

  /**
   * Get current authenticated user
   * @returns {Promise} - User data
   */
  getCurrentUser: () => api.get('/api/auth/me'),

  /**
   * Change user password
   * @param {Object} data - { currentPassword, newPassword }
   * @returns {Promise}
   */
  changePassword: (data) => api.post('/api/auth/change-password', data),

  /**
   * Logout current user
   * @returns {Promise}
   */
  logout: () => api.post('/api/auth/logout'),

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - New tokens
   */
  refreshToken: (refreshToken) => 
    api.post(`/api/auth/refresh?refreshToken=${refreshToken}`),

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise}
   */
  forgotPassword: (email) => 
    api.post('/api/auth/forgot-password', { email }),

  /**
   * Reset password with token
   * @param {Object} data - { token, newPassword }
   * @returns {Promise}
   */
  resetPassword: (data) => 
    api.post('/api/auth/reset-password', data),

  /**
   * Verify two-factor authentication code
   * @param {Object} data - { code, sessionId }
   * @returns {Promise}
   */
  verifyTwoFactor: (data) => 
    api.post('/api/auth/verify-2fa', data),

  /**
   * Resend two-factor authentication code
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  resendTwoFactorCode: (sessionId) => 
    api.post('/api/auth/resend-2fa', { sessionId }),

  /**
   * Validate token
   * @returns {Promise}
   */
  validateToken: () => api.get('/api/auth/validate'),
};

export default authService;
