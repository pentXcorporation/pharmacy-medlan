/**
 * Navigation Configuration
 * Defines sidebar navigation items with role-based access control
 */

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  Building2,
  FileText,
  DollarSign,
  Settings,
  Truck,
  ClipboardList,
  PackageCheck,
  ArrowLeftRight,
  Bell,
  Shield,
  UserCog,
  Wallet,
  Receipt,
  TrendingUp,
  PieChart,
  Calendar,
  Archive,
  AlertTriangle,
  Pill,
  Tags,
} from "lucide-react";
import { ROLES } from "@/constants";
import { ROUTES } from "@/config";

/**
 * Navigation item structure
 * @typedef {Object} NavItem
 * @property {string} title - Display title
 * @property {string} href - Route path
 * @property {React.Component} icon - Lucide icon component
 * @property {Array<string>} roles - Allowed roles
 * @property {Array<NavItem>} children - Sub-navigation items
 * @property {string} badge - Optional badge text
 */

/**
 * Main navigation configuration
 */
export const NAVIGATION = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_ADMIN,
      ROLES.PHARMACIST,
      ROLES.CASHIER,
      ROLES.INVENTORY_MANAGER,
      ROLES.ACCOUNTANT,
    ],
  },
  {
    title: "Point of Sale",
    href: ROUTES.POS.ROOT,
    icon: ShoppingCart,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_ADMIN,
      ROLES.PHARMACIST,
      ROLES.CASHIER,
    ],
    children: [
      {
        title: "New Sale",
        href: ROUTES.POS.NEW_SALE,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
          ROLES.CASHIER,
        ],
      },
      {
        title: "Held Sales",
        href: ROUTES.POS.HELD_SALES,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
          ROLES.CASHIER,
        ],
      },
      {
        title: "Sales History",
        href: ROUTES.POS.HISTORY,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
        ],
      },
      {
        title: "Returns",
        href: ROUTES.POS.RETURNS,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
        ],
      },
    ],
  },
  {
    title: "Products",
    href: ROUTES.PRODUCTS.ROOT,
    icon: Pill,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_ADMIN,
      ROLES.PHARMACIST,
      ROLES.INVENTORY_MANAGER,
    ],
    children: [
      {
        title: "All Products",
        href: ROUTES.PRODUCTS.LIST,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Add Product",
        href: ROUTES.PRODUCTS.NEW,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Categories",
        href: ROUTES.CATEGORIES.ROOT,
        icon: Tags,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Low Stock",
        href: ROUTES.PRODUCTS.LOW_STOCK,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
        badge: "alert",
      },
      {
        title: "Expiring Soon",
        href: ROUTES.PRODUCTS.EXPIRING,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
          ROLES.INVENTORY_MANAGER,
        ],
        badge: "alert",
      },
    ],
  },
  {
    title: "Inventory",
    href: ROUTES.INVENTORY.ROOT,
    icon: Boxes,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_ADMIN,
      ROLES.PHARMACIST,
      ROLES.INVENTORY_MANAGER,
    ],
    children: [
      {
        title: "Stock Overview",
        href: ROUTES.INVENTORY.STOCK,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Stock Movements",
        href: ROUTES.INVENTORY.MOVEMENTS,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Stock Transfers",
        href: ROUTES.INVENTORY.TRANSFERS.LIST,
        icon: ArrowLeftRight,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Stock Adjustments",
        href: ROUTES.INVENTORY.ADJUSTMENTS.LIST,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Batch Tracking",
        href: ROUTES.INVENTORY.BATCHES,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
          ROLES.INVENTORY_MANAGER,
        ],
      },
    ],
  },
  {
    title: "Purchase Orders",
    href: ROUTES.PURCHASE_ORDERS.ROOT,
    icon: ClipboardList,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_ADMIN,
      ROLES.INVENTORY_MANAGER,
    ],
    children: [
      {
        title: "All Orders",
        href: ROUTES.PURCHASE_ORDERS.LIST,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Create Order",
        href: ROUTES.PURCHASE_ORDERS.NEW,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "GRN",
        href: ROUTES.GRN.ROOT,
        icon: PackageCheck,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
    ],
  },
  {
    title: "Suppliers",
    href: ROUTES.SUPPLIERS.ROOT,
    icon: Truck,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_ADMIN,
      ROLES.INVENTORY_MANAGER,
    ],
    children: [
      {
        title: "All Suppliers",
        href: ROUTES.SUPPLIERS.LIST,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Add Supplier",
        href: ROUTES.SUPPLIERS.NEW,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
    ],
  },
  {
    title: "Customers",
    href: ROUTES.CUSTOMERS.ROOT,
    icon: Users,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_ADMIN,
      ROLES.PHARMACIST,
      ROLES.CASHIER,
    ],
    children: [
      {
        title: "All Customers",
        href: ROUTES.CUSTOMERS.LIST,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
          ROLES.CASHIER,
        ],
      },
      {
        title: "Add Customer",
        href: ROUTES.CUSTOMERS.NEW,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.PHARMACIST,
        ],
      },
      {
        title: "Credit Accounts",
        href: ROUTES.CUSTOMERS.CREDITS,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
      },
    ],
  },
  {
    title: "Finance",
    href: ROUTES.FINANCE.ROOT,
    icon: DollarSign,
    roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
    children: [
      {
        title: "Overview",
        href: ROUTES.FINANCE.OVERVIEW,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
      },
      {
        title: "Transactions",
        href: ROUTES.FINANCE.TRANSACTIONS,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
      },
      {
        title: "Invoices",
        href: ROUTES.FINANCE.INVOICES,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
      },
      {
        title: "Cheques",
        href: ROUTES.FINANCE.CHEQUES,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
      },
      {
        title: "Cash Register",
        href: ROUTES.FINANCE.CASH_REGISTER,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.ACCOUNTANT,
        ],
      },
      {
        title: "Banks",
        href: ROUTES.FINANCE.BANKS,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
      },
    ],
  },
  {
    title: "Payroll",
    href: ROUTES.PAYROLL.ROOT,
    icon: Wallet,
    roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
    children: [
      {
        title: "Salary Records",
        href: ROUTES.PAYROLL.SALARIES,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
      },
      {
        title: "Attendance",
        href: ROUTES.PAYROLL.ATTENDANCE,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.ACCOUNTANT,
        ],
      },
      {
        title: "Advances",
        href: ROUTES.PAYROLL.ADVANCES,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
      },
    ],
  },
  {
    title: "Reports",
    href: ROUTES.REPORTS.ROOT,
    icon: PieChart,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.OWNER,
      ROLES.BRANCH_ADMIN,
      ROLES.ACCOUNTANT,
    ],
    children: [
      {
        title: "Sales Reports",
        href: ROUTES.REPORTS.SALES,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.ACCOUNTANT,
        ],
      },
      {
        title: "Inventory Reports",
        href: ROUTES.REPORTS.INVENTORY,
        roles: [
          ROLES.SUPER_ADMIN,
          ROLES.OWNER,
          ROLES.BRANCH_ADMIN,
          ROLES.INVENTORY_MANAGER,
        ],
      },
      {
        title: "Financial Reports",
        href: ROUTES.REPORTS.FINANCIAL,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.ACCOUNTANT],
      },
      {
        title: "Employee Reports",
        href: ROUTES.REPORTS.EMPLOYEES,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
      },
      {
        title: "Audit Trail",
        href: ROUTES.REPORTS.AUDIT,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER],
      },
    ],
  },
  {
    title: "Employees",
    href: ROUTES.EMPLOYEES.ROOT,
    icon: UserCog,
    roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
    children: [
      {
        title: "All Employees",
        href: ROUTES.EMPLOYEES.LIST,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
      },
      {
        title: "Add Employee",
        href: ROUTES.EMPLOYEES.NEW,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
      },
      {
        title: "Attendance",
        href: ROUTES.EMPLOYEES.ATTENDANCE,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
      },
    ],
  },
  {
    title: "Branches",
    href: ROUTES.BRANCHES.ROOT,
    icon: Building2,
    roles: [ROLES.SUPER_ADMIN, ROLES.OWNER],
    children: [
      {
        title: "All Branches",
        href: ROUTES.BRANCHES.LIST,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER],
      },
      {
        title: "Add Branch",
        href: ROUTES.BRANCHES.NEW,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER],
      },
    ],
  },
  {
    title: "Users",
    href: ROUTES.USERS.ROOT,
    icon: Shield,
    roles: [ROLES.SUPER_ADMIN],
    children: [
      {
        title: "All Users",
        href: ROUTES.USERS.LIST,
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        title: "Add User",
        href: ROUTES.USERS.NEW,
        roles: [ROLES.SUPER_ADMIN],
      },
    ],
  },
  {
    title: "Settings",
    href: ROUTES.SETTINGS.ROOT,
    icon: Settings,
    roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
    children: [
      {
        title: "General",
        href: ROUTES.SETTINGS.GENERAL,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER],
      },
      {
        title: "Branch Settings",
        href: ROUTES.SETTINGS.BRANCH,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
      },
      {
        title: "Tax Settings",
        href: ROUTES.SETTINGS.TAX,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER],
      },
      {
        title: "Notifications",
        href: ROUTES.SETTINGS.NOTIFICATIONS,
        roles: [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.BRANCH_ADMIN],
      },
    ],
  },
];

/**
 * Filter navigation items based on user role
 * @param {Array<NavItem>} items - Navigation items
 * @param {string} userRole - Current user role
 * @returns {Array<NavItem>} Filtered navigation items
 */
export const filterNavigationByRole = (items, userRole) => {
  if (!userRole) return [];

  return items
    .filter((item) => item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      children: item.children
        ? filterNavigationByRole(item.children, userRole)
        : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0);
};

/**
 * Get flattened list of all routes for quick access
 * @param {Array<NavItem>} items - Navigation items
 * @returns {Array<{title: string, href: string}>} Flat route list
 */
export const getFlatRoutes = (items = NAVIGATION) => {
  return items.reduce((acc, item) => {
    acc.push({ title: item.title, href: item.href, icon: item.icon });
    if (item.children) {
      acc.push(...getFlatRoutes(item.children));
    }
    return acc;
  }, []);
};

export default NAVIGATION;
