import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from './store';

// Core Components
import { Layout } from './components/Layout';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #e5e7eb',
      borderTopColor: '#2563eb',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

// Lazy load all pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const POSPage = lazy(() => import('./pages/POSPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const SuppliersPage = lazy(() => import('./pages/SuppliersPage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const PurchaseOrdersPage = lazy(() => import('./pages/PurchaseOrdersPage'));
const GRNPage = lazy(() => import('./pages/GRNPage'));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const SaleReturnsPage = lazy(() => import('./pages/SaleReturnsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const StockTransferPage = lazy(() => import('./pages/StockTransferPage'));

// Admin Module Pages
const AdminDashboardPage = lazy(() => import('./modules/admin/pages/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./modules/admin/pages/UsersPage'));
const AdminRolesPage = lazy(() => import('./modules/admin/pages/RolesPage'));
const AdminSettingsPage = lazy(() => import('./modules/admin/pages/SettingsPage'));
const AdminAuditLogsPage = lazy(() => import('./modules/admin/pages/AuditLogsPage'));
const AdminAnalyticsPage = lazy(() => import('./modules/admin/pages/AnalyticsPage'));

// Employee Module Pages
const EmployeeDashboardPage = lazy(() => import('./modules/employee/pages/DashboardPage'));
const EmployeeTasksPage = lazy(() => import('./modules/employee/pages/TasksPage'));
const EmployeeAttendancePage = lazy(() => import('./modules/employee/pages/AttendancePage'));
const EmployeeLeavePage = lazy(() => import('./modules/employee/pages/LeavePage'));
const EmployeeProfilePage = lazy(() => import('./modules/employee/pages/ProfilePage'));

// Branch Manager Module Pages
const BranchManagerDashboardPage = lazy(() => import('./modules/branch-manager/pages/DashboardPage'));
const BranchManagerStaffPage = lazy(() => import('./modules/branch-manager/pages/StaffPage'));
const BranchManagerInventoryPage = lazy(() => import('./modules/branch-manager/pages/InventoryPage'));
const BranchManagerReportsPage = lazy(() => import('./modules/branch-manager/pages/ReportsPage'));
const BranchManagerSchedulePage = lazy(() => import('./modules/branch-manager/pages/SchedulePage'));

// Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Private Route Component
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Protected Route with Role Check
function ProtectedRoute({ children, path, roles = [] }) {
  const { user } = useAuthStore();
  
  // If roles are specified, check if user has one of the required roles
  if (roles.length > 0 && user?.role) {
    if (!roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        {/* Main Dashboard */}
                        <Route path="/" element={<DashboardPage />} />
                        
                        {/* Core Business Routes */}
                        <Route path="/pos" element={<POSPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                        <Route path="/grn" element={<GRNPage />} />
                        <Route path="/sales" element={<SalesPage />} />
                        <Route path="/sale-returns" element={<SaleReturnsPage />} />
                        <Route path="/customers" element={<CustomersPage />} />
                        <Route path="/suppliers" element={<SuppliersPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/branches" element={<BranchesPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/stock-transfer" element={<StockTransferPage />} />
                        
                        {/* Admin Module Routes */}
                        <Route path="/admin" element={
                          <ProtectedRoute roles={['ADMIN']}>
                            <AdminDashboardPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/dashboard" element={
                          <ProtectedRoute roles={['ADMIN']}>
                            <AdminDashboardPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/users" element={
                          <ProtectedRoute roles={['ADMIN']}>
                            <AdminUsersPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/roles" element={
                          <ProtectedRoute roles={['ADMIN']}>
                            <AdminRolesPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/settings" element={
                          <ProtectedRoute roles={['ADMIN']}>
                            <AdminSettingsPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/audit-logs" element={
                          <ProtectedRoute roles={['ADMIN']}>
                            <AdminAuditLogsPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/admin/analytics" element={
                          <ProtectedRoute roles={['ADMIN']}>
                            <AdminAnalyticsPage />
                          </ProtectedRoute>
                        } />
                        
                        {/* Employee Module Routes */}
                        <Route path="/employee" element={<EmployeeDashboardPage />} />
                        <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
                        <Route path="/employee/tasks" element={<EmployeeTasksPage />} />
                        <Route path="/employee/attendance" element={<EmployeeAttendancePage />} />
                        <Route path="/employee/leave" element={<EmployeeLeavePage />} />
                        <Route path="/employee/profile" element={<EmployeeProfilePage />} />
                        
                        {/* Branch Manager Module Routes */}
                        <Route path="/branch-manager" element={
                          <ProtectedRoute roles={['ADMIN', 'BRANCH_MANAGER']}>
                            <BranchManagerDashboardPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/branch-manager/dashboard" element={
                          <ProtectedRoute roles={['ADMIN', 'BRANCH_MANAGER']}>
                            <BranchManagerDashboardPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/branch-manager/staff" element={
                          <ProtectedRoute roles={['ADMIN', 'BRANCH_MANAGER']}>
                            <BranchManagerStaffPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/branch-manager/schedule" element={
                          <ProtectedRoute roles={['ADMIN', 'BRANCH_MANAGER']}>
                            <BranchManagerSchedulePage />
                          </ProtectedRoute>
                        } />
                        <Route path="/branch-manager/inventory" element={
                          <ProtectedRoute roles={['ADMIN', 'BRANCH_MANAGER']}>
                            <BranchManagerInventoryPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/branch-manager/reports" element={
                          <ProtectedRoute roles={['ADMIN', 'BRANCH_MANAGER']}>
                            <BranchManagerReportsPage />
                          </ProtectedRoute>
                        } />
                        
                        {/* Catch-all redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
