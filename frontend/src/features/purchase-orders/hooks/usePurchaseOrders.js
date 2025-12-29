/**
 * Purchase Orders Hooks
 * React Query hooks for purchase order management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseOrderService } from "@/services";
import { toast } from "sonner";

// Query keys factory
export const purchaseOrderKeys = {
  all: ["purchaseOrders"],
  lists: () => [...purchaseOrderKeys.all, "list"],
  list: (filters) => [...purchaseOrderKeys.lists(), filters],
  details: () => [...purchaseOrderKeys.all, "detail"],
  detail: (id) => [...purchaseOrderKeys.details(), id],
  pending: () => [...purchaseOrderKeys.all, "pending"],
};

/**
 * Hook to fetch purchase orders list
 */
export const usePurchaseOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: purchaseOrderKeys.list(params),
    queryFn: () => purchaseOrderService.getAll(params),
    ...options,
  });
};

/**
 * Hook to fetch pending purchase orders
 */
export const usePendingPurchaseOrders = (options = {}) => {
  return useQuery({
    queryKey: purchaseOrderKeys.pending(),
    queryFn: () => purchaseOrderService.getPending(),
    ...options,
  });
};

/**
 * Hook to fetch a single purchase order
 */
export const usePurchaseOrder = (id, options = {}) => {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id),
    queryFn: () => purchaseOrderService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to create purchase order
 */
export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => purchaseOrderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success("Purchase order created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create purchase order"
      );
    },
  });
};

/**
 * Hook to update purchase order
 */
export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => purchaseOrderService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) });
      toast.success("Purchase order updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update purchase order"
      );
    },
  });
};

/**
 * Hook to delete purchase order
 */
export const useDeletePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => purchaseOrderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      toast.success("Purchase order deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete purchase order"
      );
    },
  });
};

/**
 * Hook to submit purchase order for approval
 */
export const useSubmitPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => purchaseOrderService.submit(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) });
      toast.success("Purchase order submitted for approval");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to submit purchase order"
      );
    },
  });
};

/**
 * Hook to approve purchase order
 */
export const useApprovePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => purchaseOrderService.approve(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) });
      toast.success("Purchase order approved");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to approve purchase order"
      );
    },
  });
};

/**
 * Hook to reject purchase order
 */
export const useRejectPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => purchaseOrderService.reject(id, reason),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) });
      toast.success("Purchase order rejected");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reject purchase order"
      );
    },
  });
};

/**
 * Hook to cancel purchase order
 */
export const useCancelPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => purchaseOrderService.cancel(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) });
      toast.success("Purchase order cancelled");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel purchase order"
      );
    },
  });
};

/**
 * Hook to receive purchase order (create GRN)
 */
export const useReceivePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => purchaseOrderService.receive(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(id) });
      toast.success("Purchase order received successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to receive purchase order"
      );
    },
  });
};
