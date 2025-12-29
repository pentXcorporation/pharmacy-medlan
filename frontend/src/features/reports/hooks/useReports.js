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
  inventory: (params) => [...reportKeys.all, "inventory", params],
  financial: (params) => [...reportKeys.all, "financial", params],
  purchase: (params) => [...reportKeys.all, "purchase", params],
  expiry: (params) => [...reportKeys.all, "expiry", params],
  profitLoss: (params) => [...reportKeys.all, "profit-loss", params],
};

/**
 * Hook to fetch sales report
 */
export const useSalesReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: reportKeys.sales(params),
    queryFn: () => reportService.getSalesReport(params),
    enabled: Boolean(params.startDate && params.endDate),
    ...options,
  });
};

/**
 * Hook to fetch inventory report
 */
export const useInventoryReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: reportKeys.inventory(params),
    queryFn: () => reportService.getInventoryReport(params),
    ...options,
  });
};

/**
 * Hook to fetch financial report
 */
export const useFinancialReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: reportKeys.financial(params),
    queryFn: () => reportService.getFinancialReport(params),
    enabled: Boolean(params.startDate && params.endDate),
    ...options,
  });
};

/**
 * Hook to fetch purchase report
 */
export const usePurchaseReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: reportKeys.purchase(params),
    queryFn: () =>
      reportService.getPurchaseReport?.(params) || Promise.resolve(null),
    enabled: Boolean(params.startDate && params.endDate),
    ...options,
  });
};

/**
 * Hook to fetch expiry report
 */
export const useExpiryReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: reportKeys.expiry(params),
    queryFn: () =>
      reportService.getExpiryReport?.(params) || Promise.resolve(null),
    ...options,
  });
};

/**
 * Hook to fetch profit/loss report
 */
export const useProfitLossReport = (params = {}, options = {}) => {
  return useQuery({
    queryKey: reportKeys.profitLoss(params),
    queryFn: () =>
      reportService.getProfitLossReport?.(params) || Promise.resolve(null),
    enabled: Boolean(params.startDate && params.endDate),
    ...options,
  });
};
