/**
 * Reports Hooks
 * React Query hooks for report generation
 */

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services";

// Query keys factory
export const reportKeys = {
  all: ["reports"],
  sales: (params) => [...reportKeys.all, "sales", params],
  salesDashboard: (params) => [...reportKeys.all, "sales-dashboard", params],
  salesTrend: (params) => [...reportKeys.all, "sales-trend", params],
  salesMonthly: (params) => [...reportKeys.all, "sales-monthly", params],
  hourlySales: (params) => [...reportKeys.all, "hourly-sales", params],
  salesByDayOfWeek: (params) => [...reportKeys.all, "sales-day-of-week", params],
  topCustomers: (params) => [...reportKeys.all, "top-customers", params],
  customerFrequency: (params) => [...reportKeys.all, "customer-frequency", params],
  newVsReturning: (params) => [...reportKeys.all, "new-vs-returning", params],
  returnsSummary: (params) => [...reportKeys.all, "returns-summary", params],
  discountAnalysis: (params) => [...reportKeys.all, "discount-analysis", params],
  inventory: (params) => [...reportKeys.all, "inventory", params],
  inventoryHealth: (params) => [...reportKeys.all, "inventory-health", params],
  financial: (params) => [...reportKeys.all, "financial", params],
  purchase: (params) => [...reportKeys.all, "purchase", params],
  expiry: (params) => [...reportKeys.all, "expiry", params],
  profitLoss: (params) => [...reportKeys.all, "profit-loss", params],
  products: (params) => [...reportKeys.all, "products", params],
  productTopByRevenue: (params) => [...reportKeys.all, "product-top-revenue", params],
  productTopByQuantity: (params) => [...reportKeys.all, "product-top-quantity", params],
  productMargins: (params) => [...reportKeys.all, "product-margins", params],
  productByCategory: (params) => [...reportKeys.all, "product-by-category", params],
  productActivity: (params) => [...reportKeys.all, "product-activity", params],
  productSlowest: (params) => [...reportKeys.all, "product-slowest", params],
  productNeverSold: (params) => [...reportKeys.all, "product-never-sold", params],
  productBatch: (params) => [...reportKeys.all, "product-batch", params],
  employees: (params) => [...reportKeys.all, "employees", params],
  employeeHeadcount: (params) => [...reportKeys.all, "employee-headcount", params],
  employeeAttendance: (params) => [...reportKeys.all, "employee-attendance", params],
  employeePayroll: (params) => [...reportKeys.all, "employee-payroll", params],
  employeePayrollBreakdown: (params) => [...reportKeys.all, "employee-payroll-breakdown", params],
  employeePerformance: (params) => [...reportKeys.all, "employee-performance", params],
  employeeTenure: (params) => [...reportKeys.all, "employee-tenure", params],
  employeeSalaryDist: (params) => [...reportKeys.all, "employee-salary-dist", params],
  suppliers: (params) => [...reportKeys.all, "suppliers", params],
  supplierPurchaseSummary: (params) => [...reportKeys.all, "supplier-purchase-summary", params],
  supplierTopSuppliers: (params) => [...reportKeys.all, "supplier-top", params],
  supplierPayment: (params) => [...reportKeys.all, "supplier-payment", params],
  supplierPayablesAgeing: (params) => [...reportKeys.all, "supplier-payables-ageing", params],
  supplierOverdue: (params) => [...reportKeys.all, "supplier-overdue", params],
  supplierDelivery: (params) => [...reportKeys.all, "supplier-delivery", params],
};

// Helper to extract data from response
const extractData = (response) => response?.data?.data ?? response?.data ?? response;

// ============================
// SALES HOOKS
// ============================

export const useSalesReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.sales(params),
    queryFn: () => reportService.getSalesReport(params),
    select: (response) => response?.data || response,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useSalesDashboard = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.salesDashboard(params),
    queryFn: () => reportService.getSalesDashboard(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useSalesTrend = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.salesTrend(params),
    queryFn: () => reportService.getSalesTrend(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useMonthlySales = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.salesMonthly(params),
    queryFn: () => reportService.getMonthlySales(params.branchId, params.months),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

export const useHourlySales = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.hourlySales(params),
    queryFn: () => reportService.getHourlySales(params.branchId, params.date),
    select: extractData,
    enabled: Boolean(params.branchId && params.date),
    retry: 1,
    ...options,
  });

