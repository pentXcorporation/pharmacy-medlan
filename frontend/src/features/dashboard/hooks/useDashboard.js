/**
 * useDashboard Hook
 * Fetches dashboard data based on user role
 */

import { useApiQuery } from '@/hooks';
import { usePermissions } from '@/hooks';
import { useBranchStore } from '@/store';
import { API_ENDPOINTS } from '@/config';

/**
 * Dashboard stats query hook
 */
export const useDashboardStats = () => {
  const { selectedBranch } = useBranchStore();
  const { isSuperAdmin, isOwnerOrAbove } = usePermissions();

  // Use branch-specific or global endpoint based on role
  const endpoint = isOwnerOrAbove
    ? API_ENDPOINTS.DASHBOARD.STATS
    : `${API_ENDPOINTS.DASHBOARD.STATS}?branchId=${selectedBranch?.id}`;

  return useApiQuery(['dashboard-stats', selectedBranch?.id], endpoint, {
    enabled: !!selectedBranch?.id || isOwnerOrAbove,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Recent sales query hook
 */
export const useRecentSales = (limit = 10) => {
  const { selectedBranch } = useBranchStore();

  return useApiQuery(
    ['recent-sales', selectedBranch?.id, limit],
    API_ENDPOINTS.SALES.LIST,
    {
      params: {
        branchId: selectedBranch?.id,
        size: limit,
        sort: 'createdAt,desc',
      },
      enabled: !!selectedBranch?.id,
    }
  );
};

/**
 * Low stock alerts query hook
 */
export const useLowStockAlerts = (limit = 10) => {
  const { selectedBranch } = useBranchStore();

  return useApiQuery(
    ['low-stock', selectedBranch?.id, limit],
    API_ENDPOINTS.INVENTORY.LOW_STOCK,
    {
      params: {
        branchId: selectedBranch?.id,
        size: limit,
      },
      enabled: !!selectedBranch?.id,
    }
  );
};

/**
 * Expiring products query hook
 */
export const useExpiringProducts = (days = 30, limit = 10) => {
  const { selectedBranch } = useBranchStore();

  return useApiQuery(
    ['expiring-products', selectedBranch?.id, days, limit],
    API_ENDPOINTS.INVENTORY.EXPIRING,
    {
      params: {
        branchId: selectedBranch?.id,
        days,
        size: limit,
      },
      enabled: !!selectedBranch?.id,
    }
  );
};

/**
 * Sales chart data hook
 */
export const useSalesChart = (period = 'week') => {
  const { selectedBranch } = useBranchStore();

  return useApiQuery(
    ['sales-chart', selectedBranch?.id, period],
    `${API_ENDPOINTS.DASHBOARD.STATS}/sales-chart`,
    {
      params: {
        branchId: selectedBranch?.id,
        period,
      },
      enabled: !!selectedBranch?.id,
    }
  );
};

export default useDashboardStats;
