/**
 * Bank Service
 * Handles all bank-related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const bankService = {
  /**
   * Get all banks with pagination
   */
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.BANKS.BASE, { params });
  },

  /**
   * Get all active banks
   */
  getActive: () => {
    return api.get(`${API_ENDPOINTS.BANKS.BASE}/active`);
  },

  /**
   * Get bank by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.BANKS.BY_ID(id));
  },

  /**
   * Create new bank
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.BANKS.BASE, data);
  },

  /**
   * Update bank
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.BANKS.BY_ID(id), data);
  },

  /**
   * Delete bank
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.BANKS.BY_ID(id));
  },

  /**
   * Get total balance across all banks
   */
  getTotalBalance: () => {
    return api.get(`${API_ENDPOINTS.BANKS.BASE}/total-balance`);
  },
};

export default bankService;
