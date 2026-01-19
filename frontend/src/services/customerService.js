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
  getAll: async (params = {}) => {
    const {
      page = 0,
      size = 10,
      sortBy = "customerName",
      sortDir = "asc",
      ...filters
    } = params;
    const response = await api.get(API_ENDPOINTS.CUSTOMERS.BASE, {
      params: { page, size, sortBy, sortDir, ...filters },
    });
    return response.data.data;
  },

  /**
   * Get customer by ID
   */
  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    return response.data.data;
  },

  /**
   * Get customer by code
   */
  getByCode: async (code) => {
    const response = await api.get(API_ENDPOINTS.CUSTOMERS.BY_CODE(code));
    return response.data.data;
  },

  /**
   * Search customers
   */
  search: async (query, params = {}) => {
    const response = await api.get(API_ENDPOINTS.CUSTOMERS.SEARCH, {
      params: { query, ...params },
    });
    return response.data.data;
  },

  /**
   * Get active customers
   */
  getActive: async () => {
    const response = await api.get(API_ENDPOINTS.CUSTOMERS.ACTIVE);
    return response.data.data;
  },

  /**
   * Create new customer
   */
  create: async (data) => {
    const response = await api.post(API_ENDPOINTS.CUSTOMERS.BASE, data);
    return response.data.data;
  },

  /**
   * Update customer
   */
  update: async (id, data) => {
    const response = await api.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), data);
    return response.data.data;
  },

  /**
   * Delete customer (soft delete)
   */
  delete: async (id) => {
    const response = await api.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    return response.data.data;
  },

  /**
   * Activate customer
   */
  activate: async (id) => {
    const response = await api.patch(API_ENDPOINTS.CUSTOMERS.ACTIVATE(id));
    return response.data.data;
  },

  /**
   * Deactivate customer
   */
  deactivate: async (id) => {
    const response = await api.patch(API_ENDPOINTS.CUSTOMERS.DEACTIVATE(id));
    return response.data.data;
  },
};

export default customerService;
