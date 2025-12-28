/**
 * Purchase Order Service
 * API calls for purchase order management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const purchaseOrderService = {
  /**
   * Get all purchase orders (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "createdAt,desc", ...filters } = params;
    return api.get(API_ENDPOINTS.PURCHASE_ORDERS.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get PO by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.PURCHASE_ORDERS.BY_ID(id));
  },

  /**
   * Get PO by number
   */
  getByNumber: (poNumber) => {
    return api.get(API_ENDPOINTS.PURCHASE_ORDERS.BY_NUMBER(poNumber));
  },

  /**
   * Get POs by supplier
   */
  getBySupplier: (supplierId, params = {}) => {
    return api.get(API_ENDPOINTS.PURCHASE_ORDERS.BY_SUPPLIER(supplierId), {
      params: { ...params },
    });
  },

  /**
   * Get POs by branch
   */
  getByBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.PURCHASE_ORDERS.BY_BRANCH(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get POs by status
   */
  getByStatus: (status, params = {}) => {
    return api.get(API_ENDPOINTS.PURCHASE_ORDERS.BY_STATUS(status), {
      params: { ...params },
    });
  },

  /**
   * Create new PO
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.PURCHASE_ORDERS.BASE, data);
  },

  /**
   * Update PO status
   */
  updateStatus: (id, status) => {
    return api.put(API_ENDPOINTS.PURCHASE_ORDERS.UPDATE_STATUS(id), { status });
  },

  /**
   * Approve PO
   */
  approve: (id) => {
    return api.post(API_ENDPOINTS.PURCHASE_ORDERS.APPROVE(id));
  },

  /**
   * Reject PO
   */
  reject: (id, reason) => {
    return api.post(API_ENDPOINTS.PURCHASE_ORDERS.REJECT(id), { reason });
  },

  /**
   * Delete PO (admin only)
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.PURCHASE_ORDERS.BY_ID(id));
  },
};

export default purchaseOrderService;
