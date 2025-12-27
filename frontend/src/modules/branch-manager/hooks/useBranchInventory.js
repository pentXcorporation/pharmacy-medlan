import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchInventoryService } from '../services';

/**
 * Branch Inventory Hooks
 */

// Query keys
const INVENTORY_KEYS = {
  all: ['branch', 'inventory'],
  list: (params) => [...INVENTORY_KEYS.all, 'list', params],
  lowStock: () => [...INVENTORY_KEYS.all, 'low-stock'],
  expiring: (days) => [...INVENTORY_KEYS.all, 'expiring', days],
  expired: () => [...INVENTORY_KEYS.all, 'expired'],
  transfers: (params) => [...INVENTORY_KEYS.all, 'transfers', params],
  value: () => [...INVENTORY_KEYS.all, 'value'],
  movement: (productId, params) => [...INVENTORY_KEYS.all, 'movement', productId, params],
  branches: () => [...INVENTORY_KEYS.all, 'branches'],
};

/**
 * Hook to get branch inventory
 */
export const useBranchInventory = (params = {}) => {
  return useQuery({
    queryKey: INVENTORY_KEYS.list(params),
    queryFn: () => branchInventoryService.getInventory(params),
  });
};

/**
 * Hook to get low stock items
 */
export const useLowStockItems = () => {
  return useQuery({
    queryKey: INVENTORY_KEYS.lowStock(),
    queryFn: branchInventoryService.getLowStockItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get expiring items
 */
export const useExpiringItems = (days = 30) => {
  return useQuery({
    queryKey: INVENTORY_KEYS.expiring(days),
    queryFn: () => branchInventoryService.getExpiringItems(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get expired items
 */
export const useExpiredItems = () => {
  return useQuery({
    queryKey: INVENTORY_KEYS.expired(),
    queryFn: branchInventoryService.getExpiredItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to update stock
 */
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity, reason }) =>
      branchInventoryService.updateStock(productId, quantity, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
};

/**
 * Hook to request stock transfer
 */
export const useRequestTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchInventoryService.requestTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.transfers({}) });
    },
  });
};

/**
 * Hook to get transfer requests
 */
export const useTransferRequests = (params = {}) => {
  return useQuery({
    queryKey: INVENTORY_KEYS.transfers(params),
    queryFn: () => branchInventoryService.getTransferRequests(params),
  });
};

/**
 * Hook to approve transfer
 */
export const useApproveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchInventoryService.approveTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.transfers({}) });
    },
  });
};

/**
 * Hook to reject transfer
 */
export const useRejectTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transferId, reason }) =>
      branchInventoryService.rejectTransfer(transferId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.transfers({}) });
    },
  });
};

/**
 * Hook to ship transfer
 */
export const useShipTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: branchInventoryService.shipTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.transfers({}) });
    },
  });
};

/**
 * Hook to receive transfer
 */
export const useReceiveTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transferId, receivedItems }) =>
      branchInventoryService.receiveTransfer(transferId, receivedItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
    },
  });
};

/**
 * Hook to get inventory value
 */
export const useInventoryValue = () => {
  return useQuery({
    queryKey: INVENTORY_KEYS.value(),
    queryFn: branchInventoryService.getInventoryValue,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to get stock movement history
 */
export const useStockMovement = (productId, params = {}) => {
  return useQuery({
    queryKey: INVENTORY_KEYS.movement(productId, params),
    queryFn: () => branchInventoryService.getStockMovement(productId, params),
    enabled: !!productId,
  });
};

/**
 * Hook to request restock
 */
export const useRequestRestock = () => {
  return useMutation({
    mutationFn: branchInventoryService.requestRestock,
  });
};

/**
 * Hook to get available branches for transfer
 */
export const useAvailableBranches = () => {
  return useQuery({
    queryKey: INVENTORY_KEYS.branches(),
    queryFn: branchInventoryService.getAvailableBranches,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
