import api from '../lib/api';

// Branch Service
export const branchService = {
  getAll: (params) => api.get('/api/branches', { params }),
  getAllList: () => api.get('/api/branches/all'),
  getActive: () => api.get('/api/branches/active'),
  getById: (id) => api.get(`/api/branches/${id}`),
  getByCode: (code) => api.get(`/api/branches/code/${code}`),
  create: (data) => api.post('/api/branches', data),
  update: (id, data) => api.put(`/api/branches/${id}`, data),
  delete: (id) => api.delete(`/api/branches/${id}`),
  activate: (id) => api.post(`/api/branches/${id}/activate`),
  deactivate: (id) => api.post(`/api/branches/${id}/deactivate`),
};

// Product Service
export const productService = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  getByCode: (code) => api.get(`/api/products/code/${code}`),
  search: (query) => api.get(`/api/products/search?query=${query}`),
  getLowStock: (branchId) => api.get(`/api/products/low-stock?branchId=${branchId}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
  discontinue: (id) => api.patch(`/api/products/${id}/discontinue`),
};

// Category Service
export const categoryService = {
  getAll: () => api.get('/api/categories'),
  getActive: () => api.get('/api/categories/active'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (params) => api.post('/api/categories', null, { params }),
  update: (id, params) => api.put(`/api/categories/${id}`, null, { params }),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// Supplier Service
export const supplierService = {
  getAll: (params) => api.get('/api/suppliers', { params }),
  getActive: () => api.get('/api/suppliers/active'),
  getById: (id) => api.get(`/api/suppliers/${id}`),
  getByCode: (code) => api.get(`/api/suppliers/code/${code}`),
  search: (query) => api.get(`/api/suppliers/search?query=${query}`),
  create: (data) => api.post('/api/suppliers', data),
  update: (id, data) => api.put(`/api/suppliers/${id}`, data),
  delete: (id) => api.delete(`/api/suppliers/${id}`),
  activate: (id) => api.patch(`/api/suppliers/${id}/activate`),
  deactivate: (id) => api.patch(`/api/suppliers/${id}/deactivate`),
};

// Customer Service
export const customerService = {
  getAll: (params) => api.get('/api/customers', { params }),
  getActive: () => api.get('/api/customers/active'),
  getById: (id) => api.get(`/api/customers/${id}`),
  getByCode: (code) => api.get(`/api/customers/code/${code}`),
  search: (query) => api.get(`/api/customers/search?query=${query}`),
  create: (data) => api.post('/api/customers', data),
  update: (id, data) => api.put(`/api/customers/${id}`, data),
  delete: (id) => api.delete(`/api/customers/${id}`),
  activate: (id) => api.patch(`/api/customers/${id}/activate`),
  deactivate: (id) => api.patch(`/api/customers/${id}/deactivate`),
};

// User Service
export const userService = {
  getAll: (params) => api.get('/api/users', { params }),
  getActive: () => api.get('/api/users/active'),
  getById: (id) => api.get(`/api/users/${id}`),
  getByUsername: (username) => api.get(`/api/users/username/${username}`),
  getByRole: (role) => api.get(`/api/users/role/${role}`),
  getByBranch: (branchId) => api.get(`/api/users/branch/${branchId}`),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
  activate: (id) => api.patch(`/api/users/${id}/activate`),
  deactivate: (id) => api.patch(`/api/users/${id}/deactivate`),
  resetPassword: (id, newPassword) => api.patch(`/api/users/${id}/reset-password?newPassword=${newPassword}`),
};

// Purchase Order Service
export const purchaseOrderService = {
  getAll: (params) => api.get('/api/purchase-orders', { params }),
  getById: (id) => api.get(`/api/purchase-orders/${id}`),
  getByNumber: (number) => api.get(`/api/purchase-orders/number/${number}`),
  getBySupplier: (supplierId) => api.get(`/api/purchase-orders/supplier/${supplierId}`),
  getByBranch: (branchId) => api.get(`/api/purchase-orders/branch/${branchId}`),
  getByStatus: (status) => api.get(`/api/purchase-orders/status/${status}`),
  getByDateRange: (startDate, endDate) => api.get(`/api/purchase-orders/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => api.post('/api/purchase-orders', data),
  delete: (id) => api.delete(`/api/purchase-orders/${id}`),
  approve: (id) => api.post(`/api/purchase-orders/${id}/approve`),
  reject: (id, reason) => api.post(`/api/purchase-orders/${id}/reject?reason=${reason}`),
  updateStatus: (id, status) => api.put(`/api/purchase-orders/${id}/status?status=${status}`),
};

