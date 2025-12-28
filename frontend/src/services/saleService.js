/**
 * Sale Service
 * API calls for sales and POS management
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const saleService = {
  /**
   * Get all sales (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "createdAt,desc", ...filters } = params;
    return api.get(API_ENDPOINTS.SALES.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get sale by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.SALES.BY_ID(id));
  },

  /**
   * Get sale by sale number
   */
  getBySaleNumber: (saleNumber) => {
    return api.get(API_ENDPOINTS.SALES.BY_NUMBER(saleNumber));
  },

  /**
   * Get sales by branch
   */
  getByBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.SALES.BY_BRANCH(branchId), {
      params: { ...params },
    });
  },

  /**
   * Get sales by customer
   */
  getByCustomer: (customerId, params = {}) => {
    return api.get(API_ENDPOINTS.SALES.BY_CUSTOMER(customerId), {
      params: { ...params },
    });
  },

  /**
   * Get sales by date range
   */
  getByDateRange: (startDate, endDate, params = {}) => {
    return api.get(API_ENDPOINTS.SALES.BY_DATE_RANGE, {
      params: { startDate, endDate, ...params },
    });
  },

  /**
   * Create new sale
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.SALES.BASE, data);
  },

  /**
   * Cancel sale
   */
  cancel: (id, reason) => {
    return api.post(API_ENDPOINTS.SALES.CANCEL(id), { reason });
  },

  /**
   * Void sale (admin only)
   */
  void: (id, reason) => {
    return api.post(API_ENDPOINTS.SALES.VOID(id), { reason });
  },

  /**
   * Get total sales amount
   */
  getTotalAmount: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.SALES.TOTAL_AMOUNT, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get sales count
   */
  getCount: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.SALES.COUNT, {
      params: { branchId, startDate, endDate },
    });
  },
};

/**
 * Sale Returns Service
 */
export const saleReturnService = {
  /**
   * Get all returns (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "createdAt,desc" } = params;
    return api.get(API_ENDPOINTS.SALE_RETURNS.BASE, {
      params: { page, size, sort },
    });
  },

  /**
   * Get return by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.SALE_RETURNS.BY_ID(id));
  },

  /**
   * Get returns by customer
   */
  getByCustomer: (customerId, params = {}) => {
    return api.get(API_ENDPOINTS.SALE_RETURNS.BY_CUSTOMER(customerId), {
      params: { ...params },
    });
  },

  /**
   * Get returns by branch
   */
  getByBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.SALE_RETURNS.BY_BRANCH(branchId), {
      params: { ...params },
    });
  },

  /**
   * Create return
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.SALE_RETURNS.BASE, data);
  },

  /**
   * Delete return (admin only)
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.SALE_RETURNS.BY_ID(id));
  },
};

/**
 * Invoice Service
 */
export const invoiceService = {
  /**
   * Get all invoices (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "createdAt,desc" } = params;
    return api.get(API_ENDPOINTS.INVOICES.BASE, {
      params: { page, size, sort },
    });
  },

  /**
   * Get invoice by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.INVOICES.BY_ID(id));
  },

  /**
   * Get invoices by customer
   */
  getByCustomer: (customerId, params = {}) => {
    return api.get(API_ENDPOINTS.INVOICES.BY_CUSTOMER(customerId), {
      params: { ...params },
    });
  },

  /**
   * Get invoices by status
   */
  getByStatus: (status, params = {}) => {
    return api.get(API_ENDPOINTS.INVOICES.BY_STATUS(status), {
      params: { ...params },
    });
  },

  /**
   * Get overdue invoices
   */
  getOverdue: (params = {}) => {
    return api.get(API_ENDPOINTS.INVOICES.OVERDUE, {
      params: { ...params },
    });
  },

  /**
   * Record payment
   */
  recordPayment: (id, data) => {
    return api.post(API_ENDPOINTS.INVOICES.RECORD_PAYMENT(id), data);
  },

  /**
   * Get outstanding by customer
   */
  getOutstandingByCustomer: (customerId) => {
    return api.get(API_ENDPOINTS.INVOICES.OUTSTANDING_BY_CUSTOMER(customerId));
  },
};

export default saleService;
