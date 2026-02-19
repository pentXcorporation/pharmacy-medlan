/**
 * Sub-Category Service
 * Handles all sub-category related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const subCategoryService = {
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.SUB_CATEGORIES.BASE, { params });
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.SUB_CATEGORIES.BY_ID(id));
  },

  getByCategory: (categoryId) => {
    return api.get(API_ENDPOINTS.SUB_CATEGORIES.BY_CATEGORY(categoryId));
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.SUB_CATEGORIES.BASE, data);
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.SUB_CATEGORIES.BY_ID(id), data);
  },

  delete: (id) => {
    return api.delete(API_ENDPOINTS.SUB_CATEGORIES.BY_ID(id));
  },
};

export default subCategoryService;
