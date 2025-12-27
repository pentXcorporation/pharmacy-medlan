import { apiClient } from '@/lib/api';

/**
 * Branch Reports Service
 * Handles report generation and data for branch managers
 */

const REPORTS_ENDPOINT = '/branch/reports';

export const branchReportsService = {
  /**
   * Get report (generic)
   */
  getReport: (type, params = {}) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/${type}`, { params });
  },

  /**
   * Get daily sales report
   */
  getDailySalesReport: (date) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/sales/daily`, {
      params: { date },
    });
  },

  /**
   * Get weekly sales report
   */
  getWeeklySalesReport: (startDate) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/sales/weekly`, {
      params: { start_date: startDate },
    });
  },

  /**
   * Get monthly sales report
   */
  getMonthlySalesReport: (year, month) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/sales/monthly`, {
      params: { year, month },
    });
  },

  /**
   * Get custom date range sales report
   */
  getSalesReport: (startDate, endDate) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/sales`, {
      params: { start_date: startDate, end_date: endDate },
    });
  },

  /**
   * Get inventory report
   */
  getInventoryReport: () => {
    return apiClient.get(`${REPORTS_ENDPOINT}/inventory`);
  },

  /**
   * Get staff performance report
   */
  getStaffPerformanceReport: (period = 'month') => {
    return apiClient.get(`${REPORTS_ENDPOINT}/staff/performance`, {
      params: { period },
    });
  },

  /**
   * Get attendance report
   */
  getAttendanceReport: (year, month) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/attendance`, {
      params: { year, month },
    });
  },

  /**
   * Get expiry report
   */
  getExpiryReport: (days = 90) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/expiry`, {
      params: { days },
    });
  },

  /**
   * Get low stock report
   */
  getLowStockReport: () => {
    return apiClient.get(`${REPORTS_ENDPOINT}/low-stock`);
  },

  /**
   * Export report as PDF
   */
  exportReportPDF: (reportType, params = {}) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/${reportType}/export/pdf`, {
      params,
      responseType: 'blob',
    });
  },

  /**
   * Export report as Excel
   */
  exportReportExcel: (reportType, params = {}) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/${reportType}/export/excel`, {
      params,
      responseType: 'blob',
    });
  },

  /**
   * Get comparison report (compare with previous period)
   */
  getComparisonReport: (currentPeriod, previousPeriod) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/comparison`, {
      params: {
        current_start: currentPeriod.start,
        current_end: currentPeriod.end,
        previous_start: previousPeriod.start,
        previous_end: previousPeriod.end,
      },
    });
  },

  /**
   * Get product category sales breakdown
   */
  getCategorySalesReport: (startDate, endDate) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/sales/by-category`, {
      params: { start_date: startDate, end_date: endDate },
    });
  },

  /**
   * Get hourly sales pattern
   */
  getHourlySalesPattern: (date) => {
    return apiClient.get(`${REPORTS_ENDPOINT}/sales/hourly`, {
      params: { date },
    });
  },
};
