import { useQuery } from '@tanstack/react-query';
import {
  getSuperAdminDashboard,
  getSystemMetrics,
  getBranchAnalytics,
  getBusinessMetrics,
  getInventoryOverview,
  getUserStatistics,
  getFinancialSummary,
  getRecentActivities,
} from '@/services/superAdminDashboardService';

/**
 * Hook to fetch complete super admin dashboard data
 * @param {object} options - React Query options
 */
export const useSuperAdminDashboard = (options = {}) => {
  return useQuery({
    queryKey: ['superAdminDashboard'],
    queryFn: getSuperAdminDashboard,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds for real-time updates
    ...options,
  });
};

/**
 * Hook to fetch system metrics
 * @param {object} options - React Query options
 */
export const useSystemMetrics = (options = {}) => {
  return useQuery({
    queryKey: ['systemMetrics'],
    queryFn: getSystemMetrics,
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
};

/**
 * Hook to fetch branch analytics
 * @param {object} options - React Query options
 */
export const useBranchAnalytics = (options = {}) => {
  return useQuery({
    queryKey: ['branchAnalytics'],
    queryFn: getBranchAnalytics,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
    ...options,
  });
};

/**
 * Hook to fetch business metrics
 * @param {object} options - React Query options
 */
export const useBusinessMetrics = (options = {}) => {
  return useQuery({
    queryKey: ['businessMetrics'],
    queryFn: getBusinessMetrics,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
    ...options,
  });
};

/**
 * Hook to fetch inventory overview
 * @param {object} options - React Query options
 */
export const useInventoryOverview = (options = {}) => {
  return useQuery({
    queryKey: ['inventoryOverview'],
    queryFn: getInventoryOverview,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
    ...options,
  });
};

/**
 * Hook to fetch user statistics
 * @param {object} options - React Query options
 */
export const useUserStatistics = (options = {}) => {
  return useQuery({
    queryKey: ['userStatistics'],
    queryFn: getUserStatistics,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
    ...options,
  });
};

/**
 * Hook to fetch financial summary
 * @param {object} options - React Query options
 */
export const useFinancialSummary = (options = {}) => {
  return useQuery({
    queryKey: ['financialSummary'],
    queryFn: getFinancialSummary,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
    ...options,
  });
};

/**
 * Hook to fetch recent activities
 * @param {number} limit - Number of activities to fetch
 * @param {object} options - React Query options
 */
export const useRecentActivities = (limit = 10, options = {}) => {
  return useQuery({
    queryKey: ['recentActivities', limit],
    queryFn: () => getRecentActivities(limit),
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
};