// GRN Service
export const grnService = {
  getAll: (params) => api.get('/api/grn', { params }),
  getById: (id) => api.get(`/api/grn/${id}`),
  getByNumber: (number) => api.get(`/api/grn/number/${number}`),
  getByBranch: (branchId, params) => api.get(`/api/grn/branch/${branchId}`, { params }),
  getBySupplier: (supplierId, params) => api.get(`/api/grn/supplier/${supplierId}`, { params }),
  getByStatus: (status, params) => api.get(`/api/grn/status/${status}`, { params }),
  getByDateRange: (startDate, endDate) => api.get(`/api/grn/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => api.post('/api/grn', data),
  approve: (id) => api.post(`/api/grn/${id}/approve`),
  reject: (id, reason) => api.post(`/api/grn/${id}/reject?reason=${reason}`),
  cancel: (id, reason) => api.post(`/api/grn/${id}/cancel?reason=${reason}`),
};

// Inventory Service
export const inventoryService = {
  getByProductAndBranch: (productId, branchId) => api.get(`/api/inventory/product/${productId}/branch/${branchId}`),
  getByBranch: (branchId, params) => api.get(`/api/inventory/branch/${branchId}`, { params }),
  getLowStock: (branchId) => api.get(`/api/inventory/branch/${branchId}/low-stock`),
  getOutOfStock: (branchId) => api.get(`/api/inventory/branch/${branchId}/out-of-stock`),
  getBatches: (productId, branchId) => api.get(`/api/inventory/batches/product/${productId}/branch/${branchId}`),
  getExpiring: (branchId, alertDate) => api.get(`/api/inventory/branch/${branchId}/expiring?alertDate=${alertDate}`),
  getExpired: (branchId) => api.get(`/api/inventory/branch/${branchId}/expired`),
  getAvailableQuantity: (productId, branchId) => api.get(`/api/inventory/available-quantity/product/${productId}/branch/${branchId}`),
};

// Stock Transfer Service
export const stockTransferService = {
  getAll: (params) => api.get('/api/stock-transfers', { params }),
  getById: (id) => api.get(`/api/stock-transfers/${id}`),
  getByNumber: (number) => api.get(`/api/stock-transfers/number/${number}`),
  getFromBranch: (branchId) => api.get(`/api/stock-transfers/from-branch/${branchId}`),
  getToBranch: (branchId) => api.get(`/api/stock-transfers/to-branch/${branchId}`),
  getByStatus: (status) => api.get(`/api/stock-transfers/status/${status}`),
  getByDateRange: (startDate, endDate) => api.get(`/api/stock-transfers/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => api.post('/api/stock-transfers', data),
};

// Sales Service
export const salesService = {
  getAll: (params) => api.get('/api/sales', { params }),
  getById: (id) => api.get(`/api/sales/${id}`),
  getByNumber: (number) => api.get(`/api/sales/number/${number}`),
  getByBranch: (branchId, params) => api.get(`/api/sales/branch/${branchId}`, { params }),
  getByCustomer: (customerId, params) => api.get(`/api/sales/customer/${customerId}`, { params }),
  getByDateRange: (startDate, endDate) => api.get(`/api/sales/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByBranchAndDateRange: (branchId, startDate, endDate) => api.get(`/api/sales/branch/${branchId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByStatus: (status, params) => api.get(`/api/sales/status/${status}`, { params }),
  getTotalAmount: (branchId, startDate, endDate) => api.get(`/api/sales/branch/${branchId}/total?startDate=${startDate}&endDate=${endDate}`),
  getCount: (branchId, startDate, endDate) => api.get(`/api/sales/branch/${branchId}/count?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => api.post('/api/sales', data),
  cancel: (id, reason) => api.post(`/api/sales/${id}/cancel?reason=${reason}`),
  void: (id, reason) => api.post(`/api/sales/${id}/void?reason=${reason}`),
};

// Dashboard Service
export const dashboardService = {
  getSummary: (branchId) => api.get(`/api/dashboard/summary?branchId=${branchId}`),
};

// Reports Service
export const reportsService = {
  getTotalSales: (branchId, startDate, endDate) => api.get(`/api/reports/sales/total?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`),
  getSalesCount: (branchId, startDate, endDate) => api.get(`/api/reports/sales/count?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`),
  getSalesDetails: (branchId, startDate, endDate) => api.get(`/api/reports/sales/details?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`),
  getDailySales: (branchId, startDate, endDate) => api.get(`/api/reports/sales/daily?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`),
  getTopProducts: (branchId, startDate, endDate, limit = 10) => api.get(`/api/reports/sales/top-products?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}&limit=${limit}`),
};
