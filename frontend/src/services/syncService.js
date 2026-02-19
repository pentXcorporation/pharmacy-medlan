/**
 * Sync Service
 * Handles data synchronization operations
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const syncService = {
  /**
   * Start a sync operation
   */
  start: (data) => {
    return api.post(API_ENDPOINTS.SYNC.START, data);
  },

  /**
   * Mark sync as complete
   */
  complete: (id, data = {}) => {
    return api.put(API_ENDPOINTS.SYNC.COMPLETE(id), data);
  },

  /**
   * Mark sync as failed
   */
  fail: (id, data = {}) => {
    return api.put(API_ENDPOINTS.SYNC.FAIL(id), data);
  },

  /**
   * Get sync records by branch
   */
  getByBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.SYNC.BY_BRANCH(branchId), { params });
  },

  /**
   * Get sync records by type
   */
  getByType: (type, params = {}) => {
    return api.get(API_ENDPOINTS.SYNC.BY_TYPE(type), { params });
  },

  /**
   * Get sync records by status
   */
  getByStatus: (status, params = {}) => {
    return api.get(API_ENDPOINTS.SYNC.BY_STATUS(status), { params });
  },

  /**
   * Get latest sync record by type
   */
  getLatest: (type) => {
    return api.get(API_ENDPOINTS.SYNC.LATEST(type));
  },
};

export default syncService;
