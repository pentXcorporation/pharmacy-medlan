/**
 * useDashboard Hook
 * Fetches dashboard data based on user role
 */

import { useApiQuery } from "@/hooks";
import { usePermissions } from "@/hooks";
import { useBranchStore } from "@/store";
import { API_ENDPOINTS } from "@/config";

/**
 * Dashboard stats query hook
 */
export const useDashboardStats = () => {
  const { selectedBranch } = useBranchStore();

  return useApiQuery(
    ["dashboard-stats", selectedBranch?.id],
    API_ENDPOINTS.DASHBOARD.STATS,
    {
      params: {
        branchId: selectedBranch?.id,
      },
      enabled: !!selectedBranch?.id,
      staleTime: 60 * 1000, // 1 minute
    }
  );
};

/**
 * Recent sales query hook
 */
export const useRecentSales = (limit = 10) => {
  const { selectedBranch } = useBranchStore();

  return useApiQuery(
    ["recent-sales", selectedBranch?.id, limit],
    selectedBranch?.id
      ? API_ENDPOINTS.SALES.BY_BRANCH(selectedBranch.id)
      : null,
    {
      params: {
        size: limit,
        sort: "createdAt,desc",
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
    ["low-stock", selectedBranch?.id, limit],
    selectedBranch?.id
      ? API_ENDPOINTS.INVENTORY.LOW_STOCK(selectedBranch.id)
      : null,
    {
      params: {
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

  // Calculate alert date (today + days)
  const alertDate = new Date();
  alertDate.setDate(alertDate.getDate() + days);
  const alertDateStr = alertDate.toISOString().split("T")[0];

  return useApiQuery(
    ["expiring-products", selectedBranch?.id, days, limit],
    selectedBranch?.id
      ? API_ENDPOINTS.INVENTORY.EXPIRING(selectedBranch.id)
      : null,
    {
      params: {
        alertDate: alertDateStr,
      },
      enabled: !!selectedBranch?.id,
    }
  );
};

/**
 * Sales chart data hook
 */
export const useSalesChart = (period = "week") => {
  const { selectedBranch } = useBranchStore();

  return useApiQuery(
    ["sales-chart", selectedBranch?.id, period],
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
