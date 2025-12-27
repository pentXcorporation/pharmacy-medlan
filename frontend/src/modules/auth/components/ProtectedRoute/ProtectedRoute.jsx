import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '@/shared/components/ui/Spinner';

/**
 * ProtectedRoute Component
 * Guards routes requiring authentication and specific roles
 */
export function ProtectedRoute({ children, allowedRoles = null }) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading, hasAnyRole } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Your role: <strong>{user?.role}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Required roles: <strong>{allowedRoles?.join(', ')}</strong>
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
