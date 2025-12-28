/**
 * Dashboard Service
 * API calls for dashboard data
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const dashboardService = {
  /**
   * Get dashboard summary
   */
  getSummary: (branchId) => {
    return api.get(API_ENDPOINTS.DASHBOARD.SUMMARY, {
      params: { branchId },
    });
  },

  /**
   * Get sales chart data
   */
  getSalesChart: (branchId, period = "week") => {
    return api.get(API_ENDPOINTS.DASHBOARD.SALES_CHART, {
      params: { branchId, period },
    });
  },
};

export default dashboardService;
