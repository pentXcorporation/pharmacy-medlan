import api from './api';
import type {
  LoginRequest,
  LoginResponse,
  ApiResponse,
  PaginatedResponse,
  Branch,
  Product,
  Category,
  Supplier,
  Customer,
  Sale,
  SaleItem,
  PurchaseOrder,
  PurchaseOrderItem,
  GRN,
  GRNItem,
  Inventory,
  User,
  DashboardStats,
} from '@/types';

// Auth Services
export const authService = {
  login: (data: LoginRequest) => 
    api.post<LoginResponse>('/api/auth/login', data),
  
  logout: () => 
    api.post('/api/auth/logout'),
  
  getCurrentUser: () => 
    api.get<ApiResponse<User>>('/api/auth/me'),
  
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    api.post('/api/auth/change-password', data),
};

// Branch Services
export const branchService = {
  getAll: () => 
    api.get<ApiResponse<Branch[]>>('/api/branches/all'),
  
  getActive: () => 
    api.get<ApiResponse<Branch[]>>('/api/branches/active'),
  
  getById: (id: number) => 
    api.get<ApiResponse<Branch>>(`/api/branches/${id}`),
  
  create: (data: Partial<Branch>) => 
    api.post<ApiResponse<Branch>>('/api/branches', data),
  
  update: (id: number, data: Partial<Branch>) => 
    api.put<ApiResponse<Branch>>(`/api/branches/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/api/branches/${id}`),
};

// Category Services
export const categoryService = {
  getAll: () => 
    api.get<ApiResponse<Category[]>>('/api/categories'),
  
  getActive: () => 
    api.get<ApiResponse<Category[]>>('/api/categories/active'),
  
  create: (categoryName: string, categoryCode: string, description?: string) =>
    api.post<ApiResponse<Category>>('/api/categories', null, {
      params: { categoryName, categoryCode, description }
    }),
  
  update: (id: number, categoryName: string, description?: string) =>
    api.put<ApiResponse<Category>>(`/api/categories/${id}`, null, {
      params: { categoryName, description }
    }),
  
  delete: (id: number) => 
    api.delete(`/api/categories/${id}`),
};

