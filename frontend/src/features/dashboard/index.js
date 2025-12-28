/**
 * Dashboard Feature Barrel Export
 */

// Components
export { default as SalesOverviewWidget } from './components/SalesOverviewWidget';
export { default as InventoryAlertsWidget } from './components/InventoryAlertsWidget';
export { default as RecentSalesWidget } from './components/RecentSalesWidget';
export { default as QuickActionsWidget } from './components/QuickActionsWidget';

// Hooks
export {
  useDashboardStats,
  useRecentSales,
  useLowStockAlerts,
  useExpiringProducts,
  useSalesChart,
} from './hooks/useDashboard';
