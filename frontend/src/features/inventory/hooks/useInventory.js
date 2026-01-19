/**
 * Inventory Hooks
 * React Query hooks for inventory data management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService, stockTransferService } from "@/services";
import { toast } from "sonner";

// Query keys factory
export const inventoryKeys = {
  all: ["inventory"],
  stock: () => [...inventoryKeys.all, "stock"],
  stockByBranch: (branchId) => [...inventoryKeys.stock(), branchId],
  lowStock: () => [...inventoryKeys.all, "low-stock"],
  expiring: () => [...inventoryKeys.all, "expiring"],
  expired: () => [...inventoryKeys.all, "expired"],
};

export const stockTransferKeys = {
  all: ["stock-transfers"],
  lists: () => [...stockTransferKeys.all, "list"],
  list: (filters) => [...stockTransferKeys.lists(), filters],
  details: () => [...stockTransferKeys.all, "detail"],
  detail: (id) => [...stockTransferKeys.details(), id],
  pending: () => [...stockTransferKeys.all, "pending"],
};

/**
 * Hook to fetch stock levels by branch
 */
export const useStockByBranch = (branchId, options = {}) => {
  return useQuery({
    queryKey: inventoryKeys.stockByBranch(branchId),
    queryFn: () => inventoryService.getStockByBranch(branchId),
    enabled: Boolean(branchId),
    ...options,
  });
};

/**
 * Hook to fetch inventory by branch (paginated)
 */
export const useInventory = (branchId, params = {}, options = {}) => {
  return useQuery({
    queryKey: [...inventoryKeys.stockByBranch(branchId), params],
    queryFn: async () => {
      const response = await inventoryService.getByBranch(branchId, params);
      console.log('useInventory - full axios response:', response);
      console.log('useInventory - response.data:', response.data);
      console.log('useInventory - response.data.data:', response.data?.data);
      // Extract the data from the ApiResponse wrapper
      return response.data?.data || response.data;
    },
    enabled: Boolean(branchId),
    ...options,
  });
};

/**
 * Hook to fetch low stock products
 */
export const useLowStockProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...inventoryKeys.lowStock(), params],
    queryFn: () => inventoryService.getLowStockProducts(params),
    ...options,
  });
};

/**
 * Hook to fetch expiring products
 */
export const useExpiringProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...inventoryKeys.expiring(), params],
    queryFn: () => inventoryService.getExpiringProducts(params),
    ...options,
  });
};

/**
 * Hook to fetch expired products
 */
export const useExpiredProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...inventoryKeys.expired(), params],
    queryFn: () => inventoryService.getExpiredProducts(params),
    ...options,
  });
};

/**
 * Hook to fetch stock transfers list
 */
export const useStockTransfers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: stockTransferKeys.list(params),
    queryFn: () => stockTransferService.getAll(params),
    ...options,
  });
};

/**
 * Hook to fetch a single stock transfer
 */
export const useStockTransfer = (id, options = {}) => {
  return useQuery({
    queryKey: stockTransferKeys.detail(id),
    queryFn: () => stockTransferService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to fetch pending stock transfers
 */
export const usePendingStockTransfers = (options = {}) => {
  return useQuery({
    queryKey: stockTransferKeys.pending(),
    queryFn: () => stockTransferService.getPending(),
    ...options,
  });
};

/**
 * Hook to create stock transfer
 */
export const useCreateStockTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => stockTransferService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.all });
      toast.success("Stock transfer created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create stock transfer"
      );
    },
  });
};

/**
 * Hook to approve stock transfer
 */
export const useApproveStockTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => stockTransferService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success("Stock transfer approved successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to approve stock transfer"
      );
    },
  });
};

/**
 * Hook to reject stock transfer
 */
export const useRejectStockTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => stockTransferService.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.all });
      toast.success("Stock transfer rejected");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reject stock transfer"
      );
    },
  });
};

/**
 * Hook to dispatch stock transfer
 */
export const useDispatchStockTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => stockTransferService.dispatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.all });
      toast.success("Stock transfer dispatched");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to dispatch stock transfer"
      );
    },
  });
};

/**
 * Hook to receive stock transfer
 */
export const useReceiveStockTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => stockTransferService.receive(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success("Stock transfer received successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to receive stock transfer"
      );
    },
  });
};
