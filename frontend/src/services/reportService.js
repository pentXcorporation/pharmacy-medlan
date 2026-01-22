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

  // ===================
  // AGGREGATE REPORTS (Frontend convenience methods)
  // ===================

  /**
   * Get comprehensive sales report
   */
  getSalesReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    
    try {
      // Fetch all required data in parallel
      const [totalResponse, countResponse, topProductsResponse, dailySalesResponse] = await Promise.all([
        reportService.getSalesTotal(branchId, startDate, endDate),
        reportService.getSalesCount(branchId, startDate, endDate),
        reportService.getTopProducts(branchId, startDate, endDate, 10),
        reportService.getDailySales(branchId, startDate, endDate),
      ]);

      // Extract data from responses
      const totalSales = totalResponse?.data?.data || 0;
      const salesCount = countResponse?.data?.data || 0;
      const topProducts = topProductsResponse?.data?.data || [];
      const dailySales = dailySalesResponse?.data?.data || [];

      // Calculate summary metrics
      const averageSale = salesCount > 0 ? totalSales / salesCount : 0;
      const itemsSold = topProducts.reduce((sum, p) => sum + (p.quantitySold || 0), 0);
      const uniqueCustomers = 0; // Would need customer data

      return {
        data: {
          summary: {
            totalSales,
            salesCount,
            averageSale,
            itemsSold,
            uniqueCustomers,
          },
          topProducts,
          dailySales,
        }
      };
    } catch (error) {
      console.error("Error fetching sales report:", error);
      throw error;
    }
  },

  /**
   * Get comprehensive inventory report
   */
  getInventoryReport: async (params) => {
    const { branchId } = params;
    
    try {
      // Fetch all required data in parallel
      const [stockValueResponse, lowStockResponse, expiringResponse, summaryResponse, categoryResponse] = await Promise.all([
        reportService.getStockValue(branchId),
        reportService.getLowStockReport(branchId),
        reportService.getExpiringStockReport(branchId, 30),
        reportService.getInventorySummary(branchId),
        reportService.getStockValueByCategory(branchId),
      ]);

      // Extract data from responses
      const totalStockValue = stockValueResponse?.data?.data || 0;
      const lowStockItems = lowStockResponse?.data?.data?.content || lowStockResponse?.data?.data || [];
      const expiringItems = expiringResponse?.data?.data?.content || expiringResponse?.data?.data || [];
      const summaryData = summaryResponse?.data?.data || {};
      const stockLevels = categoryResponse?.data?.data || [];

      // Calculate summary metrics
      const lowStockCount = lowStockItems.filter(item => item.currentStock < item.reorderLevel).length;
      const outOfStockCount = lowStockItems.filter(item => item.currentStock === 0).length;
      const expiringCount = expiringItems.length;

      return {
        data: {
          summary: {
            totalStockValue,
            totalProducts: summaryData.totalProducts || 0,
            lowStockCount,
            outOfStockCount,
            expiringCount,
          },
          stockLevels,
          lowStockItems,
          expiringItems,
        }
      };
    } catch (error) {
      console.error("Error fetching inventory report:", error);
      throw error;
    }
  },

  /**
   * Get comprehensive financial report
   */
  getFinancialReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    
    try {
      // Fetch all required data in parallel
      const [revenueResponse, profitLossResponse, summaryResponse] = await Promise.all([
        reportService.getRevenue(branchId, startDate, endDate),
        reportService.getProfitLoss(branchId, startDate, endDate),
        reportService.getFinancialSummary(branchId, startDate, endDate),
      ]);

      // Extract data from responses
      const revenue = revenueResponse?.data?.data || 0;
      const profitLossData = profitLossResponse?.data?.data || {};
      const summaryData = summaryResponse?.data?.data || {};

      // Build summary
      const totalRevenue = revenue;
      const totalExpenses = profitLossData.totalExpenses || 0;
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      return {
        data: {
          summary: {
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin,
          },
          transactions: summaryData.transactions || [],
          paymentMethods: summaryData.paymentMethods || [],
          expenses: summaryData.expenses || [],
        }
      };
    } catch (error) {
      console.error("Error fetching financial report:", error);
      throw error;
    }
  },

  /**
   * Get purchase report
   */
  getPurchaseReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    
    // Placeholder - implement when backend endpoints are ready
    return {
      data: {
        summary: {
          totalPurchases: 0,
          purchaseCount: 0,
          averagePurchase: 0,
        },
        topSuppliers: [],
        dailyPurchases: [],
      }
    };
  },

  /**
   * Get expiry report
   */
  getExpiryReport: async (params) => {
    const { branchId } = params;
    
    try {
      const [expiringResponse, expiredResponse] = await Promise.all([
        reportService.getExpiringStockReport(branchId, 30),
        reportService.getExpiredStockReport(branchId),
      ]);

      const expiringItems = expiringResponse?.data?.data?.content || expiringResponse?.data?.data || [];
      const expiredItems = expiredResponse?.data?.data?.content || expiredResponse?.data?.data || [];

      return {
        data: {
          summary: {
            expiringCount: expiringItems.length,
            expiredCount: expiredItems.length,
          },
          expiringItems,
          expiredItems,
        }
      };
    } catch (error) {
      console.error("Error fetching expiry report:", error);
      throw error;
    }
  },

  /**
   * Get profit/loss report
   */
  getProfitLossReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    
    try {
      const response = await reportService.getProfitLoss(branchId, startDate, endDate);
      return response;
    } catch (error) {
      console.error("Error fetching profit/loss report:", error);
      throw error;
    }
  },
};

export default reportService;
