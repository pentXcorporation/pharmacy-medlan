/**
 * Cash Book Service
 * Handles all cash book-related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const cashBookService = {
  /**
   * Get all cash book entries with pagination
   */
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.CASH_BOOK.BASE, { params });
  },

  /**
   * Get cash book entry by ID
   */
  getById: (id) => {
    return api.get(`${API_ENDPOINTS.CASH_BOOK.BASE}/${id}`);
  },

  /**
   * Get cash book entries by branch
   */
  getByBranch: (branchId) => {
    return api.get(API_ENDPOINTS.CASH_BOOK.BY_BRANCH(branchId));
  },

  /**
   * Get cash book entries by date range
   */
  getByDateRange: (startDate, endDate) => {
    return api.get(`${API_ENDPOINTS.CASH_BOOK.BASE}/date-range`, {
      params: { startDate, endDate },
    });
  },

  /**
   * Get cash book entries by branch and date range
   */
  getByBranchAndDateRange: (branchId, startDate, endDate) => {
    return api.get(`${API_ENDPOINTS.CASH_BOOK.BASE}/branch/${branchId}/date-range`, {
      params: { startDate, endDate },
    });
  },

  /**
   * Get cash book summary (opening balance, receipts, payments, closing balance)
   */
  getSummary: (branchId, startDate, endDate) => {
    return api.get(`${API_ENDPOINTS.CASH_BOOK.BASE}/summary`, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Export cash book data to CSV/Excel
   */
  export: (params = {}) => {
    return api.get(`${API_ENDPOINTS.CASH_BOOK.BASE}/export`, {
      params,
      responseType: "blob",
    });
  },
};

export default cashBookService;
