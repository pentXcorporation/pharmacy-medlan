/**
 * Report Service
 * API calls for reports and analytics
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

export const reportService = {
  // ===================
  // SALES REPORTS (Core)
  // ===================

  getSalesTotal: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.TOTAL, { params: { branchId, startDate, endDate } }),

  getSalesCount: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.COUNT, { params: { branchId, startDate, endDate } }),

  getSalesDetails: (branchId, startDate, endDate, params = {}) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.DETAILS, { params: { branchId, startDate, endDate, ...params } }),

  getDailySales: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.DAILY, { params: { branchId, startDate, endDate } }),

  getTopProducts: (branchId, startDate, endDate, limit = 10) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.TOP_PRODUCTS, { params: { branchId, startDate, endDate, limit } }),

  getSalesByPaymentMethod: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.BY_PAYMENT_METHOD, { params: { branchId, startDate, endDate } }),

  getSalesComparison: (branchId, startDate1, endDate1, startDate2, endDate2) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.COMPARISON, { params: { branchId, startDate1, endDate1, startDate2, endDate2 } }),

  // ===================
  // ENHANCED SALES ANALYTICS
  // ===================

  getHourlySales: (branchId, date) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.HOURLY, { params: { branchId, date } }),

  getSalesByDayOfWeek: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.BY_DAY_OF_WEEK, { params: { branchId, startDate, endDate } }),

  getWeeklySales: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.WEEKLY, { params: { branchId, startDate, endDate } }),

  getMonthlySales: (branchId, months = 12) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.MONTHLY, { params: { branchId, months } }),

  getSalesTrend: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.TREND, { params: { branchId, startDate, endDate } }),

  getSalesDashboard: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.DASHBOARD, { params: { branchId, startDate, endDate } }),

  // ===================
  // CUSTOMER ANALYSIS
  // ===================

  getTopCustomers: (branchId, startDate, endDate, limit = 20) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.TOP_CUSTOMERS, { params: { branchId, startDate, endDate, limit } }),

  getCustomerFrequency: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.CUSTOMER_FREQUENCY, { params: { branchId, startDate, endDate } }),

  getNewVsReturningCustomers: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.NEW_VS_RETURNING, { params: { branchId, startDate, endDate } }),

  // ===================
  // RETURNS & DISCOUNTS
  // ===================

  getReturnsSummary: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.RETURNS_SUMMARY, { params: { branchId, startDate, endDate } }),

  getReturnsDailyTrend: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.RETURNS_DAILY_TREND, { params: { branchId, startDate, endDate } }),

  getDiscountAnalysis: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SALES.DISCOUNTS, { params: { branchId, startDate, endDate } }),

  // ===================
  // PRODUCT REPORTS
  // ===================

  getTopProductsByQuantity: (branchId, startDate, endDate, limit = 20) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.TOP_BY_QUANTITY, { params: { branchId, startDate, endDate, limit } }),

  getTopProductsByRevenue: (branchId, startDate, endDate, limit = 20) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.TOP_BY_REVENUE, { params: { branchId, startDate, endDate, limit } }),

  getSlowestMovingProducts: (branchId, startDate, endDate, limit = 20) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.SLOWEST_MOVING, { params: { branchId, startDate, endDate, limit } }),

  getNeverSoldProducts: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.NEVER_SOLD, { params: { branchId, startDate, endDate } }),

  getProductSalesVelocity: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.SALES_VELOCITY, { params: { branchId, startDate, endDate } }),

  getSalesByCategory: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.BY_CATEGORY, { params: { branchId, startDate, endDate } }),

  getSalesBySubCategory: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.BY_SUB_CATEGORY, { params: { branchId, startDate, endDate } }),

  getStockByCategory: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.STOCK_BY_CATEGORY, { params: { branchId } }),

  getProductCountByCategory: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.COUNT_BY_CATEGORY, { params: { branchId } }),

  getProductMargins: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.MARGINS, { params: { branchId, startDate, endDate } }),

  getHighestMarginProducts: (branchId, startDate, endDate, limit = 20) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.HIGHEST_MARGIN, { params: { branchId, startDate, endDate, limit } }),

  getLowestMarginProducts: (branchId, startDate, endDate, limit = 20) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.LOWEST_MARGIN, { params: { branchId, startDate, endDate, limit } }),

  getProductProfitContribution: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.PROFIT_CONTRIBUTION, { params: { branchId, startDate, endDate } }),

  getHighReturnRateProducts: (branchId, startDate, endDate, limit = 20) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.HIGH_RETURN_RATE, { params: { branchId, startDate, endDate, limit } }),

  getProductDiscountAnalysis: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.DISCOUNT_ANALYSIS, { params: { branchId, startDate, endDate } }),

  getProductsByPriceRange: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.BY_PRICE_RANGE, { params: { branchId } }),

  getProductBatchReport: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.BATCH_REPORT, { params: { branchId } }),

  getMultiBatchProducts: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.MULTI_BATCH, { params: { branchId } }),

  getExpiryLossProjection: (branchId, days = 90) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.EXPIRY_LOSS_PROJECTION, { params: { branchId, days } }),

  getProductMasterReport: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.MASTER, { params: { branchId } }),

  getProductActivitySummary: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.PRODUCTS.ACTIVITY_SUMMARY, { params: { branchId } }),

  // ===================
  // INVENTORY REPORTS
  // ===================

  getStockValue: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.STOCK_VALUE, { params: { branchId } }),

  getStockValueByCategory: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.VALUE_BY_CATEGORY, { params: { branchId } }),

  getStockMovement: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.STOCK_MOVEMENT, { params: { branchId, startDate, endDate } }),

  getStockInVsOut: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.STOCK_IN_VS_OUT, { params: { branchId, startDate, endDate } }),

  getLowStockReport: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.LOW_STOCK, { params: { branchId } }),

  getExpiringStockReport: (branchId, daysToExpiry = 30) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.EXPIRING, { params: { branchId, daysToExpiry } }),

  getExpiredStockReport: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.EXPIRED, { params: { branchId } }),

  getStockTurnover: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.TURNOVER, { params: { branchId, startDate, endDate } }),

  getStockTurnoverByProduct: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.TURNOVER_BY_PRODUCT, { params: { branchId, startDate, endDate } }),

  getDeadStock: (branchId, daysSinceLastSale = 90) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.DEAD_STOCK, { params: { branchId, daysSinceLastSale } }),

  getInventoryValuation: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.VALUATION, { params: { branchId } }),

  getBatchAging: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.BATCH_AGING, { params: { branchId } }),

  getCrossBranchInventory: () =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.CROSS_BRANCH),

  getStockTransferSummary: (startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.STOCK_TRANSFER_SUMMARY, { params: { startDate, endDate } }),

  getInventorySummary: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.SUMMARY, { params: { branchId } }),

  getInventoryHealthDashboard: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.INVENTORY.HEALTH_DASHBOARD, { params: { branchId } }),

  // ===================
  // FINANCIAL REPORTS
  // ===================

  getRevenue: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.REVENUE, { params: { branchId, startDate, endDate } }),

  getDailyRevenue: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.DAILY_REVENUE, { params: { branchId, startDate, endDate } }),

  getRevenueByCategory: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.REVENUE_BY_CATEGORY, { params: { branchId, startDate, endDate } }),

  getProfitLoss: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.PROFIT_LOSS, { params: { branchId, startDate, endDate } }),

  getCashFlow: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.CASH_FLOW, { params: { branchId, startDate, endDate } }),

  getReceivables: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.RECEIVABLES, { params: { branchId } }),

  getAgeingReport: (branchId, type = "receivables") =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.AGEING, { params: { branchId, type } }),

  getTaxSummary: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.TAX, { params: { branchId, startDate, endDate } }),

  getFinancialSummary: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.FINANCIAL.SUMMARY, { params: { branchId, startDate, endDate } }),

  // ===================
  // EMPLOYEE REPORTS
  // ===================

  getAttendanceSummary: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.ATTENDANCE_SUMMARY, { params: { branchId, startDate, endDate } }),

  getEmployeeAttendanceDetail: (employeeId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.ATTENDANCE_DETAIL(employeeId), { params: { startDate, endDate } }),

  getAttendanceRate: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.ATTENDANCE_RATE, { params: { branchId, startDate, endDate } }),

  getTopAbsentees: (branchId, startDate, endDate, limit = 10) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.TOP_ABSENTEES, { params: { branchId, startDate, endDate, limit } }),

  getLateArrivals: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.LATE_ARRIVALS, { params: { branchId, startDate, endDate } }),

  getWorkHours: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.WORK_HOURS, { params: { branchId, startDate, endDate } }),

  getOvertimeReport: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.OVERTIME, { params: { branchId, startDate, endDate } }),

  getPayrollSummary: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.PAYROLL_SUMMARY, { params: { branchId, startDate, endDate } }),

  getPayrollBreakdown: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.PAYROLL_BREAKDOWN, { params: { branchId, startDate, endDate } }),

  getPayrollTrend: (branchId, months = 12) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.PAYROLL_TREND, { params: { branchId, months } }),

  getPayrollByEmploymentType: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.PAYROLL_BY_TYPE, { params: { branchId, startDate, endDate } }),

  getEmployeeSalesPerformance: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.SALES_PERFORMANCE, { params: { branchId, startDate, endDate } }),

  getEmployeeTransactionCount: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.TRANSACTION_COUNT, { params: { branchId, startDate, endDate } }),

  getTopPerformers: (branchId, startDate, endDate, limit = 10) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.TOP_PERFORMERS, { params: { branchId, startDate, endDate, limit } }),

  getEmployeeScorecard: (employeeId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.SCORECARD(employeeId), { params: { startDate, endDate } }),

  getHeadcountSummary: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.HEADCOUNT, { params: { branchId } }),

  getEmployeeTenure: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.TENURE, { params: { branchId } }),

  getSalaryDistribution: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.SALARY_DISTRIBUTION, { params: { branchId } }),

  getEmployeeMasterReport: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.EMPLOYEES.MASTER, { params: { branchId } }),

  // ===================
  // SUPPLIER REPORTS
  // ===================

  getPurchaseSummary: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.PURCHASE_SUMMARY, { params: { branchId, startDate, endDate } }),

  getPurchaseBySupplier: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.PURCHASE_BY_SUPPLIER, { params: { branchId, startDate, endDate } }),

  getPurchaseTrend: (branchId, months = 12) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.PURCHASE_TREND, { params: { branchId, months } }),

  getTopSuppliers: (branchId, startDate, endDate, limit = 10) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.TOP, { params: { branchId, startDate, endDate, limit } }),

  getGRNReport: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.GRN_REPORT, { params: { branchId, startDate, endDate } }),

  getSupplierPaymentSummary: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.PAYMENT_SUMMARY, { params: { branchId } }),

  getSupplierPayablesAgeing: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.PAYABLES_AGEING, { params: { branchId } }),

  getSupplierPaymentHistory: (supplierId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.PAYMENT_HISTORY(supplierId), { params: { startDate, endDate } }),

  getOverdueSupplierPayments: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.OVERDUE_PAYMENTS, { params: { branchId } }),

  getSupplierDeliveryPerformance: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.DELIVERY_PERFORMANCE, { params: { branchId, startDate, endDate } }),

  getSupplierReturnRate: (branchId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.RETURN_RATE, { params: { branchId, startDate, endDate } }),

  getSupplierProductMix: (supplierId, startDate, endDate) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.PRODUCT_MIX(supplierId), { params: { startDate, endDate } }),

  getSupplierMasterReport: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.SUPPLIERS.MASTER, { params: { branchId } }),

  // ===================
  // ALERTS
  // ===================

  getAlerts: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.ALERTS.ALL, { params: { branchId } }),

  getAlertCount: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.ALERTS.COUNT, { params: { branchId } }),

  getLowStockAlerts: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.ALERTS.LOW_STOCK, { params: { branchId } }),

  getExpiryAlerts: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.ALERTS.EXPIRY, { params: { branchId } }),

  getOverdueAlerts: (branchId) =>
    api.get(API_ENDPOINTS.REPORTS.ALERTS.OVERDUE, { params: { branchId } }),

  acknowledgeAlert: (alertId) =>
    api.post(API_ENDPOINTS.REPORTS.ALERTS.ACKNOWLEDGE(alertId)),

  // ===================
  // AGGREGATE REPORTS (Frontend convenience methods)
  // Uses Promise.allSettled for resilience — individual endpoint failures won't break the whole report
  // ===================

  getSalesReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    try {
      const results = await Promise.allSettled([
        reportService.getTotalSales(branchId, startDate, endDate),
        reportService.getSalesCount(branchId, startDate, endDate),
        reportService.getTopProducts(branchId, startDate, endDate, 10),
        reportService.getDailySales(branchId, startDate, endDate),
      ]);

      const totalRes = results[0].status === "fulfilled" ? results[0].value : null;
      const countRes = results[1].status === "fulfilled" ? results[1].value : null;
      const topRes = results[2].status === "fulfilled" ? results[2].value : null;
      const dailyRes = results[3].status === "fulfilled" ? results[3].value : null;

      // Total sales returns BigDecimal, count returns Long
      const totalRaw = totalRes?.data?.data ?? totalRes?.data ?? 0;
      const totalSales = typeof totalRaw === "number" ? totalRaw : (Number(totalRaw) || 0);
      const countRaw = countRes?.data?.data ?? countRes?.data ?? 0;
      const salesCount = typeof countRaw === "number" ? countRaw : (Number(countRaw) || 0);

      const topProducts = topRes?.data?.data ?? topRes?.data ?? [];

      // Daily sales from backend is Map<String, BigDecimal> → convert to array
      const dailyRaw = dailyRes?.data?.data ?? dailyRes?.data ?? {};
      const dailySales = typeof dailyRaw === "object" && !Array.isArray(dailyRaw)
        ? Object.entries(dailyRaw)
            .filter(([, amount]) => Number(amount) > 0)
            .map(([date, amount]) => ({ date, revenue: Number(amount) }))
            .sort((a, b) => a.date.localeCompare(b.date))
        : Array.isArray(dailyRaw) ? dailyRaw : [];

      const averageSale = salesCount > 0 ? totalSales / salesCount : 0;
      const itemsSold = Array.isArray(topProducts)
        ? topProducts.reduce((s, p) => s + (p.quantitySold || p.quantity || 0), 0)
        : 0;

      return {
        data: {
          summary: { totalSales, salesCount, averageSale, itemsSold, uniqueCustomers: 0 },
          topProducts: Array.isArray(topProducts) ? topProducts : [],
          dailySales,
        },
      };
    } catch (error) {
      console.error("Error fetching sales report:", error);
      throw error;
    }
  },

  getInventoryReport: async (params) => {
    const { branchId } = params;
    try {
      const results = await Promise.allSettled([
        reportService.getInventorySummary(branchId),
        reportService.getLowStockReport(branchId),
        reportService.getExpiringStockReport(branchId, 30),
        reportService.getStockValueByCategory(branchId),
      ]);

      const summaryRes = results[0].status === "fulfilled" ? results[0].value : null;
      const lowStockRes = results[1].status === "fulfilled" ? results[1].value : null;
      const expiringRes = results[2].status === "fulfilled" ? results[2].value : null;
      const categoryRes = results[3].status === "fulfilled" ? results[3].value : null;

      const summaryData = summaryRes?.data?.data ?? summaryRes?.data ?? {};
      const lowStockItems = lowStockRes?.data?.data?.content || lowStockRes?.data?.data || lowStockRes?.data || [];
      const expiringRaw = expiringRes?.data?.data?.content || expiringRes?.data?.data || expiringRes?.data || [];

      // Normalize expiring items — backend returns expiryDate as [y,m,d] array and daysToExpiry
      const expiringItems = Array.isArray(expiringRaw)
        ? expiringRaw.map((item) => {
            let expiryDateStr = item.expiryDate;
            if (Array.isArray(item.expiryDate) && item.expiryDate.length >= 3) {
              const [y, m, d] = item.expiryDate;
              expiryDateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            }
            return {
              ...item,
              expiryDate: expiryDateStr,
              daysLeft: item.daysToExpiry ?? item.daysLeft ?? 0,
            };
          })
        : [];

      // Stock by category: backend returns Map<String, BigDecimal> → convert to array
      const categoryRaw = categoryRes?.data?.data ?? categoryRes?.data ?? {};
      const stockLevels = typeof categoryRaw === "object" && !Array.isArray(categoryRaw)
        ? Object.entries(categoryRaw).map(([categoryName, stockValue]) => ({
            categoryName,
            stockValue: Number(stockValue) || 0,
          }))
        : Array.isArray(categoryRaw) ? categoryRaw : [];

      return {
        data: {
          summary: {
            totalStockValue: summaryData.totalValue ?? summaryData.totalStockValue ?? 0,
            totalProducts: summaryData.totalProducts ?? 0,
            totalQuantity: summaryData.totalQuantity ?? 0,
            lowStockCount: summaryData.lowStockCount ?? (Array.isArray(lowStockItems) ? lowStockItems.length : 0),
            outOfStockCount: summaryData.outOfStockCount ?? 0,
            expiringCount: summaryData.expiringCount ?? (Array.isArray(expiringItems) ? expiringItems.length : 0),
            expiredCount: summaryData.expiredCount ?? 0,
          },
          stockLevels,
          lowStockItems: Array.isArray(lowStockItems) ? lowStockItems : [],
          expiringItems,
        },
      };
    } catch (error) {
      console.error("Error fetching inventory report:", error);
      throw error;
    }
  },

  getFinancialReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    try {
      const results = await Promise.allSettled([
        reportService.getFinancialSummary(branchId, startDate, endDate),
        reportService.getSalesByPaymentMethod(branchId, startDate, endDate),
      ]);

      const summaryRes = results[0].status === "fulfilled" ? results[0].value : null;
      const paymentRes = results[1].status === "fulfilled" ? results[1].value : null;

      // Financial summary has: revenue, expenses, profitability, cashFlow, etc.
      const summaryData = summaryRes?.data?.data ?? summaryRes?.data ?? {};
      const revenueData = summaryData.revenue ?? {};
      const expensesData = summaryData.expenses ?? {};
      const profitData = summaryData.profitability ?? {};
      const cashFlowData = summaryData.cashFlow ?? {};

      const totalRevenue = revenueData.totalSales ?? revenueData.netRevenue ?? 0;
      const totalExpenses = expensesData.totalExpenses ?? 0;
      const netProfit = profitData.netProfit ?? profitData.grossProfit ?? (totalRevenue - totalExpenses);
      const profitMargin = profitData.netMargin ?? profitData.grossMargin ?? (totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0);

      // Payment methods from sales endpoint — normalize field names
      // Backend returns { paymentMethod, total } — UI expects { method, amount, percentage }
      const paymentMethodsRaw = paymentRes?.data?.data ?? paymentRes?.data ?? [];
      const paymentMethodsList = Array.isArray(paymentMethodsRaw) ? paymentMethodsRaw : [];
      const totalPayments = paymentMethodsList.reduce((sum, p) => sum + (Number(p.total ?? p.amount ?? 0)), 0);
      const paymentMethods = paymentMethodsList.map((p) => ({
        method: p.paymentMethod ?? p.method ?? "UNKNOWN",
        amount: Number(p.total ?? p.amount ?? 0),
        transactionCount: p.transactionCount ?? p.count ?? 0,
        percentage: totalPayments > 0
          ? ((Number(p.total ?? p.amount ?? 0) / totalPayments) * 100)
          : 0,
      }));

      return {
        data: {
          summary: {
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin: typeof profitMargin === "number" ? profitMargin : Number(profitMargin) || 0,
          },
          cashFlow: {
            cashIn: cashFlowData.cashIn ?? 0,
            cashOut: cashFlowData.cashOut ?? 0,
            openingCash: cashFlowData.openingCash ?? 0,
            closingCash: cashFlowData.closingCash ?? 0,
          },
          revenue: {
            cashSales: revenueData.cashSales ?? 0,
            creditSales: revenueData.creditSales ?? 0,
            returnsRefunds: revenueData.returnsRefunds ?? 0,
          },
          expenses: expensesData,
          paymentMethods,
          transactions: [],
        },
      };
    } catch (error) {
      console.error("Error fetching financial report:", error);
      throw error;
    }
  },

  getEmployeeReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    try {
      const results = await Promise.allSettled([
        reportService.getHeadcountSummary(branchId),
        reportService.getTopPerformers(branchId, startDate, endDate, 10),
        reportService.getPayrollSummary(branchId, startDate, endDate),
        reportService.getAttendanceSummary(branchId, startDate, endDate),
      ]);

      return {
        data: {
          headcount: results[0].status === "fulfilled" ? (results[0].value?.data?.data ?? results[0].value?.data ?? {}) : {},
          topPerformers: results[1].status === "fulfilled" ? (results[1].value?.data?.data ?? results[1].value?.data ?? []) : [],
          payrollSummary: results[2].status === "fulfilled" ? (results[2].value?.data?.data ?? results[2].value?.data ?? {}) : {},
          attendanceSummary: results[3].status === "fulfilled" ? (results[3].value?.data?.data ?? results[3].value?.data ?? []) : [],
        },
      };
    } catch (error) {
      console.error("Error fetching employee report:", error);
      throw error;
    }
  },

  getProductReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    try {
      const results = await Promise.allSettled([
        reportService.getTopProductsByRevenue(branchId, startDate, endDate, 10),
        reportService.getProductActivitySummary(branchId),
        reportService.getSalesByCategory(branchId, startDate, endDate),
      ]);

      return {
        data: {
          topByRevenue: results[0].status === "fulfilled" ? (results[0].value?.data?.data ?? results[0].value?.data ?? []) : [],
          activitySummary: results[1].status === "fulfilled" ? (results[1].value?.data?.data ?? results[1].value?.data ?? {}) : {},
          byCategory: results[2].status === "fulfilled" ? (results[2].value?.data?.data ?? results[2].value?.data ?? []) : [],
        },
      };
    } catch (error) {
      console.error("Error fetching product report:", error);
      throw error;
    }
  },

  getSupplierReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    try {
      const results = await Promise.allSettled([
        reportService.getPurchaseSummary(branchId, startDate, endDate),
        reportService.getTopSuppliers(branchId, startDate, endDate, 10),
        reportService.getSupplierPaymentSummary(branchId),
      ]);

      return {
        data: {
          purchaseSummary: results[0].status === "fulfilled" ? (results[0].value?.data?.data ?? results[0].value?.data ?? {}) : {},
          topSuppliers: results[1].status === "fulfilled" ? (results[1].value?.data?.data ?? results[1].value?.data ?? []) : [],
          paymentSummary: results[2].status === "fulfilled" ? (results[2].value?.data?.data ?? results[2].value?.data ?? []) : [],
        },
      };
    } catch (error) {
      console.error("Error fetching supplier report:", error);
      throw error;
    }
  },

  getExpiryReport: async (params) => {
    const { branchId } = params;
    try {
      const results = await Promise.allSettled([
        reportService.getExpiringStockReport(branchId, 30),
        reportService.getExpiredStockReport(branchId),
      ]);

      const expiringRaw = results[0].status === "fulfilled"
        ? (results[0].value?.data?.data?.content || results[0].value?.data?.data || results[0].value?.data || [])
        : [];
      const expiredRaw = results[1].status === "fulfilled"
        ? (results[1].value?.data?.data?.content || results[1].value?.data?.data || results[1].value?.data || [])
        : [];

      // Normalize dates from [y,m,d] arrays
      const normalizeItems = (items) =>
        Array.isArray(items)
          ? items.map((item) => {
              let expiryDateStr = item.expiryDate;
              if (Array.isArray(item.expiryDate) && item.expiryDate.length >= 3) {
                const [y, m, d] = item.expiryDate;
                expiryDateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              }
              return { ...item, expiryDate: expiryDateStr, daysLeft: item.daysToExpiry ?? item.daysLeft ?? 0 };
            })
          : [];

      const expiringItems = normalizeItems(expiringRaw);
      const expiredItems = normalizeItems(expiredRaw);

      return {
        data: {
          summary: { expiringCount: expiringItems.length, expiredCount: expiredItems.length },
          expiringItems,
          expiredItems,
        },
      };
    } catch (error) {
      console.error("Error fetching expiry report:", error);
      throw error;
    }
  },

  getPurchaseReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    try {
      const results = await Promise.allSettled([
        reportService.getPurchaseSummary(branchId, startDate, endDate),
        reportService.getPurchaseBySupplier(branchId, startDate, endDate),
      ]);

      return {
        data: {
          summary: results[0].status === "fulfilled" ? (results[0].value?.data?.data ?? results[0].value?.data ?? {}) : {},
          topSuppliers: results[1].status === "fulfilled" ? (results[1].value?.data?.data ?? results[1].value?.data ?? []) : [],
          dailyPurchases: [],
        },
      };
    } catch (error) {
      console.error("Error fetching purchase report:", error);
      throw error;
    }
  },

  getProfitLossReport: async (params) => {
    const { branchId, startDate, endDate } = params;
    try {
      return await reportService.getProfitLoss(branchId, startDate, endDate);
    } catch (error) {
      console.error("Error fetching profit/loss report:", error);
      throw error;
    }
  },
};

export default reportService;
