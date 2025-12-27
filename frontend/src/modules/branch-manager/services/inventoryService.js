import { apiClient } from '@/lib/api';

/**
 * Branch Inventory Service
 * Handles inventory management operations for branch managers
 */

const INVENTORY_ENDPOINT = '/branch/inventory';

export const branchInventoryService = {
  /**
   * Get branch inventory list
   */
  getInventory: (params = {}) => {
    return apiClient.get(INVENTORY_ENDPOINT, { params });
  },

  /**
   * Get low stock items
   */
  getLowStockItems: () => {
    return apiClient.get(`${INVENTORY_ENDPOINT}/low-stock`);
  },

  /**
   * Get expiring items
   */
  getExpiringItems: (days = 30) => {
    return apiClient.get(`${INVENTORY_ENDPOINT}/expiring`, {
      params: { days },
    });
  },

  /**
   * Get expired items
   */
  getExpiredItems: () => {
    return apiClient.get(`${INVENTORY_ENDPOINT}/expired`);
  },

  /**
   * Update stock quantity
   */
  updateStock: (productId, quantity, reason) => {
    return apiClient.post(`${INVENTORY_ENDPOINT}/${productId}/adjust`, {
      quantity,
      reason,
    });
  },

  /**
   * Request stock transfer from another branch
   */
  requestTransfer: (data) => {
    return apiClient.post(`${INVENTORY_ENDPOINT}/transfer/request`, data);
  },

  /**
   * Get transfer requests
   */
  getTransferRequests: (params = {}) => {
    return apiClient.get(`${INVENTORY_ENDPOINT}/transfer`, { params });
  },

  /**
   * Approve transfer request (incoming)
   */
  approveTransfer: (transferId) => {
    return apiClient.post(`${INVENTORY_ENDPOINT}/transfer/${transferId}/approve`);
  },

  /**
   * Reject transfer request
   */
  rejectTransfer: (transferId, reason) => {
    return apiClient.post(`${INVENTORY_ENDPOINT}/transfer/${transferId}/reject`, {
      reason,
    });
  },

  /**
   * Mark transfer as shipped
   */
  shipTransfer: (transferId) => {
    return apiClient.post(`${INVENTORY_ENDPOINT}/transfer/${transferId}/ship`);
  },

  /**
   * Confirm transfer received
   */
  receiveTransfer: (transferId, receivedItems) => {
    return apiClient.post(`${INVENTORY_ENDPOINT}/transfer/${transferId}/receive`, {
      items: receivedItems,
    });
  },

  /**
   * Get inventory value summary
   */
  getInventoryValue: () => {
    return apiClient.get(`${INVENTORY_ENDPOINT}/value`);
  },

  /**
   * Get stock movement history
   */
  getStockMovement: (productId, params = {}) => {
    return apiClient.get(`${INVENTORY_ENDPOINT}/${productId}/movement`, { params });
  },

  /**
   * Request restock from supplier
   */
  requestRestock: (items) => {
    return apiClient.post(`${INVENTORY_ENDPOINT}/restock`, { items });
  },

  /**
   * Get available branches for transfer
   */
  getAvailableBranches: () => {
    return apiClient.get(`${INVENTORY_ENDPOINT}/branches`);
  },
};
