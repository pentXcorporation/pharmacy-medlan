/**
 * Branch Service
 * API calls for branch management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const branchService = {
  /**
   * Get all branches (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "branchName,asc" } = params;
    return api.get(API_ENDPOINTS.BRANCHES.BASE, {
      params: { page, size, sort },
    });
  },

  /**
   * Get all branches (list - no pagination)
   */
  getAllList: () => {
    return api.get(API_ENDPOINTS.BRANCHES.ALL);
  },

  /**
   * Get branch by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.BRANCHES.BY_ID(id));
  },

  /**
   * Get branch by code
   */
  getByCode: (code) => {
    return api.get(API_ENDPOINTS.BRANCHES.BY_CODE(code));
  },

  /**
   * Get active branches
   */
  getActive: () => {
    return api.get(API_ENDPOINTS.BRANCHES.ACTIVE);
  },

  /**
   * Create new branch
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.BRANCHES.BASE, data);
  },

  /**
   * Update branch
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.BRANCHES.BY_ID(id), data);
  },

  /**
   * Delete branch (soft delete)
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.BRANCHES.BY_ID(id));
  },

  /**
   * Activate branch
   */
  activate: (id) => {
    return api.post(API_ENDPOINTS.BRANCHES.ACTIVATE(id));
  },

  /**
   * Deactivate branch
   */
  deactivate: (id) => {
    return api.post(API_ENDPOINTS.BRANCHES.DEACTIVATE(id));
  },
};

export default branchService;
