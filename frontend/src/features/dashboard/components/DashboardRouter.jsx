/**
 * DashboardRouter Component
 * Automatically routes users to their role-specific dashboard
 */

import { useAuth } from "@/hooks";
import { ROLES } from "@/constants";
import {
  SuperAdminDashboard,
  AdminDashboard,
  CashierDashboard,
  PharmacistDashboard,
  AccountantDashboard,
  InventoryManagerDashboard,
} from "./dashboards";

/**
 * Maps user roles to their specific dashboard component
 */
const DASHBOARD_BY_ROLE = {
  [ROLES.SUPER_ADMIN]: SuperAdminDashboard,
  [ROLES.ADMIN]: AdminDashboard,
  [ROLES.BRANCH_MANAGER]: AdminDashboard,
  [ROLES.PHARMACIST]: PharmacistDashboard,
  [ROLES.CASHIER]: CashierDashboard,
  [ROLES.INVENTORY_MANAGER]: InventoryManagerDashboard,
  [ROLES.ACCOUNTANT]: AccountantDashboard,
};

/**
 * DashboardRouter - Renders the appropriate dashboard based on user role
 */
const DashboardRouter = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  // Get the dashboard component for the user's role
  const DashboardComponent = DASHBOARD_BY_ROLE[userRole] || AdminDashboard;

  return <DashboardComponent />;
};

export default DashboardRouter;
