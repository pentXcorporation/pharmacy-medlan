/**
 * AuthGuard Component
 * Protects routes requiring authentication
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import { ROUTES } from "@/config";
import { PageLoader } from "@/components/common";

/**
 * AuthGuard - Protects routes that require authentication
 */
const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // BYPASS: Skip authentication check to see dashboard
  // Uncomment the code below to re-enable authentication
  return children;

  // Show loading while checking auth status
  // if (isLoading) {
  //   return <PageLoader message="Checking authentication..." />;
  // }

  // Redirect to login if not authenticated
  // if (!isAuthenticated) {
  //   return (
  //     <Navigate
  //       to={ROUTES.AUTH.LOGIN}
  //       state={{ from: location.pathname }}
  //       replace
  //     />
  //   );
  // }

  // return children;
};

export default AuthGuard;
