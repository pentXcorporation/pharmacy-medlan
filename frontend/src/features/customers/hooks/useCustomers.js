/**
 * Customer Hooks
 * React Query hooks for customer data management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services";
import { toast } from "sonner";

// Query keys factory
export const customerKeys = {
  all: ["customers"],
  lists: () => [...customerKeys.all, "list"],
  list: (filters) => [...customerKeys.lists(), filters],
  details: () => [...customerKeys.all, "detail"],
  detail: (id) => [...customerKeys.details(), id],
  search: (query) => [...customerKeys.all, "search", query],
};

/**
 * Hook to fetch customers list
 */
export const useCustomers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getAll(params),
    ...options,
  });
};

/**
 * Hook to fetch a single customer
 */
export const useCustomer = (id, options = {}) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to search customers
 */
export const useCustomerSearch = (query, options = {}) => {
  return useQuery({
    queryKey: customerKeys.search(query),
    queryFn: () => customerService.search(query),
    enabled: Boolean(query) && query.length >= 2,
    ...options,
  });
};

/**
 * Hook to create customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create customer");
    },
  });
};

/**
 * Hook to update customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => customerService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      toast.success("Customer updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update customer");
    },
  });
};

/**
 * Hook to delete customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete customer");
    },
  });
};

/**
 * Hook to activate customer
 */
export const useActivateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => customerService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer activated");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to activate customer"
      );
    },
  });
};

/**
 * Hook to deactivate customer
 */
export const useDeactivateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => customerService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer deactivated");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to deactivate customer"
      );
    },
  });
};
