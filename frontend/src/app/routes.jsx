import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layouts
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';

// Auth Components
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';

// Loading Component
import { Spinner } from '@/shared/components/ui/Spinner';

// Lazy loaded pages - Auth
const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/modules/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/modules/auth/pages/ResetPasswordPage'));

// Lazy loaded pages - Admin
const AdminDashboardPage = lazy(() => import('@/modules/admin/pages/AdminDashboardPage'));
const UsersPage = lazy(() => import('@/modules/admin/pages/UsersPage'));
const RolesPage = lazy(() => import('@/modules/admin/pages/RolesPage'));
const SettingsPage = lazy(() => import('@/modules/admin/pages/SettingsPage'));
const AuditLogsPage = lazy(() => import('@/modules/admin/pages/AuditLogsPage'));
const AnalyticsPage = lazy(() => import('@/modules/admin/pages/AnalyticsPage'));

// Placeholder pages for other modules (will be implemented)
const DashboardPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-gray-600 mt-2">Welcome to MedLan Pharmacy Management System</p></div> 
  })
);
const POSPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Point of Sale</h1></div> 
  })
);
const ProductsPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Products</h1></div> 
  })
);
const CategoriesPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Categories</h1></div> 
  })
);
const SalesPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Sales</h1></div> 
  })
);
const CustomersPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Customers</h1></div> 
  })
);
const ReportsPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Reports</h1></div> 
  })
);
const PurchaseOrdersPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Purchase Orders</h1></div> 
  })
);
const SuppliersPage = lazy(() => 
  Promise.resolve({ 
    default: () => <div className="p-6"><h1 className="text-2xl font-bold">Suppliers</h1></div> 
  })
);

/**
 * Loading Fallback Component
 */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
);

/**
 * Application Routes Configuration
 * Implements role-based routing with lazy loading for optimal performance
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes - Authentication */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Routes - Dashboard */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Main Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* POS */}
          <Route path="/pos" element={<POSPage />} />
          
          {/* Inventory */}
          <Route path="/inventory/products" element={<ProductsPage />} />
          <Route path="/inventory/categories" element={<CategoriesPage />} />
          
          {/* Sales */}
          <Route path="/sales" element={<SalesPage />} />
          
          {/* Purchases */}
          <Route path="/purchases/orders" element={<PurchaseOrdersPage />} />
          <Route path="/purchases/suppliers" element={<SuppliersPage />} />
          
          {/* Customers */}
          <Route path="/customers" element={<CustomersPage />} />
          
          {/* Reports */}
          <Route path="/reports" element={<ReportsPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/roles" element={<RolesPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
