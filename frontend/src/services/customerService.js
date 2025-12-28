/**
 * Customer Service
 * API calls for customer management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const customerService = {
  /**
   * Get all customers (paginated)
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      sort = "customerName,asc",
      ...filters
    } = params;
    return api.get(API_ENDPOINTS.CUSTOMERS.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get customer by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  },

  /**
   * Get customer by code
   */
  getByCode: (code) => {
    return api.get(API_ENDPOINTS.CUSTOMERS.BY_CODE(code));
  },

  /**
   * Search customers
   */
  search: (query, params = {}) => {
    return api.get(API_ENDPOINTS.CUSTOMERS.SEARCH, {
      params: { query, ...params },
    });
  },

  /**
   * Get active customers
   */
  getActive: () => {
    return api.get(API_ENDPOINTS.CUSTOMERS.ACTIVE);
  },

  /**
   * Create new customer
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.CUSTOMERS.BASE, data);
  },

  /**
   * Update customer
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), data);
  },

  /**
   * Delete customer (soft delete)
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
  },

  /**
   * Activate customer
   */
  activate: (id) => {
    return api.patch(API_ENDPOINTS.CUSTOMERS.ACTIVATE(id));
  },

  /**
   * Deactivate customer
   */
  deactivate: (id) => {
    return api.patch(API_ENDPOINTS.CUSTOMERS.DEACTIVATE(id));
  },
};

export default customerService;
