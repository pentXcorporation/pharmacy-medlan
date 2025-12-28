/**
 * Inventory Service
 * API calls for inventory management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const inventoryService = {
  /**
   * Get inventory by branch (paginated)
   */
  getByBranch: (branchId, params = {}) => {
    const { page = 0, size = 10, sort = "product.productName,asc" } = params;
    return api.get(API_ENDPOINTS.INVENTORY.BY_BRANCH(branchId), {
      params: { page, size, sort },
    });
  },

  /**
   * Get inventory by product and branch
   */
  getByProductAndBranch: (productId, branchId) => {
    return api.get(
      API_ENDPOINTS.INVENTORY.BY_PRODUCT_AND_BRANCH(productId, branchId)
    );
  },

  /**
   * Get low stock items
   */
  getLowStock: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.INVENTORY.LOW_STOCK(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get out of stock items
   */
  getOutOfStock: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.INVENTORY.OUT_OF_STOCK(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get expiring batches
   */
  getExpiring: (branchId, days = 30, params = {}) => {
    return api.get(API_ENDPOINTS.INVENTORY.EXPIRING(branchId), {
      params: { days, ...params },
    });
  },

  /**
   * Get expired batches
   */
  getExpired: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.INVENTORY.EXPIRED(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get inventory batches for a product
   */
  getBatches: (productId, branchId) => {
    return api.get(API_ENDPOINTS.INVENTORY.BATCHES(productId, branchId));
  },

  /**
   * Get available quantity
   */
  getAvailableQuantity: (productId, branchId) => {
    return api.get(
      API_ENDPOINTS.INVENTORY.AVAILABLE_QUANTITY(productId, branchId)
    );
  },
};

/**
 * Stock Transfer Service
 */
export const stockTransferService = {
  /**
   * Get all transfers (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "createdAt,desc" } = params;
    return api.get(API_ENDPOINTS.STOCK_TRANSFERS.BASE, {
      params: { page, size, sort },
    });
  },

  /**
   * Get transfer by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.STOCK_TRANSFERS.BY_ID(id));
  },

  /**
   * Get transfers by source branch
   */
  getBySourceBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.STOCK_TRANSFERS.BY_SOURCE(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get transfers by destination branch
   */
  getByDestinationBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.STOCK_TRANSFERS.BY_DESTINATION(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get transfers by status
   */
  getByStatus: (status, params = {}) => {
    return api.get(API_ENDPOINTS.STOCK_TRANSFERS.BY_STATUS(status), {
      params: { ...params },
    });
  },

  /**
   * Create new transfer
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.STOCK_TRANSFERS.BASE, data);
  },

  /**
   * Approve transfer
   */
  approve: (id) => {
    return api.post(API_ENDPOINTS.STOCK_TRANSFERS.APPROVE(id));
  },

  /**
   * Receive transfer
   */
  receive: (id) => {
    return api.post(API_ENDPOINTS.STOCK_TRANSFERS.RECEIVE(id));
  },

  /**
   * Reject transfer
   */
  reject: (id, reason) => {
    return api.post(API_ENDPOINTS.STOCK_TRANSFERS.REJECT(id), { reason });
  },

  /**
   * Cancel transfer
   */
  cancel: (id, reason) => {
    return api.post(API_ENDPOINTS.STOCK_TRANSFERS.CANCEL(id), { reason });
  },
};

export default inventoryService;
