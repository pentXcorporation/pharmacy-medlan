/**
 * Dashboard Feature Barrel Export
 */

// Components - Widgets
export { default as SalesOverviewWidget } from "./components/SalesOverviewWidget";
export { default as InventoryAlertsWidget } from "./components/InventoryAlertsWidget";
export { default as RecentSalesWidget } from "./components/RecentSalesWidget";
export { default as QuickActionsWidget } from "./components/QuickActionsWidget";

// Components - Dashboard Router
export { default as DashboardRouter } from "./components/DashboardRouter";

// Components - Role-specific Dashboards
export {
  SuperAdminDashboard,
  AdminDashboard,
  CashierDashboard,
  PharmacistDashboard,
  AccountantDashboard,
  InventoryManagerDashboard,
} from "./components/dashboards";

// Hooks
export {
  useDashboardStats,
  useRecentSales,
  useLowStockAlerts,
  useExpiringProducts,
  useSalesChart,
} from "./hooks/useDashboard";
