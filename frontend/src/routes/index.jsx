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
const StockTransfersPage = lazy(() =>
  import("@/pages/inventory/StockTransfersPage")
);
const StockTransferFormPage = lazy(() =>
  import("@/pages/inventory/StockTransferFormPage")
);
const StockMovementsPage = lazy(() =>
  import("@/pages/inventory/StockMovementsPage")
);
const StockAdjustmentsPage = lazy(() =>
  import("@/pages/inventory/StockAdjustmentsPage")
);
const StockAdjustmentFormPage = lazy(() =>
  import("@/pages/inventory/StockAdjustmentFormPage")
);
const BatchTrackingPage = lazy(() =>
  import("@/pages/inventory/BatchTrackingPage")
);
const LowStockPage = lazy(() => import("@/pages/inventory/LowStockPage"));
const ExpiringPage = lazy(() => import("@/pages/inventory/ExpiringPage"));

// Customers Pages
const CustomersPage = lazy(() => import("@/pages/customers/CustomersPage"));
const CustomerFormPage = lazy(() =>
  import("@/pages/customers/CustomerFormPage")
);
const CreditAccountsPage = lazy(() =>
  import("@/pages/customers/CreditAccountsPage")
);

// Suppliers Pages
const SuppliersPage = lazy(() => import("@/pages/suppliers/SuppliersPage"));
const SupplierFormPage = lazy(() =>
  import("@/pages/suppliers/SupplierFormPage")
);

// Users Pages
const UsersPage = lazy(() => import("@/pages/users/UsersPage"));
const UserFormPage = lazy(() => import("@/pages/users/UserFormPage"));
const UserViewPage = lazy(() => import("@/pages/users/UserViewPage"));

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
const DirectGRNFormPage = lazy(() => import("@/pages/grn/DirectGRNFormPage"));
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
const EmployeeReportPage = lazy(() =>
  import("@/pages/reports/EmployeeReportPage")
);
const AuditPage = lazy(() => import("@/pages/reports/AuditPage"));

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
const TransactionsPage = lazy(() => import("@/pages/finance/TransactionsPage"));
const InvoicesPage = lazy(() => import("@/pages/finance/InvoicesPage"));
const ChequesPage = lazy(() => import("@/pages/finance/ChequesPage"));
const BanksPage = lazy(() => import("@/pages/finance/BanksPage"));
const CashRegisterPage = lazy(() => import("@/pages/finance/CashRegisterPage"));

// Payroll Pages
const PayrollPage = lazy(() => import("@/pages/payroll/PayrollPage"));
const SalariesPage = lazy(() => import("@/pages/payroll/SalariesPage"));
const AttendancePage = lazy(() => import("@/pages/payroll/AttendancePage"));
const AdvancesPage = lazy(() => import("@/pages/payroll/AdvancesPage"));

// Employees Pages
const EmployeesPage = lazy(() => import("@/pages/employees/EmployeesPage"));
const EmployeeFormPage = lazy(() =>
  import("@/pages/employees/EmployeeFormPage")
);
const EmployeeViewPage = lazy(() =>
  import("@/pages/employees/EmployeeViewPage")
);
const EmployeeAttendancePage = lazy(() =>
  import("@/pages/employees/EmployeeAttendancePage")
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
      {
        path: ROUTES.PRODUCTS.LOW_STOCK,
        element: (
          <SuspenseWrapper>
            <LowStockPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.PRODUCTS.EXPIRING,
        element: (
          <SuspenseWrapper>
            <ExpiringPage />
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
        path: ROUTES.INVENTORY.LIST,
        element: (
          <SuspenseWrapper>
            <InventoryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.TRANSFERS.LIST,
        element: (
          <SuspenseWrapper>
            <StockTransfersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.TRANSFERS.NEW,
        element: (
          <SuspenseWrapper>
            <StockTransferFormPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.MOVEMENTS,
        element: (
          <SuspenseWrapper>
            <StockMovementsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.ADJUSTMENTS.LIST,
        element: (
          <SuspenseWrapper>
            <StockAdjustmentsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.LOW_STOCK,
        element: (
          <SuspenseWrapper>
            <LowStockPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.EXPIRY,
        element: (
          <SuspenseWrapper>
            <ExpiringPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.ADJUSTMENTS.NEW,
        element: (
          <SuspenseWrapper>
            <StockAdjustmentFormPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.INVENTORY.BATCHES,
        element: (
          <SuspenseWrapper>
            <BatchTrackingPage />
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
      {
        path: ROUTES.CUSTOMERS.CREDITS,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <CreditAccountsPage />
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
      {
        path: ROUTES.FINANCE.TRANSACTIONS,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <SuspenseWrapper>
              <TransactionsPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.FINANCE.INVOICES,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <SuspenseWrapper>
              <InvoicesPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.FINANCE.CHEQUES,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <SuspenseWrapper>
              <ChequesPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.FINANCE.BANKS,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <SuspenseWrapper>
              <BanksPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.FINANCE.CASH_REGISTER,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <SuspenseWrapper>
              <CashRegisterPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.FINANCE.CASH_BOOK,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <PlaceholderPage title="Cash Book" />
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.FINANCE.SUMMARY,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT]}
          >
            <PlaceholderPage title="Financial Summary" />
          </RoleGuard>
        ),
      },

      // Payroll Routes
      {
        path: ROUTES.PAYROLL.ROOT,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <PayrollPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PAYROLL.SALARIES,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <SalariesPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PAYROLL.ATTENDANCE,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <AttendancePage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.PAYROLL.ADVANCES,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <AdvancesPage />
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
      {
        path: ROUTES.REPORTS.EMPLOYEES,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <EmployeeReportPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.REPORTS.AUDIT,
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]}>
            <SuspenseWrapper>
              <AuditPage />
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
      {
        path: ROUTES.EMPLOYEES.NEW,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <EmployeeFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.EMPLOYEES.EDIT(":id"),
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <EmployeeFormPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.EMPLOYEES.VIEW(":id"),
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <EmployeeViewPage />
            </SuspenseWrapper>
          </RoleGuard>
        ),
      },
      {
        path: ROUTES.EMPLOYEES.ATTENDANCE,
        element: (
          <RoleGuard
            allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN]}
          >
            <SuspenseWrapper>
              <EmployeeAttendancePage />
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
      {
        path: ROUTES.USERS.VIEW(":id"),
        element: (
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.OWNER]}>
            <SuspenseWrapper>
              <UserViewPage />
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
        path: ROUTES.GRN.DIRECT,
        element: (
          <RoleGuard feature="grn" action="create">
            <SuspenseWrapper>
              <DirectGRNFormPage />
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
      {
        path: ROUTES.SETTINGS.GENERAL,
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.SETTINGS.BRANCH,
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.SETTINGS.TAX,
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.SETTINGS.NOTIFICATIONS,
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: ROUTES.SETTINGS.PROFILE,
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/settings/preferences",
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
