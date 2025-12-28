/**
 * RoleGuard Component
 * Protects routes based on user roles
 */

import { Navigate } from "react-router-dom";
import { useAuth, usePermissions } from "@/hooks";
import { ROUTES } from "@/config";

/**
 * AccessDenied component
 */
const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="text-6xl mb-4">🔒</div>
    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
    <p className="text-muted-foreground mb-4">
      You don't have permission to access this page.
    </p>
    <a href={ROUTES.DASHBOARD} className="text-primary hover:underline">
      Go to Dashboard
    </a>
  </div>
);

/**
 * RoleGuard - Protects routes based on user roles
 * @param {Array<string>} allowedRoles - Roles allowed to access the route
 * @param {string} minimumRole - Minimum role level required
 * @param {string} feature - Feature to check permission for
 * @param {string} action - Action to check permission for
 * @param {string} redirectTo - Path to redirect if access denied
 * @param {React.ReactNode} children - Child components
 */
const RoleGuard = ({
  allowedRoles,
  minimumRole,
  feature,
  action = "view",
  redirectTo,
  fallback = <AccessDenied />,
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const { role, hasAnyRole, hasMinimumRole, hasPermission } = usePermissions();

  // Must be authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  // Check role-based access
  let hasAccess = false;

  // Check if user has any of the allowed roles
  if (allowedRoles && allowedRoles.length > 0) {
    hasAccess = hasAnyRole(allowedRoles);
  }
  // Check if user has minimum role level
  else if (minimumRole) {
    hasAccess = hasMinimumRole(minimumRole);
  }
  // Check feature permission
  else if (feature) {
    hasAccess = hasPermission(feature, action);
  }
  // No restriction specified, allow access
  else {
    hasAccess = true;
  }

  // Redirect or show fallback if access denied
  if (!hasAccess) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback;
  }

  return children;
};

export default RoleGuard;
