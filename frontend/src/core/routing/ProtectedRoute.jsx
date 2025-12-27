import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';

/**
 * ProtectedRoute Component
 * Handles authentication and authorization for routes
 */
export const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles
  if (roles.length > 0 && user?.role) {
    const hasRequiredRole = roles.includes(user.role);
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on role
      const roleRedirects = {
        ADMIN: '/',
        BRANCH_MANAGER: '/branch-manager/dashboard',
        PHARMACIST: '/pos',
        EMPLOYEE: '/employee/dashboard',
        CASHIER: '/pos',
      };
      const redirectPath = roleRedirects[user.role] || '/';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

/**
 * PublicRoute Component
 * Redirects authenticated users away from public routes
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects = {
      ADMIN: '/',
      BRANCH_MANAGER: '/branch-manager/dashboard',
      PHARMACIST: '/pos',
      EMPLOYEE: '/employee/dashboard',
      CASHIER: '/pos',
    };
    const redirectPath = roleRedirects[user?.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

/**
 * RoleGuard Component
 * Conditionally renders children based on user role
 */
export const RoleGuard = ({ roles, children, fallback = null }) => {
  const { user } = useAuthStore();

  if (!user?.role) {
    return fallback;
  }

  const hasRequiredRole = roles.includes(user.role);
  return hasRequiredRole ? children : fallback;
};

export default ProtectedRoute;
