/**
 * Cheque Service
 * API calls for cheque management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const chequeService = {
  /**
   * Get all cheques (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "chequeDate,desc", ...filters } = params;
    return api.get(API_ENDPOINTS.CHEQUES.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get cheque by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.CHEQUES.BY_ID(id));
  },

  /**
   * Create new cheque
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.CHEQUES.BASE, data);
  },

  /**
   * Update cheque
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.CHEQUES.BY_ID(id), data);
  },

  /**
   * Delete cheque
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.CHEQUES.BY_ID(id));
  },

  /**
   * Update cheque status
   */
  updateStatus: (id, status) => {
    return api.patch(`${API_ENDPOINTS.CHEQUES.BY_ID(id)}/status`, { status });
  },

  /**
   * Get cheque statistics
   */
  getStats: () => {
    return api.get(`${API_ENDPOINTS.CHEQUES.BASE}/stats`);
  },
};
