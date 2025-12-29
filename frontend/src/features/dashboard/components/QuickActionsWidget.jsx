/**
 * QuickActionsWidget Component
 * Quick access buttons for common actions
 * Supports role-specific variants
 */

import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Package,
  Users,
  FileText,
  ArrowLeftRight,
  ClipboardList,
  Truck,
  DollarSign,
  Settings,
  Building2,
  UserCog,
  PieChart,
  Receipt,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks";
import { ROUTES } from "@/config";

/**
 * Action button configuration
 */
const QUICK_ACTIONS = [
  {
    title: "New Sale",
    description: "Start a POS transaction",
    icon: ShoppingCart,
    href: ROUTES.POS.NEW_SALE,
    feature: "pos",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Add Product",
    description: "Add new inventory item",
    icon: Plus,
    href: ROUTES.PRODUCTS.NEW,
    feature: "products",
    action: "create",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Stock Transfer",
    description: "Transfer between branches",
    icon: ArrowLeftRight,
    href: ROUTES.INVENTORY.TRANSFERS,
    feature: "inventory",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Purchase Order",
    description: "Create new PO",
    icon: ClipboardList,
    href: ROUTES.PURCHASE_ORDERS.NEW,
    feature: "purchaseOrders",
    action: "create",
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Add Customer",
    description: "Register new customer",
    icon: Users,
    href: ROUTES.CUSTOMERS.NEW,
    feature: "customers",
    action: "create",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Add Supplier",
    description: "Register new supplier",
    icon: Truck,
    href: ROUTES.SUPPLIERS.NEW,
    feature: "suppliers",
    action: "create",
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "View Stock",
    description: "Check inventory levels",
    icon: Package,
    href: ROUTES.INVENTORY.STOCK,
    feature: "inventory",
    color: "bg-gray-100 text-gray-600",
  },
  {
    title: "Sales Report",
    description: "View sales analytics",
    icon: FileText,
    href: ROUTES.REPORTS.SALES,
    feature: "reports",
    color: "bg-pink-100 text-pink-600",
  },
];

/**
 * Admin-specific quick actions
 */
const ADMIN_ACTIONS = [
  {
    title: "New Sale",
    description: "Start POS transaction",
    icon: ShoppingCart,
    href: ROUTES.POS.NEW_SALE,
    feature: "pos",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Add Product",
    description: "Add new inventory",
    icon: Plus,
    href: ROUTES.PRODUCTS.NEW,
    feature: "products",
    action: "create",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Purchase Order",
    description: "Create new PO",
    icon: ClipboardList,
    href: ROUTES.PURCHASE_ORDERS.NEW,
    feature: "purchaseOrders",
    action: "create",
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "View Reports",
    description: "Analytics dashboard",
    icon: PieChart,
    href: ROUTES.REPORTS.ROOT,
    feature: "reports",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Manage Users",
    description: "User management",
    icon: UserCog,
    href: ROUTES.USERS.LIST,
    feature: "users",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Branches",
    description: "Branch management",
    icon: Building2,
    href: ROUTES.BRANCHES.LIST,
    feature: "branches",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Finance",
    description: "Financial overview",
    icon: Wallet,
    href: ROUTES.FINANCE.ROOT,
    feature: "finance",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Settings",
    description: "System settings",
    icon: Settings,
    href: ROUTES.SETTINGS.ROOT,
    feature: "settings",
    color: "bg-gray-100 text-gray-600",
  },
];

/**
 * Get actions based on variant
 */
const getActionsByVariant = (variant) => {
  switch (variant) {
    case "admin":
      return ADMIN_ACTIONS;
    default:
      return QUICK_ACTIONS;
  }
};

/**
 * QuickActionsWidget component
 * @param {Object} props
 * @param {string} props.variant - "default" | "admin"
 */
const QuickActionsWidget = ({ variant = "default" }) => {
  const { hasPermission } = usePermissions();

  const actions = getActionsByVariant(variant);

  // Filter actions based on permissions
  const availableActions = actions.filter((action) => {
    if (!action.feature) return true;
    return hasPermission(action.feature, action.action || "view");
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {availableActions.slice(0, 8).map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.href}
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:border-primary/50"
                asChild
              >
                <Link to={action.href}>
                  <div className={`rounded-lg p-2 ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsWidget;
