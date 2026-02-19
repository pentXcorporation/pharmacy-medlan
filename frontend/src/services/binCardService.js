/**
 * Bin Card Service
 * Handles product bin card (stock movement history) API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const binCardService = {
  /**
   * Get bin card entries for a product
   */
  getByProduct: (productId, params = {}) => {
    return api.get(API_ENDPOINTS.BIN_CARDS.BY_PRODUCT(productId), { params });
  },

  /**
   * Get bin card entries for a product in a specific branch
   */
  getByProductAndBranch: (productId, branchId, params = {}) => {
    return api.get(API_ENDPOINTS.BIN_CARDS.BY_PRODUCT_BRANCH(productId, branchId), { params });
  },

  /**
   * Get bin card entries by product, branch, and date range
   */
  getByProductBranchDateRange: (productId, branchId, params = {}) => {
    return api.get(API_ENDPOINTS.BIN_CARDS.BY_PRODUCT_BRANCH_DATE(productId, branchId), { params });
  },

  /**
   * Get all bin card entries for a branch
   */
  getByBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.BIN_CARDS.BY_BRANCH(branchId), { params });
  },

  /**
   * Get current balance for a product in a branch
   */
  getBalance: (productId, branchId) => {
    return api.get(API_ENDPOINTS.BIN_CARDS.BALANCE(productId, branchId));
  },
};

export default binCardService;
