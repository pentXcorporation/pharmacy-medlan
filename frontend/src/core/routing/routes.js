import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

// Import route configurations from modules
import { adminRoutes } from '@/modules/admin/routes';
import { pharmacistRoutes } from '@/modules/pharmacist/routes';
import { employeeRoutes, employeeNavItems } from '@/modules/employee/routes';
import { branchManagerRoutes, branchManagerNavItems } from '@/modules/branch-manager/routes';

// Lazy load existing pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const POSPage = lazy(() => import('@/pages/POSPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const InventoryPage = lazy(() => import('@/pages/InventoryPage'));
const CustomersPage = lazy(() => import('@/pages/CustomersPage'));
const SuppliersPage = lazy(() => import('@/pages/SuppliersPage'));
const BranchesPage = lazy(() => import('@/pages/BranchesPage'));
const PurchaseOrdersPage = lazy(() => import('@/pages/PurchaseOrdersPage'));
const GRNPage = lazy(() => import('@/pages/GRNPage'));
const SalesPage = lazy(() => import('@/pages/SalesPage'));
const SaleReturnsPage = lazy(() => import('@/pages/SaleReturnsPage'));
const UsersPage = lazy(() => import('@/pages/UsersPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const StockTransferPage = lazy(() => import('@/pages/StockTransferPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

// Lazy load module pages
const AdminDashboardPage = lazy(() => import('@/modules/admin/pages/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@/modules/admin/pages/UsersPage'));
const AdminRolesPage = lazy(() => import('@/modules/admin/pages/RolesPage'));
const AdminSettingsPage = lazy(() => import('@/modules/admin/pages/SettingsPage'));
const AdminAuditLogsPage = lazy(() => import('@/modules/admin/pages/AuditLogsPage'));
const AdminAnalyticsPage = lazy(() => import('@/modules/admin/pages/AnalyticsPage'));

// Employee Module Pages
const EmployeeDashboardPage = lazy(() => import('@/modules/employee/pages/DashboardPage'));
const EmployeeTasksPage = lazy(() => import('@/modules/employee/pages/TasksPage'));
const EmployeeAttendancePage = lazy(() => import('@/modules/employee/pages/AttendancePage'));
const EmployeeLeavePage = lazy(() => import('@/modules/employee/pages/LeavePage'));
const EmployeeProfilePage = lazy(() => import('@/modules/employee/pages/ProfilePage'));

// Branch Manager Module Pages
const BranchManagerDashboardPage = lazy(() => import('@/modules/branch-manager/pages/DashboardPage'));
const BranchManagerStaffPage = lazy(() => import('@/modules/branch-manager/pages/StaffPage'));
const BranchManagerInventoryPage = lazy(() => import('@/modules/branch-manager/pages/InventoryPage'));
const BranchManagerReportsPage = lazy(() => import('@/modules/branch-manager/pages/ReportsPage'));
const BranchManagerSchedulePage = lazy(() => import('@/modules/branch-manager/pages/SchedulePage'));

/**
 * Loading fallback for lazy-loaded routes
 */
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
  }}>
    <div className="loading-spinner" />
  </div>
);

/**
 * Wrap component with Suspense
 */
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

/**
 * Public routes (no authentication required)
 */
export const publicRoutes = [
  {
    path: '/login',
    element: withSuspense(LoginPage),
    meta: {
      title: 'Login',
      requiresAuth: false,
    },
  },
];

/**
 * Main application routes (authenticated)
 */
