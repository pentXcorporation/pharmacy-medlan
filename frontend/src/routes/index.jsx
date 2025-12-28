/**
 * Application Router Configuration
 * Defines all routes with lazy loading and guards
 */

import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "@/config";
import { ROLES } from "@/constants";
import { MainLayout, AuthLayout } from "@/components/layout";
import { PageLoader } from "@/components/common";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AuthGuard, RoleGuard } from "./guards";

// Lazy load pages for code splitting
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));

// Products Pages
const ProductsPage = lazy(() => import("@/pages/products/ProductsPage"));
const ProductFormPage = lazy(() => import("@/pages/products/ProductFormPage"));
const ProductViewPage = lazy(() => import("@/pages/products/ProductViewPage"));

// Categories Pages
const CategoriesPage = lazy(() => import("@/pages/categories/CategoriesPage"));

// Inventory Pages
const InventoryPage = lazy(() => import("@/pages/inventory/InventoryPage"));

// Customers Pages
const CustomersPage = lazy(() => import("@/pages/customers/CustomersPage"));
const CustomerFormPage = lazy(() =>
  import("@/pages/customers/CustomerFormPage")
);

// Suppliers Pages
const SuppliersPage = lazy(() => import("@/pages/suppliers/SuppliersPage"));
const SupplierFormPage = lazy(() =>
  import("@/pages/suppliers/SupplierFormPage")
);

// Placeholder for pages not yet implemented
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="text-6xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
);

// Suspense wrapper for lazy loaded pages
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

/**
 * Create the application router
 */
const router = createBrowserRouter([
  // Auth routes (no auth required)
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/forgot-password",
        element: <PlaceholderPage title="Forgot Password" />,
      },
    ],
  },

  // Protected routes (auth required)
  {
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // Dashboard
      {
        path: ROUTES.DASHBOARD,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },

      // POS Routes
      {
        path: ROUTES.POS.ROOT,
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.OWNER,
              ROLES.BRANCH_ADMIN,
              ROLES.PHARMACIST,
              ROLES.CASHIER,
            ]}
          >
            <PlaceholderPage title="Point of Sale" />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.POS.NEW_SALE,
        element: (
          <RoleGuard feature="pos" action="create">
            <PlaceholderPage title="New Sale" />
          </RoleGuard>
        ),
      },

      // Products Routes
      {
        path: ROUTES.PRODUCTS.ROOT,
        element: <Navigate to={ROUTES.PRODUCTS.LIST} replace />,
      },
      {
        path: ROUTES.PRODUCTS.LIST,
        element: (
          <SuspenseWrapper>
            <ProductsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.PRODUCTS.NEW,
        element: (
          <RoleGuard feature="products" action="create">
            <SuspenseWrapper>
              <ProductFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PRODUCTS.EDIT(":id"),
        element: (
          <RoleGuard feature="products" action="update">
            <SuspenseWrapper>
              <ProductFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PRODUCTS.VIEW(":id"),
        element: (
          <SuspenseWrapper>
            <ProductViewPage />
          </SuspenseWrapper>
        ),
      },

      // Categories Routes
      {
        path: ROUTES.CATEGORIES.ROOT,
        element: <Navigate to={ROUTES.CATEGORIES.LIST} replace />,
      },
      {
        path: ROUTES.CATEGORIES.LIST,
        element: (
          <SuspenseWrapper>
            <CategoriesPage />
          </SuspenseWrapper>
        ),
      },

      // Inventory Routes
      {
        path: ROUTES.INVENTORY.ROOT,
        element: (
          <SuspenseWrapper>
            <InventoryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.STOCK,
        element: (
          <SuspenseWrapper>
            <InventoryPage />
          </SuspenseWrapper>
        ),
      },

      // Suppliers Routes
      {
        path: ROUTES.SUPPLIERS.ROOT,
        element: <Navigate to={ROUTES.SUPPLIERS.LIST} replace />,
      },
      {
        path: ROUTES.SUPPLIERS.LIST,
        element: (
          <SuspenseWrapper>
            <SuppliersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.SUPPLIERS.NEW,
        element: (
          <RoleGuard feature="suppliers" action="create">
            <SuspenseWrapper>
              <SupplierFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.SUPPLIERS.EDIT(":id"),
        element: (
          <RoleGuard feature="suppliers" action="update">
            <SuspenseWrapper>
              <SupplierFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Customers Routes
      {
        path: ROUTES.CUSTOMERS.ROOT,
        element: <Navigate to={ROUTES.CUSTOMERS.LIST} replace />,
      },
      {
        path: ROUTES.CUSTOMERS.LIST,
        element: (
          <SuspenseWrapper>
            <CustomersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.CUSTOMERS.NEW,
        element: (
          <RoleGuard feature="customers" action="create">
            <SuspenseWrapper>
              <CustomerFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.CUSTOMERS.EDIT(":id"),
        element: (
          <RoleGuard feature="customers" action="update">
            <SuspenseWrapper>
              <CustomerFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Finance Routes
      {
        path: ROUTES.FINANCE.ROOT,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <PlaceholderPage title="Finance" />
          </RoleGuard>
        ),
      },

      // Reports Routes
      {
        path: ROUTES.REPORTS.ROOT,
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.OWNER,
              ROLES.BRANCH_ADMIN,
              ROLES.ACCOUNTANT,
            ]}
          >
            <PlaceholderPage title="Reports" />
          </RoleGuard>
        ),
      },

      // Employees Routes
      {
        path: ROUTES.EMPLOYEES.ROOT,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <PlaceholderPage title="Employees" />
          </RoleGuard>
        ),
      },

      // Branches Routes
      {
        path: ROUTES.BRANCHES.ROOT,
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]}>
            <PlaceholderPage title="Branches" />
          </RoleGuard>
        ),
      },

      // Users Routes (Super Admin only)
      {
        path: ROUTES.USERS.ROOT,
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]}>
            <PlaceholderPage title="Users" />
          </RoleGuard>
        ),
      },

      // Settings Routes
      {
        path: ROUTES.SETTINGS.ROOT,
        element: <PlaceholderPage title="Settings" />,
      },

      // Catch-all redirect to dashboard
      {
        path: "*",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
    ],
  },

  // Root redirect
  {
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);

export default router;
