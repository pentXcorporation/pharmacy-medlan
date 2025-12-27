// Inventory Hooks for Pharmacist
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../services';

// Query Keys
export const INVENTORY_QUERY_KEYS = {
  inventory: 'pharmacist-inventory',
  item: 'pharmacist-inventory-item',
  lowStock: 'inventory-low-stock',
  outOfStock: 'inventory-out-of-stock',
  expiring: 'inventory-expiring',
  expired: 'inventory-expired',
  alerts: 'inventory-alerts',
  categories: 'inventory-categories',
  stats: 'inventory-stats',
};

// Inventory List Hook
export const useInventory = (params = {}) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.inventory, params],
    queryFn: () => inventoryService.getInventory(params),
  });
};

// Single Item Hook
export const useInventoryItem = (itemId) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.item, itemId],
    queryFn: () => inventoryService.getInventoryItem(itemId),
    enabled: !!itemId,
  });
};

// Low Stock Items Hook
export const useLowStockItems = (threshold = 10) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.lowStock, threshold],
    queryFn: () => inventoryService.getLowStockItems(threshold),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};

// Out of Stock Items Hook
export const useOutOfStockItems = () => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.outOfStock],
    queryFn: inventoryService.getOutOfStockItems,
    refetchInterval: 5 * 60 * 1000,
  });
};

// Expiring Items Hook
export const useExpiringItems = (daysAhead = 30) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.expiring, daysAhead],
    queryFn: () => inventoryService.getExpiringItems(daysAhead),
  });
};

// Expired Items Hook
export const useExpiredItems = () => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.expired],
    queryFn: inventoryService.getExpiredItems,
  });
};

// Stock Check Hook
export const useStockCheck = (productId, branchId = null) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.item, productId, 'stock', branchId],
    queryFn: () => inventoryService.checkStock(productId, branchId),
    enabled: !!productId,
  });
};

// Stock Movements Hook
export const useStockMovements = (productId, params = {}) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.item, productId, 'movements', params],
    queryFn: () => inventoryService.getStockMovements(productId, params),
    enabled: !!productId,
  });
};

// Batches Hook
export const useBatches = (productId) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.item, productId, 'batches'],
    queryFn: () => inventoryService.getBatches(productId),
    enabled: !!productId,
  });
};

// Inventory Alerts Hook
export const useInventoryAlerts = () => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.alerts],
    queryFn: inventoryService.getInventoryAlerts,
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
  });
};

// Acknowledge Alert Hook
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryService.acknowledgeAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEYS.alerts] });
    },
  });
};

// Categories Hook
export const useInventoryCategories = () => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.categories],
    queryFn: inventoryService.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search Inventory Hook
export const useSearchInventory = (query, filters = {}) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.inventory, 'search', query, filters],
    queryFn: () => inventoryService.searchInventory(query, filters),
    enabled: query?.length >= 2,
  });
};

// Inventory Stats Hook
export const useInventoryStats = (branchId = null) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.stats, branchId],
    queryFn: () => inventoryService.getInventoryStats(branchId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Inventory Summary Hook
export const useInventorySummary = () => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.inventory, 'summary'],
    queryFn: inventoryService.getInventorySummary,
    staleTime: 5 * 60 * 1000,
  });
};

// Shelf Location Hook
export const useShelfLocation = (productId) => {
  return useQuery({
    queryKey: [INVENTORY_QUERY_KEYS.item, productId, 'location'],
    queryFn: () => inventoryService.getShelfLocation(productId),
    enabled: !!productId,
  });
};

// Alert Counts Hook (derived from alerts)
export const useAlertCounts = () => {
  const { data: alerts, ...rest } = useInventoryAlerts();

  const counts = {
    lowStock: alerts?.data?.filter(a => a.type === 'low_stock')?.length || 0,
    outOfStock: alerts?.data?.filter(a => a.type === 'out_of_stock')?.length || 0,
    expiringSoon: alerts?.data?.filter(a => a.type === 'expiring_soon')?.length || 0,
    expired: alerts?.data?.filter(a => a.type === 'expired')?.length || 0,
    total: alerts?.data?.length || 0,
  };

  return { counts, ...rest };
};
