import { lazy } from 'react';

// Lazy load all branch manager pages
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StaffPage = lazy(() => import('../pages/StaffPage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const SchedulePage = lazy(() => import('../pages/SchedulePage'));

/**
 * Branch Manager routes configuration
 * All routes are lazy-loaded for optimal performance
 */
export const branchManagerRoutes = [
  {
    path: 'dashboard',
    element: DashboardPage,
    index: true,
  },
  {
    path: 'staff',
    element: StaffPage,
  },
  {
    path: 'inventory',
    element: InventoryPage,
  },
  {
    path: 'reports',
    element: ReportsPage,
  },
  {
    path: 'schedule',
    element: SchedulePage,
  },
];

/**
 * Branch Manager navigation items for sidebar
 */
export const branchManagerNavItems = [
  {
    path: '/branch-manager/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    path: '/branch-manager/staff',
    label: 'Staff Management',
    icon: 'users',
  },
  {
    path: '/branch-manager/schedule',
    label: 'Scheduling',
    icon: 'calendar',
  },
  {
    path: '/branch-manager/inventory',
    label: 'Inventory',
    icon: 'inventory',
  },
  {
    path: '/branch-manager/reports',
    label: 'Reports',
    icon: 'chart',
  },
];

export default branchManagerRoutes;
