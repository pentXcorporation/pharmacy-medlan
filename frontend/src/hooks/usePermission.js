import { useAuthStore } from '../store';
import { hasPermission } from '../config/permissions';

export function usePermission() {
  const { user } = useAuthStore();
  
  const can = (permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };
  
  return { can, userRole: user?.role };
}
