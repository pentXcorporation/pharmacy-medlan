import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDefaultPathForRole } from '../../utils/authHelpers';
import { Spinner } from '@/shared/components/ui/Spinner';

/**
 * RoleBasedRedirect Component
 * Redirects users to their role-specific dashboard
 */
export function RoleBasedRedirect() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const defaultPath = getDefaultPathForRole(user.role);
  
  return <Navigate to={defaultPath} replace />;
}

export default RoleBasedRedirect;
