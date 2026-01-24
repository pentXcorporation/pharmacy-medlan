/**
 * Cheque Service
 * API calls for cheque management with financial integration
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const chequeService = {
  /**
   * Get all cheques (paginated)
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "chequeDate,desc", ...filters } = params;
    return api.get(API_ENDPOINTS.CHEQUES.BASE, {
      params: { page, size, sort, ...filters },
    });
  },

  /**
   * Get cheque by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.CHEQUES.BY_ID(id));
  },

  /**
   * Create new cheque
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.CHEQUES.BASE, data);
  },

  /**
   * Update cheque
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.CHEQUES.BY_ID(id), data);
  },

  /**
   * Delete cheque
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.CHEQUES.BY_ID(id));
  },

  /**
   * Update cheque status
   */
  updateStatus: (id, status) => {
    return api.patch(`${API_ENDPOINTS.CHEQUES.BY_ID(id)}/status`, { status });
  },

  /**
   * Deposit cheque
   */
  depositCheque: (id, depositDate = null) => {
    return api.post(`${API_ENDPOINTS.CHEQUES.BY_ID(id)}/deposit`, {
      depositDate: depositDate || new Date().toISOString().split('T')[0]
    });
  },

  /**
   * Clear cheque (creates bank transaction)
   */
  clearCheque: (id, clearanceDate = null) => {
    return api.post(`${API_ENDPOINTS.CHEQUES.BY_ID(id)}/clear`, {
      clearanceDate: clearanceDate || new Date().toISOString().split('T')[0]
    });
  },

  /**
   * Bounce cheque (reverses bank transaction if exists)
   */
  bounceCheque: (id, reason, bounceDate = null) => {
    return api.post(`${API_ENDPOINTS.CHEQUES.BY_ID(id)}/bounce`, {
      reason,
      bounceDate: bounceDate || new Date().toISOString().split('T')[0]
    });
  },

  /**
   * Cancel cheque
   */
  cancelCheque: (id, reason) => {
    return api.post(`${API_ENDPOINTS.CHEQUES.BY_ID(id)}/cancel`, {
      reason
    });
  },

  /**
   * Reconcile cheque with bank statement
   */
  reconcileCheque: (id) => {
    return api.post(`${API_ENDPOINTS.CHEQUES.BY_ID(id)}/reconcile`);
  },

  /**
   * Get cheque statistics
   */
  getStats: () => {
    return api.get(`${API_ENDPOINTS.CHEQUES.BASE}/stats`);
  },

  /**
   * Get cheque statistics by date range
   */
  getStatsByDateRange: (startDate, endDate) => {
    return api.get(`${API_ENDPOINTS.CHEQUES.BASE}/stats/date-range`, {
      params: { startDate, endDate }
    });
  },
};

