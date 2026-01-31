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
    select: (response) => response.data?.data || response.data || response,
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
    select: (response) => response.data?.data || response.data || response,
    enabled: Boolean(id),
    staleTime: 30 * 60 * 1000, // 30 minutes - prevent unnecessary refetches
    refetchOnMount: false, // Don't refetch on mount if data is already in cache
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
    select: (response) => response.data?.data?.content || response.data?.content || [],
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
    mutationFn: async (data) => {
      // Create GRN (will be DRAFT status in backend)
      const createResponse = await grnService.create(data);
      
      // Return the full response so calling code can extract the GRN ID
      return createResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grnKeys.lists() });
      // Automatically refresh ALL inventory data after GRN creation (using partial matching)
      // Remove refetchType to ensure all inventory queries are invalidated, not just active ones
      queryClient.invalidateQueries({ 
        queryKey: ["inventory"],
        exact: false
      });
      // Refresh purchase orders as GRN affects PO status (partially/fully received)
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
      
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
      queryClient.invalidateQueries({ queryKey: grnKeys.lists() });
      // Automatically refresh inventory data after GRN update
      queryClient.invalidateQueries({ 
        queryKey: ["inventory"],
        exact: false
      });
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
      queryClient.invalidateQueries({ queryKey: grnKeys.lists() });
      toast.success("GRN deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete GRN");
    },
  });
};

/**
 * Hook to approve GRN
 * IMPORTANT: This is the method that actually updates inventory in the database!
 * 
 * Backend behavior when this is called:
 * 1. Creates InventoryBatch records for each GRN line item
 * 2. Updates product stock quantities (quantityAvailable)
 * 3. Changes GRN status from DRAFT/PENDING_APPROVAL → RECEIVED
 * 4. Records approval user and timestamp
 * 
 * Use this hook for: verify, complete, or approve actions in the UI
 */
export const useApproveGRN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => grnService.approve(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: grnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grnKeys.detail(id) });
      // Automatically refresh inventory data after GRN approval
      queryClient.invalidateQueries({ 
        queryKey: ["inventory"],
        exact: false
      });
      // Refresh purchase orders as approving GRN affects PO status
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] });
      toast.success("GRN approved - inventory updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to approve GRN");
    },
  });
};

/**
 * @deprecated Use useApproveGRN instead - verify is an alias for approve
 * Kept for backwards compatibility
 */
export const useVerifyGRN = () => {
  console.warn('useVerifyGRN is deprecated. Use useApproveGRN instead.');
  return useApproveGRN();
};

/**
 * @deprecated Use useApproveGRN instead - complete is an alias for approve
 * Kept for backwards compatibility
 */
export const useCompleteGRN = () => {
  console.warn('useCompleteGRN is deprecated. Use useApproveGRN instead.');
  return useApproveGRN();
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
    staleTime: 30 * 60 * 1000, // 30 minutes - prevent unnecessary refetches
    refetchOnMount: false, // Don't refetch on mount if data is already in cache
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
      queryClient.invalidateQueries({ queryKey: rgrnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grnKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: rgrnKeys.lists() });
      // Automatically refresh inventory data after RGRN approval (returns reduce stock)
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
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
      queryClient.invalidateQueries({ queryKey: rgrnKeys.lists() });
      toast.success("Return GRN rejected");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reject return GRN"
      );
    },
  });
};
