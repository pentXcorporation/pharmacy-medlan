import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { toast } from 'sonner';

/**
 * useUsers Hook
 * Manages user data fetching and mutations
 */
export function useUsers(params = {}) {
  const queryClient = useQueryClient();

  // Query keys
  const USERS_KEY = ['users', params];
  const ACTIVE_USERS_KEY = ['users', 'active'];

  // Fetch users with pagination
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: USERS_KEY,
    queryFn: () => userService.getAll(params),
  });

  // Fetch active users
  const { data: activeUsers } = useQuery({
    queryKey: ACTIVE_USERS_KEY,
    queryFn: userService.getActive,
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  // Activate user mutation
  const activateMutation = useMutation({
    mutationFn: userService.activate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User activated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to activate user');
    },
  });

  // Deactivate user mutation
  const deactivateMutation = useMutation({
    mutationFn: userService.deactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deactivated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to deactivate user');
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, newPassword }) => userService.resetPassword(id, newPassword),
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });

  return {
    // Data
    users: usersData?.data || [],
    totalUsers: usersData?.total || 0,
    activeUsers: activeUsers?.data || [],
    isLoading,
    error,

    // Actions
    refetch,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    activateUser: activateMutation.mutate,
    deactivateUser: deactivateMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,

    // Loading states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useUsers;
