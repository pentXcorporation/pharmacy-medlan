/**
 * System Config Service
 * API calls for system configuration management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const systemConfigService = {
  /**
   * Get all system configurations
   */
  getAll: () => {
    return api.get(API_ENDPOINTS.SYSTEM_CONFIG.BASE);
  },

  /**
   * Get configuration by key
   */
  getByKey: (key) => {
    return api.get(API_ENDPOINTS.SYSTEM_CONFIG.BY_KEY(key));
  },

  /**
   * Get configurations by category
   */
  getByCategory: (category) => {
    return api.get(API_ENDPOINTS.SYSTEM_CONFIG.BASE, {
      params: { category },
    });
  },

  /**
   * Update configuration value
   */
  update: (key, value) => {
    return api.put(API_ENDPOINTS.SYSTEM_CONFIG.BY_KEY(key), { value });
  },

  /**
   * Batch update configurations
   */
  batchUpdate: (configs) => {
    return api.put(API_ENDPOINTS.SYSTEM_CONFIG.BASE, configs);
  },
};

export default systemConfigService;
