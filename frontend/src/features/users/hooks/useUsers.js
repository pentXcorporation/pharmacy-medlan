/**
 * User Hooks
 * React Query hooks for user management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";
import { toast } from "sonner";

// Query keys factory
export const userKeys = {
  all: ["users"],
  lists: () => [...userKeys.all, "list"],
  list: (filters) => [...userKeys.lists(), filters],
  details: () => [...userKeys.all, "detail"],
  detail: (id) => [...userKeys.details(), id],
  byRole: (role) => [...userKeys.all, "role", role],
  byBranch: (branchId) => [...userKeys.all, "branch", branchId],
};

/**
 * Hook to fetch users list
 */
export const useUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAll(params),
    select: (response) => response.data.data, // ApiResponse.data contains PageResponse
    ...options,
  });
};

/**
 * Hook to fetch a single user
 */
export const useUser = (id, options = {}) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    select: (response) => response.data.data, // ApiResponse.data contains UserResponse
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to fetch users by role
 */
export const useUsersByRole = (role, options = {}) => {
  return useQuery({
    queryKey: userKeys.byRole(role),
    queryFn: () => userService.getByRole(role),
    select: (response) => response.data.data, // ApiResponse.data contains List<UserResponse>
    enabled: Boolean(role),
    ...options,
  });
};

/**
 * Hook to fetch users by branch
 */
export const useUsersByBranch = (branchId, options = {}) => {
  return useQuery({
    queryKey: userKeys.byBranch(branchId),
    queryFn: () => userService.getByBranch(branchId),
    select: (response) => response.data.data, // ApiResponse.data contains List<UserResponse>
    enabled: Boolean(branchId),
    ...options,
  });
};

/**
 * Hook to create user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });
};

/**
 * Hook to update user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

/**
 * Hook to activate user
 */
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User activated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to activate user");
    },
  });
};

/**
 * Hook to deactivate user
 */
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User deactivated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to deactivate user");
    },
  });
};

/**
 * Hook to reset user password
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (id) => userService.resetPassword(id),
    onSuccess: () => {
      toast.success("Password reset email sent");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });
};