export const mainRoutes = [
  {
    path: '/',
    element: withSuspense(DashboardPage),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
  {
    path: '/pos',
    element: withSuspense(POSPage),
    meta: {
      title: 'Point of Sale',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'CASHIER'],
    },
  },
  {
    path: '/products',
    element: withSuspense(ProductsPage),
    meta: {
      title: 'Products',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER'],
    },
  },
  {
    path: '/categories',
    element: withSuspense(CategoriesPage),
    meta: {
      title: 'Categories',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER'],
    },
  },
  {
    path: '/inventory',
    element: withSuspense(InventoryPage),
    meta: {
      title: 'Inventory',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'INVENTORY_MANAGER'],
    },
  },
  {
    path: '/purchase-orders',
    element: withSuspense(PurchaseOrdersPage),
    meta: {
      title: 'Purchase Orders',
      requiresAuth: true,
      roles: ['ADMIN', 'INVENTORY_MANAGER'],
    },
  },
  {
    path: '/grn',
    element: withSuspense(GRNPage),
    meta: {
      title: 'Goods Received Notes',
      requiresAuth: true,
      roles: ['ADMIN', 'INVENTORY_MANAGER'],
    },
  },
  {
    path: '/sales',
    element: withSuspense(SalesPage),
    meta: {
      title: 'Sales',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'CASHIER'],
    },
  },
  {
    path: '/sale-returns',
    element: withSuspense(SaleReturnsPage),
    meta: {
      title: 'Sale Returns',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'CASHIER'],
    },
  },
  {
    path: '/customers',
    element: withSuspense(CustomersPage),
    meta: {
      title: 'Customers',
      requiresAuth: true,
      roles: ['ADMIN', 'PHARMACIST', 'CASHIER'],
    },
  },
  {
    path: '/suppliers',
    element: withSuspense(SuppliersPage),
    meta: {
      title: 'Suppliers',
      requiresAuth: true,
      roles: ['ADMIN', 'INVENTORY_MANAGER'],
    },
  },
  {
    path: '/users',
    element: withSuspense(UsersPage),
    meta: {
      title: 'Users',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/branches',
    element: withSuspense(BranchesPage),
    meta: {
      title: 'Branches',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/reports',
    element: withSuspense(ReportsPage),
    meta: {
      title: 'Reports',
      requiresAuth: true,
      roles: ['ADMIN', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/stock-transfer',
    element: withSuspense(StockTransferPage),
    meta: {
      title: 'Stock Transfer',
      requiresAuth: true,
      roles: ['ADMIN', 'BRANCH_MANAGER', 'INVENTORY_MANAGER'],
    },
  },
];

/**
 * Admin module routes
 */
export const adminModuleRoutes = [
  {
    path: '/admin',
    element: withSuspense(AdminDashboardPage),
    meta: {
      title: 'Admin Dashboard',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/admin/dashboard',
    element: withSuspense(AdminDashboardPage),
    meta: {
      title: 'Admin Dashboard',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/admin/users',
    element: withSuspense(AdminUsersPage),
    meta: {
      title: 'User Management',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/admin/roles',
    element: withSuspense(AdminRolesPage),
    meta: {
      title: 'Role Management',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/admin/settings',
    element: withSuspense(AdminSettingsPage),
    meta: {
      title: 'System Settings',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/admin/audit-logs',
    element: withSuspense(AdminAuditLogsPage),
    meta: {
      title: 'Audit Logs',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
  {
    path: '/admin/analytics',
    element: withSuspense(AdminAnalyticsPage),
    meta: {
      title: 'Analytics',
      requiresAuth: true,
      roles: ['ADMIN'],
    },
  },
];

/**
 * Employee module routes
 */
export const employeeModuleRoutes = [
  {
    path: '/employee',
    element: withSuspense(EmployeeDashboardPage),
    meta: {
      title: 'Employee Dashboard',
      requiresAuth: true,
      roles: ['ADMIN', 'EMPLOYEE', 'PHARMACIST', 'CASHIER', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/employee/dashboard',
    element: withSuspense(EmployeeDashboardPage),
    meta: {
      title: 'Employee Dashboard',
      requiresAuth: true,
      roles: ['ADMIN', 'EMPLOYEE', 'PHARMACIST', 'CASHIER', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/employee/tasks',
    element: withSuspense(EmployeeTasksPage),
    meta: {
      title: 'My Tasks',
      requiresAuth: true,
      roles: ['ADMIN', 'EMPLOYEE', 'PHARMACIST', 'CASHIER', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/employee/attendance',
    element: withSuspense(EmployeeAttendancePage),
    meta: {
      title: 'Attendance',
      requiresAuth: true,
      roles: ['ADMIN', 'EMPLOYEE', 'PHARMACIST', 'CASHIER', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/employee/leave',
    element: withSuspense(EmployeeLeavePage),
    meta: {
      title: 'Leave Management',
      requiresAuth: true,
      roles: ['ADMIN', 'EMPLOYEE', 'PHARMACIST', 'CASHIER', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/employee/profile',
    element: withSuspense(EmployeeProfilePage),
    meta: {
      title: 'My Profile',
      requiresAuth: true,
      roles: ['ADMIN', 'EMPLOYEE', 'PHARMACIST', 'CASHIER', 'BRANCH_MANAGER'],
    },
  },
];

/**
 * Branch Manager module routes
 */
export const branchManagerModuleRoutes = [
  {
    path: '/branch-manager',
    element: withSuspense(BranchManagerDashboardPage),
    meta: {
      title: 'Branch Dashboard',
      requiresAuth: true,
      roles: ['ADMIN', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/branch-manager/dashboard',
    element: withSuspense(BranchManagerDashboardPage),
    meta: {
      title: 'Branch Dashboard',
      requiresAuth: true,
      roles: ['ADMIN', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/branch-manager/staff',
    element: withSuspense(BranchManagerStaffPage),
    meta: {
      title: 'Staff Management',
      requiresAuth: true,
      roles: ['ADMIN', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/branch-manager/schedule',
    element: withSuspense(BranchManagerSchedulePage),
    meta: {
      title: 'Staff Scheduling',
      requiresAuth: true,
      roles: ['ADMIN', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/branch-manager/inventory',
    element: withSuspense(BranchManagerInventoryPage),
    meta: {
      title: 'Branch Inventory',
      requiresAuth: true,
      roles: ['ADMIN', 'BRANCH_MANAGER'],
    },
  },
  {
    path: '/branch-manager/reports',
    element: withSuspense(BranchManagerReportsPage),
    meta: {
      title: 'Branch Reports',
      requiresAuth: true,
      roles: ['ADMIN', 'BRANCH_MANAGER'],
    },
  },
];

/**
 * All protected routes combined
 */
export const protectedRoutes = [
  ...mainRoutes,
  ...adminModuleRoutes,
  ...employeeModuleRoutes,
  ...branchManagerModuleRoutes,
];

/**
 * All routes combined
 */
export const allRoutes = [
  ...publicRoutes,
  ...protectedRoutes,
];

/**
 * Navigation items for different roles
 */
export const navigationConfig = {
  admin: [
    {
      path: '/admin/dashboard',
      label: 'Admin Dashboard',
      icon: 'dashboard',
    },
    {
      path: '/admin/users',
      label: 'Users',
      icon: 'users',
    },
    {
      path: '/admin/roles',
      label: 'Roles',
      icon: 'shield',
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: 'settings',
    },
    {
      path: '/admin/audit-logs',
      label: 'Audit Logs',
      icon: 'history',
    },
    {
      path: '/admin/analytics',
      label: 'Analytics',
      icon: 'chart',
    },
  ],
  employee: employeeNavItems,
  branchManager: branchManagerNavItems,
  common: [
    {
      path: '/',
      label: 'Dashboard',
      icon: 'dashboard',
    },
    {
      path: '/pos',
      label: 'Point of Sale',
      icon: 'cash',
    },
    {
      path: '/products',
      label: 'Products',
      icon: 'box',
    },
    {
      path: '/inventory',
      label: 'Inventory',
      icon: 'inventory',
    },
    {
      path: '/sales',
      label: 'Sales',
      icon: 'receipt',
    },
    {
      path: '/customers',
      label: 'Customers',
      icon: 'people',
    },
    {
      path: '/suppliers',
      label: 'Suppliers',
      icon: 'truck',
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: 'chart',
    },
  ],
};

export default {
  publicRoutes,
  protectedRoutes,
  allRoutes,
  navigationConfig,
};
