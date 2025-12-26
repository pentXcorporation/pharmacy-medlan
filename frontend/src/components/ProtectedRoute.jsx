import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { canAccessRoute } from '../config/permissions';

export function ProtectedRoute({ children, path }) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!canAccessRoute(user.role, path)) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  return children;
}
