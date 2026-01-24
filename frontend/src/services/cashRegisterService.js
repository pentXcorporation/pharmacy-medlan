import api from "@/utils/api";

const BASE_URL = '/cash-register';

/**
 * Cash Register Service
 * Handles all cash register operations including opening, closing, transactions, and deposits
 */
const cashRegisterService = {
  /**
   * Open a new cash register
   * @param {Object} data - { branchId, openingBalance, notes }
   * @returns {Promise} Cash register response
   */
  openRegister: async (data) => {
    const response = await api.post(`${BASE_URL}/open`, data);
    return response.data;
  },

  /**
   * Close a cash register
   * @param {number} registerId - Register ID
   * @param {Object} data - { closingBalance, notes }
   * @returns {Promise} Cash register response
   */
  closeRegister: async (registerId, data) => {
    const response = await api.post(`${BASE_URL}/${registerId}/close`, data);
    return response.data;
  },

  /**
   * Record cash in transaction
   * @param {number} registerId - Register ID
   * @param {Object} data - { type, amount, description, category }
   * @returns {Promise} Cash register response
   */
  recordCashIn: async (registerId, data) => {
    const response = await api.post(`${BASE_URL}/${registerId}/cash-in`, data);
    return response.data;
  },

  /**
   * Record cash out transaction
   * @param {number} registerId - Register ID
   * @param {Object} data - { type, amount, description, category }
   * @returns {Promise} Cash register response
   */
  recordCashOut: async (registerId, data) => {
    const response = await api.post(`${BASE_URL}/${registerId}/cash-out`, data);
    return response.data;
  },

  /**
   * Deposit cash to bank
   * @param {number} registerId - Register ID
   * @param {Object} data - { bankId, amount, notes }
   * @returns {Promise} Cash register response
   */
  depositToBank: async (registerId, data) => {
    const response = await api.post(`${BASE_URL}/${registerId}/deposit`, data);
    return response.data;
  },

  /**
   * Get current open register for a branch
   * @param {number} branchId - Branch ID
   * @returns {Promise} Cash register response
   */
  getCurrentRegister: async (branchId) => {
    const response = await api.get(`${BASE_URL}/current`, {
      params: { branchId }
    });
    return response.data;
  },

  /**
   * Get cash register by ID
   * @param {number} registerId - Register ID
   * @returns {Promise} Cash register response
   */
  getRegisterById: async (registerId) => {
    const response = await api.get(`${BASE_URL}/${registerId}`);
    return response.data;
  },

  /**
   * Get all cash registers with pagination
   * @param {Object} params - { page, size, sort }
   * @returns {Promise} Paginated cash registers
   */
  getAllRegisters: async (params = {}) => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  /**
   * Get cash registers by branch
   * @param {number} branchId - Branch ID
   * @param {Object} params - { page, size, sort }
   * @returns {Promise} Paginated cash registers
   */
  getRegistersByBranch: async (branchId, params = {}) => {
    const response = await api.get(`${BASE_URL}/branch/${branchId}`, { params });
    return response.data;
  },

  /**
   * Get cash registers by date range
   * @param {number} branchId - Branch ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} List of cash registers
   */
  getRegistersByDateRange: async (branchId, startDate, endDate) => {
    const response = await api.get(`${BASE_URL}/branch/${branchId}/date-range`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  /**
   * Get all transactions for a register
   * @param {number} registerId - Register ID
   * @returns {Promise} List of transactions
   */
  getRegisterTransactions: async (registerId) => {
    const response = await api.get(`${BASE_URL}/${registerId}/transactions`);
    return response.data;
  },

  /**
   * Get daily summary for a branch
   * @param {number} branchId - Branch ID
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise} Daily summary
   */
  getDailySummary: async (branchId, date) => {
    const response = await api.get(`${BASE_URL}/daily-summary`, {
      params: { branchId, date }
    });
    return response.data;
  },

  /**
   * Delete a cash register
   * @param {number} registerId - Register ID
   * @returns {Promise} void
   */
  deleteRegister: async (registerId) => {
    const response = await api.delete(`${BASE_URL}/${registerId}`);
    return response.data;
  }
};

export default cashRegisterService;
