/**
 * GRN Service
 * API calls for Goods Receipt Note management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const grnService = {
  /**
   * Get all GRNs (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "createdAt,desc", ...filters } = params;
    return api.get(API_ENDPOINTS.GRN.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get GRN by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.GRN.BY_ID(id));
  },

  /**
   * Get GRN by number
   */
  getByNumber: (grnNumber) => {
    return api.get(API_ENDPOINTS.GRN.BY_NUMBER(grnNumber));
  },

  /**
   * Get GRNs by branch
   */
  getByBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.GRN.BY_BRANCH(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get GRNs by supplier
   */
  getBySupplier: (supplierId, params = {}) => {
    return api.get(API_ENDPOINTS.GRN.BY_SUPPLIER(supplierId), {
      params: { ...params },
    });
  },

  /**
   * Get GRNs by status
   */
  getByStatus: (status, params = {}) => {
    return api.get(API_ENDPOINTS.GRN.BY_STATUS(status), {
      params: { ...params },
    });
  },

  /**
   * Create new GRN
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.GRN.BASE, data);
  },

  /**
   * Update existing GRN (only for PENDING/DRAFT status)
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.GRN.BY_ID(id), data);
  },

  /**
   * Approve GRN
   */
  approve: (id) => {
    return api.post(API_ENDPOINTS.GRN.APPROVE(id));
  },

  /**
   * Reject GRN
   */
  reject: (id, reason) => {
    return api.post(API_ENDPOINTS.GRN.REJECT(id), { reason });
  },

  /**
   * Cancel GRN
   */
  cancel: (id, reason) => {
    return api.post(API_ENDPOINTS.GRN.CANCEL(id), { reason });
  },

  /**
   * Verify GRN (moves DRAFT to VERIFIED status)
   */
  verify: (id) => {
    return api.post(API_ENDPOINTS.GRN.APPROVE(id));
  },

  /**
   * Complete GRN (creates inventory batches and updates stock)
   */
  complete: (id) => {
    return api.post(API_ENDPOINTS.GRN.APPROVE(id));
  },
};

/**
 * RGRN (Return GRN) Service
 */
export const rgrnService = {
  /**
   * Get all RGRNs (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "createdAt,desc" } = params;
    return api.get(API_ENDPOINTS.RGRN.BASE, {
      params: { page, size, sort },
    });
  },

  /**
   * Get RGRN by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.RGRN.BY_ID(id));
  },

  /**
   * Get RGRNs by supplier
   */
  getBySupplier: (supplierId, params = {}) => {
    return api.get(API_ENDPOINTS.RGRN.BY_SUPPLIER(supplierId), {
      params: { ...params },
    });
  },

  /**
   * Get RGRNs by original GRN
   */
  getByGrn: (grnId, params = {}) => {
    return api.get(API_ENDPOINTS.RGRN.BY_GRN(grnId), {
      params: { ...params },
    });
  },

  /**
   * Create RGRN
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.RGRN.BASE, data);
  },

  /**
   * Update refund status
   */
  updateRefundStatus: (id, status) => {
    return api.put(API_ENDPOINTS.RGRN.UPDATE_REFUND_STATUS(id), { status });
  },

  /**
   * Delete RGRN (admin only)
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.RGRN.BY_ID(id));
  },
};

export default grnService;
