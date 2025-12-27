import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../services/roleService';
import { toast } from 'sonner';

/**
 * useRoles Hook
 * Manages roles and permissions
 */
export function useRoles() {
  const queryClient = useQueryClient();

  const ROLES_KEY = ['roles'];
  const PERMISSIONS_KEY = ['permissions'];

  // Fetch roles
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ROLES_KEY,
    queryFn: roleService.getAll,
  });

  // Fetch permissions
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
  } = useQuery({
    queryKey: PERMISSIONS_KEY,
    queryFn: roleService.getPermissions,
  });

  // Create role mutation
  const createMutation = useMutation({
    mutationFn: roleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success('Role created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create role');
    },
  });

  // Update role mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => roleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success('Role updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update role');
    },
  });

  // Delete role mutation
  const deleteMutation = useMutation({
    mutationFn: roleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success('Role deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete role');
    },
  });

  // Update permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissions }) => 
      roleService.updatePermissions(roleId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success('Permissions updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update permissions');
    },
  });

  return {
    // Data
    roles: rolesData?.data || [],
    permissions: permissionsData?.data || [],
    isLoading: rolesLoading || permissionsLoading,
    error: rolesError,

    // Actions
    createRole: createMutation.mutate,
    updateRole: updateMutation.mutate,
    deleteRole: deleteMutation.mutate,
    updatePermissions: updatePermissionsMutation.mutate,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useRoles;
