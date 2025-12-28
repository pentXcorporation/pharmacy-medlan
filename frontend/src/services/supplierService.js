/**
 * Supplier Service
 * API calls for supplier management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const supplierService = {
  /**
   * Get all suppliers (paginated)
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      sort = "supplierName,asc",
      ...filters
    } = params;
    return api.get(API_ENDPOINTS.SUPPLIERS.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get supplier by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
  },

  /**
   * Get supplier by code
   */
  getByCode: (code) => {
    return api.get(API_ENDPOINTS.SUPPLIERS.BY_CODE(code));
  },

  /**
   * Search suppliers
   */
  search: (query, params = {}) => {
    return api.get(API_ENDPOINTS.SUPPLIERS.SEARCH, {
      params: { query, ...params },
    });
  },

  /**
   * Get active suppliers
   */
  getActive: () => {
    return api.get(API_ENDPOINTS.SUPPLIERS.ACTIVE);
  },

  /**
   * Create new supplier
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.SUPPLIERS.BASE, data);
  },

  /**
   * Update supplier
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.SUPPLIERS.BY_ID(id), data);
  },

  /**
   * Delete supplier (soft delete)
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.SUPPLIERS.BY_ID(id));
  },

  /**
   * Activate supplier
   */
  activate: (id) => {
    return api.patch(API_ENDPOINTS.SUPPLIERS.ACTIVATE(id));
  },

  /**
   * Deactivate supplier
   */
  deactivate: (id) => {
    return api.patch(API_ENDPOINTS.SUPPLIERS.DEACTIVATE(id));
  },
};

export default supplierService;
