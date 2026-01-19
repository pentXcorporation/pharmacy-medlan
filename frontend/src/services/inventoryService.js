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
    console.log('inventoryService.getByBranch - calling API with:', { branchId, page, size, sort });
    return api.get(API_ENDPOINTS.INVENTORY.BY_BRANCH(branchId), {
      params: { page, size, sort },
    }).then(response => {
      console.log('inventoryService.getByBranch - raw response:', response);
      console.log('inventoryService.getByBranch - response.data:', response.data);
      console.log('inventoryService.getByBranch - response.data.data:', response.data?.data);
      console.log('inventoryService.getByBranch - response.data.data.content:', response.data?.data?.content);
      console.log('inventoryService.getByBranch - response.data.data.content[0]:', response.data?.data?.content?.[0]);
      return response;
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

  /**
   * Get all low stock products (across all branches)
   */
  getLowStockProducts: (params = {}) => {
    const { page = 0, size = 20, sort = "quantityAvailable,asc" } = params;
    return api.get(API_ENDPOINTS.INVENTORY.ALL_LOW_STOCK, {
      params: { page, size, sort },
    });
  },

  /**
   * Get all expiring products (across all branches)
   */
  getExpiringProducts: (params = {}) => {
    const { days = 30, page = 0, size = 20, sort = "expiryDate,asc" } = params;
    return api.get(API_ENDPOINTS.INVENTORY.ALL_EXPIRING, {
      params: { days, page, size, sort },
    });
  },

  /**
   * Get all expired products (across all branches)
   */
  getExpiredProducts: (params = {}) => {
    const { page = 0, size = 20, sort = "expiryDate,desc" } = params;
    return api.get(API_ENDPOINTS.INVENTORY.ALL_EXPIRED, {
      params: { page, size, sort },
    });
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