export const useSalesByDayOfWeek = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.salesByDayOfWeek(params),
    queryFn: () => reportService.getSalesByDayOfWeek(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useTopCustomers = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.topCustomers(params),
    queryFn: () => reportService.getTopCustomers(params.branchId, params.startDate, params.endDate, params.limit),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useReturnsSummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.returnsSummary(params),
    queryFn: () => reportService.getReturnsSummary(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useDiscountAnalysis = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.discountAnalysis(params),
    queryFn: () => reportService.getDiscountAnalysis(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

// ============================
// INVENTORY HOOKS
// ============================

export const useInventoryReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.inventory(params),
    queryFn: () => reportService.getInventoryReport(params),
    select: (response) => response?.data || response,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

export const useInventoryHealthDashboard = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.inventoryHealth(params),
    queryFn: () => reportService.getInventoryHealthDashboard(params.branchId),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

// ============================
// FINANCIAL HOOKS
// ============================

export const useFinancialReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.financial(params),
    queryFn: () => reportService.getFinancialReport(params),
    select: (response) => response?.data || response,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const usePurchaseReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.purchase(params),
    queryFn: () => reportService.getPurchaseReport(params),
    select: (response) => response?.data || response,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    ...options,
  });

export const useExpiryReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.expiry(params),
    queryFn: () => reportService.getExpiryReport(params),
    select: (response) => response?.data || response,
    enabled: Boolean(params.branchId),
    ...options,
  });

export const useProfitLossReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.profitLoss(params),
    queryFn: () => reportService.getProfitLossReport(params),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    ...options,
  });

// ============================
// PRODUCT REPORT HOOKS
// ============================

export const useProductReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.products(params),
    queryFn: () => reportService.getProductReport(params),
    select: (response) => response?.data || response,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useTopProductsByRevenue = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.productTopByRevenue(params),
    queryFn: () => reportService.getTopProductsByRevenue(params.branchId, params.startDate, params.endDate, params.limit),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useTopProductsByQuantity = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.productTopByQuantity(params),
    queryFn: () => reportService.getTopProductsByQuantity(params.branchId, params.startDate, params.endDate, params.limit),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useProductMargins = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.productMargins(params),
    queryFn: () => reportService.getHighestMarginProducts(params.branchId, params.startDate, params.endDate, params.limit || 20),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useProductByCategory = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.productByCategory(params),
    queryFn: () => reportService.getSalesByCategory(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useProductActivitySummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.productActivity(params),
    queryFn: () => reportService.getProductActivitySummary(params.branchId),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

export const useSlowestMovingProducts = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.productSlowest(params),
    queryFn: () => reportService.getSlowestMovingProducts(params.branchId, params.startDate, params.endDate, params.limit || 20),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useNeverSoldProducts = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.productNeverSold(params),
    queryFn: () => reportService.getNeverSoldProducts(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

// ============================
// EMPLOYEE REPORT HOOKS
// ============================

export const useEmployeeReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.employees(params),
    queryFn: () => reportService.getEmployeeReport(params),
    select: (response) => response?.data || response,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useHeadcountSummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.employeeHeadcount(params),
    queryFn: () => reportService.getHeadcountSummary(params.branchId),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

export const useAttendanceSummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.employeeAttendance(params),
    queryFn: () => reportService.getAttendanceSummary(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const usePayrollSummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.employeePayroll(params),
    queryFn: () => reportService.getPayrollSummary(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const usePayrollBreakdown = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.employeePayrollBreakdown(params),
    queryFn: () => reportService.getPayrollBreakdown(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useTopPerformers = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.employeePerformance(params),
    queryFn: () => reportService.getTopPerformers(params.branchId, params.startDate, params.endDate, params.limit || 10),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useEmployeeTenure = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.employeeTenure(params),
    queryFn: () => reportService.getEmployeeTenure(params.branchId),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

export const useSalaryDistribution = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.employeeSalaryDist(params),
    queryFn: () => reportService.getSalaryDistribution(params.branchId),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

// ============================
// SUPPLIER REPORT HOOKS
// ============================

export const useSupplierReport = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.suppliers(params),
    queryFn: () => reportService.getSupplierReport(params),
    select: (response) => response?.data || response,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useSupplierPurchaseSummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.supplierPurchaseSummary(params),
    queryFn: () => reportService.getPurchaseSummary(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useTopSuppliers = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.supplierTopSuppliers(params),
    queryFn: () => reportService.getTopSuppliers(params.branchId, params.startDate, params.endDate, params.limit || 10),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });

export const useSupplierPaymentSummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.supplierPayment(params),
    queryFn: () => reportService.getSupplierPaymentSummary(params.branchId),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

export const useSupplierPayablesAgeing = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.supplierPayablesAgeing(params),
    queryFn: () => reportService.getSupplierPayablesAgeing(params.branchId),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

export const useOverdueSupplierPayments = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.supplierOverdue(params),
    queryFn: () => reportService.getOverdueSupplierPayments(params.branchId),
    select: extractData,
    enabled: Boolean(params.branchId),
    retry: 1,
    ...options,
  });

export const useSupplierDeliveryPerformance = (params = {}, options = {}) =>
  useQuery({
    queryKey: reportKeys.supplierDelivery(params),
    queryFn: () => reportService.getSupplierDeliveryPerformance(params.branchId, params.startDate, params.endDate),
    select: extractData,
    enabled: Boolean(params.branchId && params.startDate && params.endDate),
    retry: 1,
    ...options,
  });
