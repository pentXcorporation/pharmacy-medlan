import { apiClient } from '@/lib/api';

/**
 * Branch Dashboard Service
 * Handles branch overview and metrics data
 */

const BRANCH_ENDPOINT = '/branch';

export const branchDashboardService = {
  /**
   * Get branch overview statistics
   */
  getOverview: () => {
    return apiClient.get(`${BRANCH_ENDPOINT}/overview`);
  },

  /**
   * Get today's metrics
   */
  getTodayMetrics: () => {
    return apiClient.get(`${BRANCH_ENDPOINT}/metrics/today`);
  },

  /**
   * Get sales summary for date range
   */
  getSalesSummary: (startDate, endDate) => {
    return apiClient.get(`${BRANCH_ENDPOINT}/sales/summary`, {
      params: { start_date: startDate, end_date: endDate },
    });
  },

  /**
   * Get top selling products
   */
  getTopProducts: (limit = 10, period = 'week') => {
    return apiClient.get(`${BRANCH_ENDPOINT}/products/top`, {
      params: { limit, period },
    });
  },

  /**
   * Get sales trend data
   */
  getSalesTrend: (period = 'week') => {
    return apiClient.get(`${BRANCH_ENDPOINT}/sales/trend`, {
      params: { period },
    });
  },

  /**
   * Get inventory alerts
   */
  getInventoryAlerts: () => {
    return apiClient.get(`${BRANCH_ENDPOINT}/inventory/alerts`);
  },

  /**
   * Get recent activities
   */
  getRecentActivities: (limit = 20) => {
    return apiClient.get(`${BRANCH_ENDPOINT}/activities`, {
      params: { limit },
    });
  },

  /**
   * Get branch information
   */
  getBranchInfo: () => {
    return apiClient.get(`${BRANCH_ENDPOINT}/info`);
  },

  /**
   * Update branch settings
   */
  updateBranchSettings: (data) => {
    return apiClient.put(`${BRANCH_ENDPOINT}/settings`, data);
  },
};
