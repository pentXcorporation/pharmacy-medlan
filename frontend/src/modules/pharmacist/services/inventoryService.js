// Pharmacist Services - Inventory Service
import apiClient from '@/lib/api';

const inventoryService = {
  // Inventory List
  getInventory: async (params = {}) => {
    const response = await apiClient.get('/inventory', { params });
    return response.data;
  },

  getInventoryItem: async (itemId) => {
    const response = await apiClient.get(`/inventory/${itemId}`);
    return response.data;
  },

  // Stock Levels
  getLowStockItems: async (threshold) => {
    const response = await apiClient.get('/inventory/low-stock', { 
      params: { threshold } 
    });
    return response.data;
  },

  getOutOfStockItems: async () => {
    const response = await apiClient.get('/inventory/out-of-stock');
    return response.data;
  },

  getExpiringItems: async (daysAhead = 30) => {
    const response = await apiClient.get('/inventory/expiring', { 
      params: { days: daysAhead } 
    });
    return response.data;
  },

  getExpiredItems: async () => {
    const response = await apiClient.get('/inventory/expired');
    return response.data;
  },

  // Stock Check
  checkStock: async (productId, branchId = null) => {
    const params = branchId ? { branchId } : {};
    const response = await apiClient.get(`/inventory/${productId}/stock`, { params });
    return response.data;
  },

  getStockMovements: async (productId, params = {}) => {
    const response = await apiClient.get(`/inventory/${productId}/movements`, { params });
    return response.data;
  },

  // Batch & Lot
  getBatches: async (productId) => {
    const response = await apiClient.get(`/inventory/${productId}/batches`);
    return response.data;
  },

  getBatchDetails: async (batchId) => {
    const response = await apiClient.get(`/inventory/batches/${batchId}`);
    return response.data;
  },

  // Alerts
  getInventoryAlerts: async () => {
    const response = await apiClient.get('/inventory/alerts');
    return response.data;
  },

  acknowledgeAlert: async (alertId) => {
    const response = await apiClient.patch(`/inventory/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get('/inventory/categories');
    return response.data;
  },

  // Search
  searchInventory: async (query, filters = {}) => {
    const response = await apiClient.get('/inventory/search', { 
      params: { q: query, ...filters } 
    });
    return response.data;
  },

  // Statistics
  getInventoryStats: async (branchId = null) => {
    const params = branchId ? { branchId } : {};
    const response = await apiClient.get('/inventory/stats', { params });
    return response.data;
  },

  getInventorySummary: async () => {
    const response = await apiClient.get('/inventory/summary');
    return response.data;
  },

  // Shelf Location
  getShelfLocation: async (productId) => {
    const response = await apiClient.get(`/inventory/${productId}/location`);
    return response.data;
  },

  // Reports (Read-only for pharmacist)
  getStockReport: async (params = {}) => {
    const response = await apiClient.get('/inventory/reports/stock', { params });
    return response.data;
  },

  getExpiryReport: async (params = {}) => {
    const response = await apiClient.get('/inventory/reports/expiry', { params });
    return response.data;
  },
};

export default inventoryService;
