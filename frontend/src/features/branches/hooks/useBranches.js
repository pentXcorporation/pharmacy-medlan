/**
 * Branch Hooks
 * React Query hooks for branch management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { branchService } from "@/services";
import { toast } from "sonner";

// Query keys factory
export const branchKeys = {
  all: ["branches"],
  lists: () => [...branchKeys.all, "list"],
  list: (filters) => [...branchKeys.lists(), filters],
  details: () => [...branchKeys.all, "detail"],
  detail: (id) => [...branchKeys.details(), id],
  active: () => [...branchKeys.all, "active"],
};

/**
 * Hook to fetch branches list
 */
export const useBranches = (params = {}, options = {}) => {
  return useQuery({
    queryKey: branchKeys.list(params),
    queryFn: () => branchService.getAll(params),
    select: (response) => response.data.data, // ApiResponse.data contains PageResponse or List
    ...options,
  });
};

/**
 * Hook to fetch active branches (for dropdowns)
 */
export const useActiveBranches = (options = {}) => {
  return useQuery({
    queryKey: branchKeys.active(),
    queryFn: () => branchService.getAllList(),
    select: (response) => {
      const data = response.data.data; // ApiResponse.data contains List
      return Array.isArray(data) ? data.filter((b) => b.isActive) : [];
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single branch
 */
export const useBranch = (id, options = {}) => {
  return useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => branchService.getById(id),
    select: (response) => response.data.data, // ApiResponse.data contains BranchResponse
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to create branch
 */
export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => branchService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      toast.success("Branch created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create branch");
    },
  });
};

/**
 * Hook to update branch
 */
export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => branchService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      queryClient.invalidateQueries({ queryKey: branchKeys.detail(id) });
      toast.success("Branch updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update branch");
    },
  });
};

/**
 * Hook to delete branch
 */
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => branchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      toast.success("Branch deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete branch");
    },
  });
};

/**
 * Hook to activate branch
 */
export const useActivateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => branchService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      toast.success("Branch activated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to activate branch");
    },
  });
};

/**
 * Hook to deactivate branch
 */
export const useDeactivateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => branchService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
      toast.success("Branch deactivated");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to deactivate branch"
      );
    },
  });
};
