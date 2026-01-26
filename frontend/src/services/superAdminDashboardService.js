import { apiClient } from '@/utils/api';

const BASE_URL = '/dashboard/super-admin';

/**
 * Super Admin Dashboard Service
 * Provides all API calls for the Super Admin Dashboard
 */

/**
 * Get complete dashboard data with all metrics
 */
export const getSuperAdminDashboard = async () => {
  const response = await apiClient.get(BASE_URL);
  return response.data;
};

/**
 * Get system health metrics
 */
export const getSystemMetrics = async () => {
  const response = await apiClient.get(`${BASE_URL}/system-metrics`);
  return response.data;
};

/**
 * Get branch analytics with performance comparisons
 */
export const getBranchAnalytics = async () => {
  const response = await apiClient.get(`${BASE_URL}/branch-analytics`);
  return response.data;
};

/**
 * Get business metrics (sales, orders, growth)
 */
export const getBusinessMetrics = async () => {
  const response = await apiClient.get(`${BASE_URL}/business-metrics`);
  return response.data;
};

/**
 * Get inventory overview (stock levels, alerts)
 */
export const getInventoryOverview = async () => {
  const response = await apiClient.get(`${BASE_URL}/inventory-overview`);
  return response.data;
};

/**
 * Get user statistics
 */
export const getUserStatistics = async () => {
  const response = await apiClient.get(`${BASE_URL}/user-statistics`);
  return response.data;
};

/**
 * Get financial summary
 */
export const getFinancialSummary = async () => {
  const response = await apiClient.get(`${BASE_URL}/financial-summary`);
  return response.data;
};

/**
 * Get recent activities
 * @param {number} limit - Number of activities to fetch (default: 10)
 */
export const getRecentActivities = async (limit = 10) => {
  const response = await apiClient.get(`${BASE_URL}/recent-activities`, {
    params: { limit }
  });
  return response.data;
};

/**
 * Health check endpoint
 */
export const healthCheck = async () => {
  const response = await apiClient.get(`${BASE_URL}/health`);
  return response.data;
};

export default {
  getSuperAdminDashboard,
  getSystemMetrics,
  getBranchAnalytics,
  getBusinessMetrics,
  getInventoryOverview,
  getUserStatistics,
  getFinancialSummary,
  getRecentActivities,
  healthCheck,
};