// Product Services
export const productService = {
  getAll: (page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<Product>>>('/api/products', {
      params: { page, size }
    }),
  
  getById: (id: number) => 
    api.get<ApiResponse<Product>>(`/api/products/${id}`),
  
  search: (query: string) => 
    api.get<ApiResponse<Product[]>>('/api/products/search', {
      params: { query }
    }),
  
  getLowStock: (branchId: number) => 
    api.get<ApiResponse<Product[]>>('/api/products/low-stock', {
      params: { branchId }
    }),
  
  create: (data: Partial<Product>) => 
    api.post<ApiResponse<Product>>('/api/products', data),
  
  update: (id: number, data: Partial<Product>) => 
    api.put<ApiResponse<Product>>(`/api/products/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/api/products/${id}`),
};

// Supplier Services
export const supplierService = {
  getAll: (page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<Supplier>>>('/api/suppliers', {
      params: { page, size }
    }),
  
  getActive: () => 
    api.get<ApiResponse<Supplier[]>>('/api/suppliers/active'),
  
  search: (query: string) => 
    api.get<ApiResponse<Supplier[]>>('/api/suppliers/search', {
      params: { query }
    }),
  
  create: (data: Partial<Supplier>) => 
    api.post<ApiResponse<Supplier>>('/api/suppliers', data),
  
  update: (id: number, data: Partial<Supplier>) => 
    api.put<ApiResponse<Supplier>>(`/api/suppliers/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/api/suppliers/${id}`),
};

// Customer Services
export const customerService = {
  getAll: (page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<Customer>>>('/api/customers', {
      params: { page, size }
    }),
  
  search: (query: string) => 
    api.get<ApiResponse<Customer[]>>('/api/customers/search', {
      params: { query }
    }),
  
  create: (data: Partial<Customer>) => 
    api.post<ApiResponse<Customer>>('/api/customers', data),
  
  update: (id: number, data: Partial<Customer>) => 
    api.put<ApiResponse<Customer>>(`/api/customers/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/api/customers/${id}`),
};

// Inventory Services
export const inventoryService = {
  getByBranch: (branchId: number, page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<Inventory>>>(`/api/inventory/branch/${branchId}`, {
      params: { page, size }
    }),
  
  getLowStock: (branchId: number) => 
    api.get<ApiResponse<Inventory[]>>(`/api/inventory/branch/${branchId}/low-stock`),
  
  getExpiring: (branchId: number, alertDate: string) => 
    api.get<ApiResponse<Inventory[]>>(`/api/inventory/branch/${branchId}/expiring`, {
      params: { alertDate }
    }),
  
  getAvailableQuantity: (productId: number, branchId: number) => 
    api.get<ApiResponse<number>>(`/api/inventory/available-quantity/product/${productId}/branch/${branchId}`),
};

// Sale Services
export const saleService = {
  getAll: (page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<Sale>>>('/api/sales', {
      params: { page, size }
    }),
  
  getById: (id: number) => 
    api.get<ApiResponse<Sale>>(`/api/sales/${id}`),
  
  getByBranch: (branchId: number, page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<Sale>>>(`/api/sales/branch/${branchId}`, {
      params: { page, size }
    }),
  
  getByDateRange: (startDate: string, endDate: string) => 
    api.get<ApiResponse<Sale[]>>('/api/sales/date-range', {
      params: { startDate, endDate }
    }),
  
  create: (data: {
    customerId?: number;
    branchId: number;
    items: SaleItem[];
    discountAmount: number;
    paymentMethod: string;
    paidAmount: number;
    patientName?: string;
    doctorName?: string;
    remarks?: string;
  }) => 
    api.post<ApiResponse<Sale>>('/api/sales', data),
  
  cancel: (id: number, reason: string) => 
    api.post(`/api/sales/${id}/cancel`, null, {
      params: { reason }
    }),
};

// Purchase Order Services
export const purchaseOrderService = {
  getAll: (page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<PurchaseOrder>>>('/api/purchase-orders', {
      params: { page, size }
    }),
  
  getById: (id: number) => 
    api.get<ApiResponse<PurchaseOrder>>(`/api/purchase-orders/${id}`),
  
  create: (data: {
    supplierId: number;
    branchId: number;
    expectedDeliveryDate: string;
    discountAmount: number;
    remarks?: string;
    items: PurchaseOrderItem[];
  }) => 
    api.post<ApiResponse<PurchaseOrder>>('/api/purchase-orders', data),
  
  approve: (id: number) => 
    api.post(`/api/purchase-orders/${id}/approve`),
  
  reject: (id: number, reason: string) => 
    api.post(`/api/purchase-orders/${id}/reject`, null, {
      params: { reason }
    }),
};

// GRN Services
export const grnService = {
  getAll: (page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<GRN>>>('/api/grn', {
      params: { page, size }
    }),
  
  getById: (id: number) => 
    api.get<ApiResponse<GRN>>(`/api/grn/${id}`),
  
  create: (data: {
    supplierId: number;
    branchId: number;
    purchaseOrderId?: number;
    receivedDate: string;
    supplierInvoiceNumber?: string;
    supplierInvoiceDate?: string;
    remarks?: string;
    items: GRNItem[];
  }) => 
    api.post<ApiResponse<GRN>>('/api/grn', data),
  
  approve: (id: number) => 
    api.post(`/api/grn/${id}/approve`),
};

// Dashboard Services
export const dashboardService = {
  getSummary: (branchId: number) => 
    api.get<ApiResponse<DashboardStats>>('/api/dashboard/summary', {
      params: { branchId }
    }),
};

// User Services
export const userService = {
  getAll: (page = 0, size = 20) => 
    api.get<ApiResponse<PaginatedResponse<User>>>('/api/users', {
      params: { page, size }
    }),
  
  getActive: () => 
    api.get<ApiResponse<User[]>>('/api/users/active'),
  
  create: (data: Partial<User> & { password: string }) => 
    api.post<ApiResponse<User>>('/api/users', data),
  
  update: (id: number, data: Partial<User>) => 
    api.put<ApiResponse<User>>(`/api/users/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/api/users/${id}`),
};
