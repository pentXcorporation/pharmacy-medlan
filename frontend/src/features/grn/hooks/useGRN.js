/**
 * GRN Hooks
 * React Query hooks for Goods Received Note management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { grnService, rgrnService } from "@/services";
import { toast } from "sonner";

// Query keys factory
export const grnKeys = {
  all: ["grns"],
  lists: () => [...grnKeys.all, "list"],
  list: (filters) => [...grnKeys.lists(), filters],
  details: () => [...grnKeys.all, "detail"],
  detail: (id) => [...grnKeys.details(), id],
  byPo: (poId) => [...grnKeys.all, "by-po", poId],
};

export const rgrnKeys = {
  all: ["rgrns"],
  lists: () => [...rgrnKeys.all, "list"],
  list: (filters) => [...rgrnKeys.lists(), filters],
  details: () => [...rgrnKeys.all, "detail"],
  detail: (id) => [...rgrnKeys.details(), id],
};

/**
 * Hook to fetch GRN list
 */
export const useGRNs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: grnKeys.list(params),
    queryFn: () => grnService.getAll(params),
    ...options,
  });
};

/**
 * Hook to fetch a single GRN
 */
export const useGRN = (id, options = {}) => {
  return useQuery({
    queryKey: grnKeys.detail(id),
    queryFn: () => grnService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to fetch GRNs by Purchase Order
 */
export const useGRNsByPO = (poId, options = {}) => {
  return useQuery({
    queryKey: grnKeys.byPo(poId),
    queryFn: () => grnService.getByPurchaseOrder(poId),
    enabled: Boolean(poId),
    ...options,
  });
};

/**
 * Hook to create GRN
 */
export const useCreateGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => grnService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grnKeys.all });
      toast.success("GRN created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create GRN");
    },
  });
};

/**
 * Hook to update GRN
 */
export const useUpdateGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => grnService.update(id, data),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: grnKeys.all });
      queryClient.invalidateQueries({ queryKey: grnKeys.detail(id) });
      toast.success("GRN updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update GRN");
    },
  });
};

/**
 * Hook to delete GRN
 */
export const useDeleteGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => grnService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grnKeys.all });
      toast.success("GRN deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete GRN");
    },
  });
};

/**
 * Hook to verify GRN
 */
export const useVerifyGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => grnService.verify(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: grnKeys.all });
      queryClient.invalidateQueries({ queryKey: grnKeys.detail(id) });
      toast.success("GRN verified successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to verify GRN");
    },
  });
};

/**
 * Hook to complete GRN
 */
export const useCompleteGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => grnService.complete(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: grnKeys.all });
      queryClient.invalidateQueries({ queryKey: grnKeys.detail(id) });
      toast.success("GRN completed - stock updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to complete GRN");
    },
  });
};

// ===== RGRN Hooks =====

/**
 * Hook to fetch RGRN list
 */
export const useRGRNs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: rgrnKeys.list(params),
    queryFn: () => rgrnService.getAll(params),
    ...options,
  });
};

/**
 * Hook to fetch a single RGRN
 */
export const useRGRN = (id, options = {}) => {
  return useQuery({
    queryKey: rgrnKeys.detail(id),
    queryFn: () => rgrnService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
};

/**
 * Hook to create RGRN (Return Goods Received Note)
 */
export const useCreateRGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => rgrnService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rgrnKeys.all });
      queryClient.invalidateQueries({ queryKey: grnKeys.all });
      toast.success("Return GRN created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create return GRN"
      );
    },
  });
};

/**
 * Hook to approve RGRN
 */
export const useApproveRGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => rgrnService.approve(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: rgrnKeys.all });
      queryClient.invalidateQueries({ queryKey: rgrnKeys.detail(id) });
      toast.success("Return GRN approved");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to approve return GRN"
      );
    },
  });
};

/**
 * Hook to reject RGRN
 */
export const useRejectRGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => rgrnService.reject(id, reason),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: rgrnKeys.all });
      queryClient.invalidateQueries({ queryKey: rgrnKeys.detail(id) });
      toast.success("Return GRN rejected");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reject return GRN"
      );
    },
  });
};
