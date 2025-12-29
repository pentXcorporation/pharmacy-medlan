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
   * Backend expects query params: categoryName, categoryCode, description
   */
  create: (data) => {
    const params = new URLSearchParams();
    params.append("categoryName", data.name || data.categoryName);
    if (data.code || data.categoryCode) {
      params.append("categoryCode", data.code || data.categoryCode);
    }
    if (data.description) {
      params.append("description", data.description);
    }
    // Send empty body - backend expects @RequestParam not @RequestBody
    return api.post(
      `${API_ENDPOINTS.CATEGORIES.BASE}?${params.toString()}`,
      {}
    );
  },

  /**
   * Update category
   * Backend expects query params: categoryName, description
   */
  update: (id, data) => {
    const params = new URLSearchParams();
    params.append("categoryName", data.name || data.categoryName);
    if (data.description) {
      params.append("description", data.description);
    }
    // Send empty body - backend expects @RequestParam not @RequestBody
    return api.put(
      `${API_ENDPOINTS.CATEGORIES.BY_ID(id)}?${params.toString()}`,
      {}
    );
  },

  /**
   * Delete category
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};

export default categoryService;
