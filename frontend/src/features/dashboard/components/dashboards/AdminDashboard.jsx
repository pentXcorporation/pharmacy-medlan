/**
 * AdminDashboard Component
 * Dashboard for SUPER_ADMIN, ADMIN, and BRANCH_MANAGER roles
 * Full overview of business operations
 */

import { PageHeader } from "@/components/common";
import {
  SalesOverviewWidget,
  InventoryAlertsWidget,
  RecentSalesWidget,
  QuickActionsWidget,
} from "@/features/dashboard";
import {
  useDashboardStats,
  useRecentSales,
  useLowStockAlerts,
  useExpiringProducts,
} from "@/features/dashboard";
import { useAuth, usePermissions } from "@/hooks";

/**
 * Admin Dashboard - Full business overview
 */
const AdminDashboard = () => {
  const { displayName } = useAuth();
  const { isOwnerOrAbove } = usePermissions();

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentSales, isLoading: salesLoading } = useRecentSales(10);
  const { data: lowStock, isLoading: lowStockLoading } = useLowStockAlerts(10);
  const { data: expiring, isLoading: expiringLoading } = useExpiringProducts(30, 10);

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
        title={`${getGreeting()}, ${displayName || "Admin"}!`}
        description="Here's your business overview for today."
      />

      {/* Sales Overview */}
      <SalesOverviewWidget data={stats} isLoading={statsLoading} />

      {/* Quick Actions - Admin specific */}
      <QuickActionsWidget variant="admin" />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Sales - 2 columns */}
        <div className="lg:col-span-2">
          <RecentSalesWidget
            sales={recentSales?.content || []}
            isLoading={salesLoading}
          />
        </div>

        {/* Inventory Alerts - 1 column */}
        <div>
          <InventoryAlertsWidget
            lowStockItems={lowStock?.content || []}
            expiringItems={expiring?.content || []}
            isLoading={lowStockLoading || expiringLoading}
          />
        </div>
      </div>

      {/* Super Admin / Owner specific sections */}
      {isOwnerOrAbove && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for branch performance, staff stats, etc. */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Branch Performance</h3>
            <p className="text-sm text-muted-foreground">
              Multi-branch analytics coming soon...
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Staff Activity</h3>
            <p className="text-sm text-muted-foreground">
              Employee performance metrics coming soon...
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">System Health</h3>
            <p className="text-sm text-muted-foreground">
              System monitoring coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
