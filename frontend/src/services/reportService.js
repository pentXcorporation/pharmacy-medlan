/**
 * Report Service
 * API calls for reports and analytics
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const reportService = {
  // ===================
  // SALES REPORTS
  // ===================

  /**
   * Get total sales amount
   */
  getSalesTotal: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.SALES.TOTAL, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get sales count
   */
  getSalesCount: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.SALES.COUNT, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get detailed sales report
   */
  getSalesDetails: (branchId, startDate, endDate, params = {}) => {
    return api.get(API_ENDPOINTS.REPORTS.SALES.DETAILS, {
      params: { branchId, startDate, endDate, ...params },
    });
  },

  /**
   * Get daily sales breakdown
   */
  getDailySales: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.SALES.DAILY, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get top selling products
   */
  getTopProducts: (branchId, startDate, endDate, limit = 10) => {
    return api.get(API_ENDPOINTS.REPORTS.SALES.TOP_PRODUCTS, {
      params: { branchId, startDate, endDate, limit },
    });
  },

  /**
   * Get sales by payment method
   */
  getSalesByPaymentMethod: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.SALES.BY_PAYMENT_METHOD, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get period comparison
   */
  getSalesComparison: (
    branchId,
    currentStart,
    currentEnd,
    previousStart,
    previousEnd
  ) => {
    return api.get(API_ENDPOINTS.REPORTS.SALES.COMPARISON, {
      params: {
        branchId,
        currentStart,
        currentEnd,
        previousStart,
        previousEnd,
      },
    });
  },

  // ===================
  // INVENTORY REPORTS
  // ===================

  /**
   * Get total stock value
   */
  getStockValue: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.INVENTORY.STOCK_VALUE, {
      params: { branchId },
    });
  },

  /**
   * Get stock value by category
   */
  getStockValueByCategory: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.INVENTORY.VALUE_BY_CATEGORY, {
      params: { branchId },
    });
  },

  /**
   * Get low stock report
   */
  getLowStockReport: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.REPORTS.INVENTORY.LOW_STOCK, {
      params: { branchId, ...params },
    });
  },

  /**
   * Get expiring stock report
   */
  getExpiringStockReport: (branchId, days = 30, params = {}) => {
    return api.get(API_ENDPOINTS.REPORTS.INVENTORY.EXPIRING, {
      params: { branchId, days, ...params },
    });
  },

  /**
   * Get expired stock report
   */
  getExpiredStockReport: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.REPORTS.INVENTORY.EXPIRED, {
      params: { branchId, ...params },
    });
  },

  /**
   * Get inventory summary
   */
  getInventorySummary: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.INVENTORY.SUMMARY, {
      params: { branchId },
    });
  },

  /**
   * Get dead stock report
   */
  getDeadStock: (branchId, days = 90, params = {}) => {
    return api.get(API_ENDPOINTS.REPORTS.INVENTORY.DEAD_STOCK, {
      params: { branchId, days, ...params },
    });
  },

  // ===================
  // FINANCIAL REPORTS
  // ===================

  /**
   * Get total revenue
   */
  getRevenue: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.FINANCIAL.REVENUE, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get daily revenue breakdown
   */
  getDailyRevenue: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.FINANCIAL.DAILY_REVENUE, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get profit/loss report
   */
  getProfitLoss: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.FINANCIAL.PROFIT_LOSS, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get cash flow report
   */
  getCashFlow: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.FINANCIAL.CASH_FLOW, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get total receivables
   */
  getReceivables: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.FINANCIAL.RECEIVABLES, {
      params: { branchId },
    });
  },

  /**
   * Get ageing analysis
   */
  getAgeingReport: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.FINANCIAL.AGEING, {
      params: { branchId },
    });
  },

  /**
   * Get tax summary
   */
  getTaxSummary: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.FINANCIAL.TAX, {
      params: { branchId, startDate, endDate },
    });
  },

  /**
   * Get comprehensive financial summary
   */
  getFinancialSummary: (branchId, startDate, endDate) => {
    return api.get(API_ENDPOINTS.REPORTS.FINANCIAL.SUMMARY, {
      params: { branchId, startDate, endDate },
    });
  },

  // ===================
  // ALERTS
  // ===================

  /**
   * Get all alerts
   */
  getAlerts: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.REPORTS.ALERTS.ALL, {
      params: { branchId, ...params },
    });
  },

  /**
   * Get alert count
   */
  getAlertCount: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.ALERTS.COUNT, {
      params: { branchId },
    });
  },

  /**
   * Get low stock alerts
   */
  getLowStockAlerts: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.ALERTS.LOW_STOCK, {
      params: { branchId },
    });
  },

  /**
   * Get expiry alerts
   */
  getExpiryAlerts: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.ALERTS.EXPIRY, {
      params: { branchId },
    });
  },

  /**
   * Get overdue invoice alerts
   */
  getOverdueAlerts: (branchId) => {
    return api.get(API_ENDPOINTS.REPORTS.ALERTS.OVERDUE, {
      params: { branchId },
    });
  },

  /**
   * Acknowledge alert
   */
  acknowledgeAlert: (alertId) => {
    return api.post(API_ENDPOINTS.REPORTS.ALERTS.ACKNOWLEDGE(alertId));
  },
};

export default reportService;
