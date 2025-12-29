/**
 * DashboardPage Component
 * Main dashboard entry point - routes to role-specific dashboard
 */

import { DashboardRouter } from "@/features/dashboard";

/**
 * DashboardPage - Entry point that delegates to role-specific dashboards
 */
const DashboardPage = () => {
  return <DashboardRouter />;
};

export default DashboardPage;
