/**
 * Sales Hooks
 * React Query hooks for sales/POS management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService, saleReturnService, invoiceService } from "@/services";
import { toast } from "sonner";

// Query keys factory
export const saleKeys = {
  all: ["sales"],
  lists: () => [...saleKeys.all, "list"],
  list: (filters) => [...saleKeys.lists(), filters],
  details: () => [...saleKeys.all, "detail"],
  detail: (id) => [...saleKeys.details(), id],
  held: () => [...saleKeys.all, "held"],
};

export const saleReturnKeys = {
  all: ["saleReturns"],
  lists: () => [...saleReturnKeys.all, "list"],
  list: (filters) => [...saleReturnKeys.lists(), filters],
  details: () => [...saleReturnKeys.all, "detail"],
  detail: (id) => [...saleReturnKeys.details(), id],
};

/**
 * Hook to fetch sales list
 */
export const useSales = (params = {}, options = {}) => {
  return useQuery({
    queryKey: saleKeys.list(params),
    queryFn: () => saleService.getAll(params),
    ...options,
  });
};

/**
 * Hook to fetch held/pending sales
 */
export const useHeldSales = (options = {}) => {
  return useQuery({
    queryKey: saleKeys.held(),
    queryFn: () => saleService.getHeldSales?.() || Promise.resolve([]),
    ...options,
  });
};

/**
 * Hook to fetch a single sale
 */
export const useSale = (id, options = {}) => {
  return useQuery({
    queryKey: saleKeys.detail(id),
    queryFn: () => saleService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to create sale (checkout)
 */
export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => saleService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: saleKeys.all });
      toast.success(`Sale completed! Invoice: ${data?.invoiceNumber || ""}`);
      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to complete sale");
    },
  });
};

/**
 * Hook to hold/save sale for later
 */
export const useHoldSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => saleService.holdSale?.(data) || Promise.resolve(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: saleKeys.held() });
      toast.success("Sale held for later");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to hold sale");
    },
  });
};

/**
 * Hook to void a sale
 */
export const useVoidSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) =>
      saleService.voidSale?.(id, reason) || Promise.resolve(),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: saleKeys.all });
      queryClient.invalidateQueries({ queryKey: saleKeys.detail(id) });
      toast.success("Sale voided");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to void sale");
    },
  });
};

// ===== Sale Returns Hooks =====

/**
 * Hook to fetch sale returns list
 */
export const useSaleReturns = (params = {}, options = {}) => {
  return useQuery({
    queryKey: saleReturnKeys.list(params),
    queryFn: () => saleReturnService.getAll(params),
    ...options,
  });
};

/**
 * Hook to fetch a single sale return
 */
export const useSaleReturn = (id, options = {}) => {
  return useQuery({
    queryKey: saleReturnKeys.detail(id),
    queryFn: () => saleReturnService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to create sale return
 */
export const useCreateSaleReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => saleReturnService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: saleReturnKeys.all });
      queryClient.invalidateQueries({ queryKey: saleKeys.all });
      toast.success("Sale return processed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to process return");
    },
  });
};

/**
 * Hook to approve sale return
 */
export const useApproveSaleReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => saleReturnService.approve(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: saleReturnKeys.all });
      queryClient.invalidateQueries({ queryKey: saleReturnKeys.detail(id) });
      toast.success("Return approved");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to approve return");
    },
  });
};
