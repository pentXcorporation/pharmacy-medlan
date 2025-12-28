/**
 * Category Service
 * API calls for category management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const categoryService = {
  /**
   * Get all categories
   */
  getAll: () => {
    return api.get(API_ENDPOINTS.CATEGORIES.BASE);
  },

  /**
   * Get active categories
   */
  getActive: () => {
    return api.get(API_ENDPOINTS.CATEGORIES.ACTIVE);
  },

  /**
   * Get category by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },

  /**
   * Create new category
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.CATEGORIES.BASE, data);
  },

  /**
   * Update category
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), data);
  },

  /**
   * Delete category
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};

export default categoryService;
