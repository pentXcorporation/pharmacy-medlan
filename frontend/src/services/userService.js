/**
 * User Service
 * API calls for user management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const userService = {
  /**
   * Get all users (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "username,asc", ...filters } = params;
    return api.get(API_ENDPOINTS.USERS.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get user by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.USERS.BY_ID(id));
  },

  /**
   * Get user by username
   */
  getByUsername: (username) => {
    return api.get(API_ENDPOINTS.USERS.BY_USERNAME(username));
  },

  /**
   * Get users by role
   */
  getByRole: (role, params = {}) => {
    return api.get(API_ENDPOINTS.USERS.BY_ROLE(role), {
      params: { ...params },
    });
  },

  /**
   * Get users by branch
   */
  getByBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.USERS.BY_BRANCH(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get active users
   */
  getActive: () => {
    return api.get(API_ENDPOINTS.USERS.ACTIVE);
  },

  /**
   * Create new user
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.USERS.BASE, data);
  },

  /**
   * Update user
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.USERS.BY_ID(id), data);
  },

  /**
   * Delete user (soft delete)
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  /**
   * Activate user
   */
  activate: (id) => {
    return api.patch(API_ENDPOINTS.USERS.ACTIVATE(id));
  },

  /**
   * Deactivate user
   */
  deactivate: (id) => {
    return api.patch(API_ENDPOINTS.USERS.DEACTIVATE(id));
  },

  /**
   * Reset password
   */
  resetPassword: (id, newPassword) => {
    return api.patch(API_ENDPOINTS.USERS.RESET_PASSWORD(id), { newPassword });
  },
};

export default userService;
