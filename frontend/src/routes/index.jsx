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

// Users Pages
const UsersPage = lazy(() => import("@/pages/users/UsersPage"));
const UserFormPage = lazy(() => import("@/pages/users/UserFormPage"));

// Branches Pages
const BranchesPage = lazy(() => import("@/pages/branches/BranchesPage"));
const BranchFormPage = lazy(() => import("@/pages/branches/BranchFormPage"));

// Purchase Orders Pages
const PurchaseOrdersPage = lazy(() =>
  import("@/pages/purchase-orders/PurchaseOrdersPage")
);
const PurchaseOrderFormPage = lazy(() =>
  import("@/pages/purchase-orders/PurchaseOrderFormPage")
);
const PurchaseOrderViewPage = lazy(() =>
  import("@/pages/purchase-orders/PurchaseOrderViewPage")
);

// GRN Pages
const GRNListPage = lazy(() => import("@/pages/grn/GRNListPage"));
const GRNFormPage = lazy(() => import("@/pages/grn/GRNFormPage"));
const GRNViewPage = lazy(() => import("@/pages/grn/GRNViewPage"));

// Reports Pages
const ReportsPage = lazy(() => import("@/pages/reports/ReportsPage"));
const SalesReportPage = lazy(() => import("@/pages/reports/SalesReportPage"));
const InventoryReportPage = lazy(() =>
  import("@/pages/reports/InventoryReportPage")
);
const FinancialReportPage = lazy(() =>
  import("@/pages/reports/FinancialReportPage")
);

// Settings Pages
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));

// POS/Sales Pages
const POSPage = lazy(() => import("@/pages/pos/POSPage"));
const SalesHistoryPage = lazy(() => import("@/pages/sales/SalesHistoryPage"));
const SaleViewPage = lazy(() => import("@/pages/sales/SaleViewPage"));
const SaleReturnsPage = lazy(() => import("@/pages/sales/SaleReturnsPage"));
const SaleReturnFormPage = lazy(() =>
  import("@/pages/sales/SaleReturnFormPage")
);

// Finance Pages
const FinancePage = lazy(() => import("@/pages/finance/FinancePage"));

// Employees Pages
const EmployeesPage = lazy(() => import("@/pages/employees/EmployeesPage"));

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
              ROLES.ADMIN,
              ROLES.BRANCH_MANAGER,
              ROLES.PHARMACIST,
              ROLES.CASHIER,
            ]}
          >
            <SuspenseWrapper>
              <POSPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.POS.NEW_SALE,
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.BRANCH_MANAGER,
              ROLES.PHARMACIST,
              ROLES.CASHIER,
            ]}
          >
            <SuspenseWrapper>
              <POSPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.POS.HELD_SALES,
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.BRANCH_MANAGER,
              ROLES.PHARMACIST,
              ROLES.CASHIER,
            ]}
          >
            <SuspenseWrapper>
              <POSPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.POS.HISTORY,
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.BRANCH_MANAGER,
              ROLES.PHARMACIST,
              ROLES.CASHIER,
            ]}
          >
            <SuspenseWrapper>
              <SalesHistoryPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.POS.RETURNS,
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.BRANCH_MANAGER,
              ROLES.PHARMACIST,
            ]}
          >
            <SuspenseWrapper>
              <SaleReturnsPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Sales Routes
      {
        path: ROUTES.SALES.LIST,
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
            <SuspenseWrapper>
              <SalesHistoryPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.SALES.VIEW(":id"),
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
            <SuspenseWrapper>
              <SaleViewPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Sale Returns Routes
      {
        path: ROUTES.SALE_RETURNS.LIST,
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.BRANCH_MANAGER,
              ROLES.PHARMACIST,
            ]}
          >
            <SuspenseWrapper>
              <SaleReturnsPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.SALE_RETURNS.CREATE,
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.BRANCH_MANAGER,
              ROLES.PHARMACIST,
            ]}
          >
            <SuspenseWrapper>
              <SaleReturnFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.SALE_RETURNS.VIEW(":id"),
        element: (
          <RoleGuard
            allowedRoles={[
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.BRANCH_MANAGER,
              ROLES.PHARMACIST,
            ]}
          >
            <SuspenseWrapper>
              <SaleReturnFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Products Routes
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
            <SuspenseWrapper>
              <FinancePage />
            </SuspenseWrapper>
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
            <SuspenseWrapper>
              <ReportsPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.REPORTS.SALES,
        element: (
          <RoleGuard feature="reports" action="view">
            <SuspenseWrapper>
              <SalesReportPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.REPORTS.INVENTORY,
        element: (
          <RoleGuard feature="reports" action="view">
            <SuspenseWrapper>
              <InventoryReportPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.REPORTS.FINANCIAL,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <SuspenseWrapper>
              <FinancialReportPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Employees Routes
      {
        path: ROUTES.EMPLOYEES.LIST,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <EmployeesPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Branches Routes
      {
        path: ROUTES.BRANCHES.LIST,
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]}>
            <SuspenseWrapper>
              <BranchesPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.BRANCHES.NEW,
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]}>
            <SuspenseWrapper>
              <BranchFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.BRANCHES.EDIT(":id"),
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]}>
            <SuspenseWrapper>
              <BranchFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Users Routes (Super Admin only)
      {
        path: ROUTES.USERS.LIST,
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]}>
            <SuspenseWrapper>
              <UsersPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.USERS.NEW,
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]}>
            <SuspenseWrapper>
              <UserFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.USERS.EDIT(":id"),
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]}>
            <SuspenseWrapper>
              <UserFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Purchase Orders Routes
      {
        path: ROUTES.PURCHASE_ORDERS.LIST,
        element: (
          <RoleGuard feature="purchaseOrders" action="view">
            <SuspenseWrapper>
              <PurchaseOrdersPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PURCHASE_ORDERS.NEW,
        element: (
          <RoleGuard feature="purchaseOrders" action="create">
            <SuspenseWrapper>
              <PurchaseOrderFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PURCHASE_ORDERS.EDIT(":id"),
        element: (
          <RoleGuard feature="purchaseOrders" action="update">
            <SuspenseWrapper>
              <PurchaseOrderFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PURCHASE_ORDERS.VIEW(":id"),
        element: (
          <RoleGuard feature="purchaseOrders" action="view">
            <SuspenseWrapper>
              <PurchaseOrderViewPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // GRN Routes
      {
        path: ROUTES.GRN.LIST,
        element: (
          <RoleGuard feature="grn" action="view">
            <SuspenseWrapper>
              <GRNListPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.GRN.CREATE,
        element: (
          <RoleGuard feature="grn" action="create">
            <SuspenseWrapper>
              <GRNFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.GRN.VIEW(":id"),
        element: (
          <RoleGuard feature="grn" action="view">
            <SuspenseWrapper>
              <GRNViewPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },

      // Settings Routes
      {
        path: ROUTES.SETTINGS.ROOT,
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
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
