/**
 * Inventory Maintenance Service
 * Handles inventory synchronization and diagnostic operations
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const inventoryMaintenanceService = {
  /**
   * Sync branch inventory
   */
  syncBranch: (data = {}) => {
    return api.post(API_ENDPOINTS.INVENTORY_MAINTENANCE.SYNC_BRANCH, data);
  },

  /**
   * Get branch inventory status
   */
  getStatus: (params = {}) => {
    return api.get(API_ENDPOINTS.INVENTORY_MAINTENANCE.STATUS, { params });
  },

  /**
   * Run diagnostic for a product in a branch
   */
  diagnostic: (productId, branchId) => {
    return api.get(API_ENDPOINTS.INVENTORY_MAINTENANCE.DIAGNOSTIC(productId, branchId));
  },
};

export default inventoryMaintenanceService;
