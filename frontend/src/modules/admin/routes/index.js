import { lazy } from 'react';

// Lazy load admin pages
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const UsersPage = lazy(() => import('../pages/UsersPage'));
const RolesPage = lazy(() => import('../pages/RolesPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AuditLogsPage = lazy(() => import('../pages/AuditLogsPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));

/**
 * Admin Module Routes
 * Routes configuration for admin module
 */
export const adminRoutes = [
  {
    path: 'admin',
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'roles',
        element: <RolesPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
    ],
  },
];

export default adminRoutes;
