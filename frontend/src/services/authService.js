/**
 * Auth Service
 * Handles authentication related API calls
 */

import { apiClient } from "@/utils/api";

const AUTH_BASE_URL = "/auth";

/**
 * Auth Service API methods
 */
export const authService = {
  /**
   * Login user
   * @param {Object} credentials - { username, password }
   * @returns {Promise} Login response with tokens
   */
  login: async (credentials) => {
    const response = await apiClient.post(
      `${AUTH_BASE_URL}/login`,
      credentials
    );
    return response.data;
  },

  /**
   * Logout current user
   * @returns {Promise}
   */
  logout: async () => {
    const response = await apiClient.post(`${AUTH_BASE_URL}/logout`);
    return response.data;
  },

  /**
   * Get current authenticated user
   * @returns {Promise} Current user details
   */
  getCurrentUser: async () => {
    const response = await apiClient.get(`${AUTH_BASE_URL}/me`);
    return response.data;
  },

  /**
   * Change password
   * @param {Object} data - { currentPassword, newPassword, confirmPassword }
   * @returns {Promise}
   */
  changePassword: async (data) => {
    const response = await apiClient.post(
      `${AUTH_BASE_URL}/change-password`,
      data
    );
    return response.data;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} New tokens
   */
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post(`${AUTH_BASE_URL}/refresh`, null, {
      params: { refreshToken },
    });
    return response.data;
  },

  /**
   * Register new user (admin only)
   * @param {Object} userData - User registration data
   * @returns {Promise} Created user
   */
  register: async (userData) => {
    const response = await apiClient.post(
      `${AUTH_BASE_URL}/register`,
      userData
    );
    return response.data;
  },
};
