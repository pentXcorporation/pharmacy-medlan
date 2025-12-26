import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from './store';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { POSPage } from './pages/POSPage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { BranchesPage } from './pages/BranchesPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { GRNPage } from './pages/GRNPage';
import { SalesPage } from './pages/SalesPage';
import { SaleReturnsPage } from './pages/SaleReturnsPage';
import { UsersPage } from './pages/UsersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<ProtectedRoute path="/"><DashboardPage /></ProtectedRoute>} />
                    <Route path="/pos" element={<ProtectedRoute path="/pos"><POSPage /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute path="/products"><ProductsPage /></ProtectedRoute>} />
                    <Route path="/categories" element={<ProtectedRoute path="/categories"><CategoriesPage /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute path="/inventory"><InventoryPage /></ProtectedRoute>} />
                    <Route path="/purchase-orders" element={<ProtectedRoute path="/purchase-orders"><PurchaseOrdersPage /></ProtectedRoute>} />
                    <Route path="/grn" element={<ProtectedRoute path="/grn"><GRNPage /></ProtectedRoute>} />
                    <Route path="/sales" element={<ProtectedRoute path="/sales"><SalesPage /></ProtectedRoute>} />
                    <Route path="/sale-returns" element={<ProtectedRoute path="/sale-returns"><SaleReturnsPage /></ProtectedRoute>} />
                    <Route path="/customers" element={<ProtectedRoute path="/customers"><CustomersPage /></ProtectedRoute>} />
                    <Route path="/suppliers" element={<ProtectedRoute path="/suppliers"><SuppliersPage /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute path="/users"><UsersPage /></ProtectedRoute>} />
                    <Route path="/branches" element={<ProtectedRoute path="/branches"><BranchesPage /></ProtectedRoute>} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
