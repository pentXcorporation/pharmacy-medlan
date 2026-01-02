/**
 * Supplier Hooks
 * React Query hooks for supplier data management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService } from "@/services";
import { toast } from "sonner";

// Query keys factory
export const supplierKeys = {
  all: ["suppliers"],
  lists: () => [...supplierKeys.all, "list"],
  list: (filters) => [...supplierKeys.lists(), filters],
  details: () => [...supplierKeys.all, "detail"],
  detail: (id) => [...supplierKeys.details(), id],
  search: (query) => [...supplierKeys.all, "search", query],
  active: () => [...supplierKeys.all, "active"],
};

/**
 * Hook to fetch suppliers list
 */
export const useSuppliers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => supplierService.getAll(params),
    select: (response) => response.data?.data, // Extract data from ApiResponse
    ...options,
  });
};

/**
 * Hook to fetch active suppliers
 */
export const useActiveSuppliers = (options = {}) => {
  return useQuery({
    queryKey: supplierKeys.active(),
    queryFn: () => supplierService.getAll({ isActive: true, size: 1000 }),
    select: (response) => response.data?.data?.content || [], // Extract content array from PageResponse
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single supplier
 */
export const useSupplier = (id, options = {}) => {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierService.getById(id),
    select: (response) => response.data?.data, // Extract data from ApiResponse
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to search suppliers
 */
export const useSupplierSearch = (query, options = {}) => {
  return useQuery({
    queryKey: supplierKeys.search(query),
    queryFn: () => supplierService.search(query),
    select: (response) => response.data?.data, // Extract data from ApiResponse
    enabled: Boolean(query) && query.length >= 2,
    ...options,
  });
};

/**
 * Hook to create supplier
 */
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => supplierService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      toast.success("Supplier created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create supplier");
    },
  });
};

/**
 * Hook to update supplier
 */
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => supplierService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) });
      toast.success("Supplier updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update supplier");
    },
  });
};

/**
 * Hook to delete supplier
 */
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => supplierService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      toast.success("Supplier deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete supplier");
    },
  });
};

/**
 * Hook to activate supplier
 */
export const useActivateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => supplierService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      toast.success("Supplier activated");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to activate supplier"
      );
    },
  });
};

/**
 * Hook to deactivate supplier
 */
export const useDeactivateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => supplierService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      toast.success("Supplier deactivated");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to deactivate supplier"
      );
    },
  });
};
