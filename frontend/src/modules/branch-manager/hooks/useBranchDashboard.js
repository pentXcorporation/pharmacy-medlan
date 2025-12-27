import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchDashboardService } from '../services';

/**
 * Branch Dashboard Hooks
 */

// Query keys
const BRANCH_KEYS = {
  all: ['branch'],
  overview: () => [...BRANCH_KEYS.all, 'overview'],
  metrics: () => [...BRANCH_KEYS.all, 'metrics', 'today'],
  salesSummary: (start, end) => [...BRANCH_KEYS.all, 'sales', 'summary', start, end],
  topProducts: (limit, period) => [...BRANCH_KEYS.all, 'products', 'top', limit, period],
  salesTrend: (period) => [...BRANCH_KEYS.all, 'sales', 'trend', period],
  inventoryAlerts: () => [...BRANCH_KEYS.all, 'inventory', 'alerts'],
  activities: (limit) => [...BRANCH_KEYS.all, 'activities', limit],
  info: () => [...BRANCH_KEYS.all, 'info'],
};

/**
 * Hook to get branch overview
 */
export const useBranchOverview = () => {
  return useQuery({
    queryKey: BRANCH_KEYS.overview(),
    queryFn: branchDashboardService.getOverview,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to get today's metrics
 */
export const useTodayMetrics = () => {
  return useQuery({
    queryKey: BRANCH_KEYS.metrics(),
    queryFn: branchDashboardService.getTodayMetrics,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};

/**
 * Hook to get sales summary
 */
export const useSalesSummary = (startDate, endDate) => {
  return useQuery({
    queryKey: BRANCH_KEYS.salesSummary(startDate, endDate),
    queryFn: () => branchDashboardService.getSalesSummary(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

/**
 * Hook to get top selling products
 */
export const useTopProducts = (limit = 10, period = 'week') => {
  return useQuery({
    queryKey: BRANCH_KEYS.topProducts(limit, period),
    queryFn: () => branchDashboardService.getTopProducts(limit, period),
  });
};

/**
 * Hook to get sales trend data
 */
export const useSalesTrend = (period = 'week') => {
  return useQuery({
    queryKey: BRANCH_KEYS.salesTrend(period),
    queryFn: () => branchDashboardService.getSalesTrend(period),
  });
};

/**
 * Hook to get inventory alerts
 */
export const useInventoryAlerts = () => {
  return useQuery({
    queryKey: BRANCH_KEYS.inventoryAlerts(),
    queryFn: branchDashboardService.getInventoryAlerts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get recent activities
 */
export const useRecentActivities = (limit = 20) => {
  return useQuery({
    queryKey: BRANCH_KEYS.activities(limit),
    queryFn: () => branchDashboardService.getRecentActivities(limit),
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook to get branch information
 */
export const useBranchInfo = () => {
  return useQuery({
    queryKey: BRANCH_KEYS.info(),
    queryFn: branchDashboardService.getBranchInfo,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to update branch settings
 */
export const useUpdateBranchSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchDashboardService.updateBranchSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.info() });
    },
  });
};
