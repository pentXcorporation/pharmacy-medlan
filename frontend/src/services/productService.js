/**
 * Product Service
 * API calls for product management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const productService = {
  /**
   * Get all products with pagination
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      sort = "productName,asc",
      ...filters
    } = params;
    return api.get(API_ENDPOINTS.PRODUCTS.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get product by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  /**
   * Get product by code
   */
  getByCode: (code) => {
    return api.get(API_ENDPOINTS.PRODUCTS.BY_CODE(code));
  },

  /**
   * Search products
   */
  search: (query, params = {}) => {
    return api.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: { query, ...params },
    });
  },

  /**
   * Get low stock products
   */
  getLowStock: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.PRODUCTS.LOW_STOCK, {
      params: { branchId, ...params },
    });
  },

  /**
   * Create new product
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.PRODUCTS.BASE, data);
  },

  /**
   * Update product
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), data);
  },

  /**
   * Delete product (soft delete)
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  /**
   * Discontinue product
   */
  discontinue: (id) => {
    return api.patch(API_ENDPOINTS.PRODUCTS.DISCONTINUE(id));
  },

  /**
   * Export products to CSV
   */
  export: (params = {}) => {
    return api.get(API_ENDPOINTS.PRODUCTS.EXPORT, {
      params,
      responseType: "blob", // Important for file download
    });
  },

  /**
   * Import products from CSV file
   */
  import: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(API_ENDPOINTS.PRODUCTS.IMPORT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Download import template
   */
  downloadTemplate: () => {
    return api.get(API_ENDPOINTS.PRODUCTS.TEMPLATE, {
      responseType: "blob",
    });
  },
};

export default productService;
