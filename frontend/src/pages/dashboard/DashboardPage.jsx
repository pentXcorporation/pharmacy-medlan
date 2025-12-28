/**
 * DashboardPage Component
 * Main dashboard with role-aware widgets
 */

import { useAuth, usePermissions } from "@/hooks";
import { PageHeader } from "@/components/common";
import {
  SalesOverviewWidget,
  InventoryAlertsWidget,
  RecentSalesWidget,
  QuickActionsWidget,
  useDashboardStats,
  useRecentSales,
  useLowStockAlerts,
  useExpiringProducts,
} from "@/features/dashboard";

/**
 * DashboardPage component
 */
const DashboardPage = () => {
  const { displayName, user } = useAuth();
  const {
    canAccessPOS,
    canAccessInventory,
    canAccessFinance,
    isBranchAdminOrAbove,
  } = usePermissions();

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentSales, isLoading: salesLoading } = useRecentSales(10);
  const { data: lowStock, isLoading: lowStockLoading } = useLowStockAlerts(10);
  const { data: expiring, isLoading: expiringLoading } = useExpiringProducts(
    30,
    10
  );

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${getGreeting()}, ${displayName || "User"}!`}
        description="Here's what's happening at your pharmacy today."
      />

      {/* Sales Overview - visible to those with finance or POS access */}
      {(canAccessPOS || canAccessFinance) && (
        <SalesOverviewWidget data={stats} isLoading={statsLoading} />
      )}

      {/* Quick Actions */}
      <QuickActionsWidget />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Sales - 2 columns */}
        {canAccessPOS && (
          <div className="lg:col-span-2">
            <RecentSalesWidget
              sales={recentSales?.content || []}
              isLoading={salesLoading}
            />
          </div>
        )}

        {/* Inventory Alerts - 1 column or full width if no POS access */}
        {canAccessInventory && (
          <div className={!canAccessPOS ? "lg:col-span-3" : ""}>
            <div className="space-y-4">
              <InventoryAlertsWidget
                lowStockItems={lowStock?.content || []}
                expiringItems={expiring?.content || []}
                isLoading={lowStockLoading || expiringLoading}
              />
            </div>
          </div>
        )}
      </div>

      {/* Additional widgets for branch admin+ */}
      {isBranchAdminOrAbove && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for additional widgets */}
          {/* Top Selling Products, Staff Performance, etc. */}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
