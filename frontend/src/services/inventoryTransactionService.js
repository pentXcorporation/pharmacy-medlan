/**
 * Inventory Transaction Service
 * API calls for inventory transactions management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const inventoryTransactionService = {
  /**
   * Get all inventory transactions (paginated)
   */
  getAll: async (params = {}) => {
    const { page = 0, size = 10, sort = "createdAt,desc", ...filters } = params;
    const response = await api.get(API_ENDPOINTS.INVENTORY_TRANSACTIONS.BASE, {
      params: { page, size, sort, ...filters },
    });
    return response.data?.data || response.data || response;
  },

  /**
   * Get inventory transaction by ID
   */
  getById: async (id) => {
    const response = await api.get(API_ENDPOINTS.INVENTORY_TRANSACTIONS.BY_ID(id));
    return response.data?.data || response.data || response;
  },

  /**
   * Get inventory transactions by branch
   */
  getByBranch: async (branchId, params = {}) => {
    const response = await api.get(
      API_ENDPOINTS.INVENTORY_TRANSACTIONS.BY_BRANCH(branchId),
      { params: { ...params } }
    );
    return response.data?.data || response.data || response;
  },
};

export default inventoryTransactionService;
