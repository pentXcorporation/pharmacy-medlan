// Auth Types
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'BRANCH_MANAGER' | 'PHARMACIST' | 'CASHIER' | 'INVENTORY_MANAGER' | 'ACCOUNTANT';
  active: boolean;
  branchId?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
  };
}

// Branch Types
export interface Branch {
  id: number;
  branchCode: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
  email: string;
  gstinNumber?: string;
  drugLicenseNumber?: string;
  isMainBranch: boolean;
  active: boolean;
}

// Product Types
export interface Product {
  id: number;
  productCode: string;
  productName: string;
  genericName?: string;
  categoryId: number;
  categoryName?: string;
  dosageForm: string;
  strength?: string;
  drugSchedule: string;
  manufacturer?: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  profitMargin: number;
  gstRate: number;
  reorderLevel: number;
  minimumStock: number;
  maximumStock: number;
  isPrescriptionRequired: boolean;
  isNarcotic: boolean;
  active: boolean;
}

// Category Types
export interface Category {
  id: number;
  categoryCode: string;
  categoryName: string;
  description?: string;
  active: boolean;
}

// Supplier Types
export interface Supplier {
  id: number;
  supplierCode: string;
  supplierName: string;
  contactPerson?: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstinNumber?: string;
  defaultDiscountPercent: number;
  paymentTermDays: number;
  creditLimit: number;
  active: boolean;
}

// Customer Types
export interface Customer {
  id: number;
  customerCode: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  creditLimit: number;
  active: boolean;
}

// Inventory Types
export interface InventoryBatch {
  id: number;
  productId: number;
  productName: string;
  branchId: number;
  batchNumber: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  manufacturingDate: string;
  expiryDate: string;
  available: boolean;
}

export interface Inventory {
  productId: number;
  productName: string;
  branchId: number;
  totalQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  batches: InventoryBatch[];
}

// Sale Types
export interface SaleItem {
  productId: number;
  inventoryBatchId?: number;
  quantity: number;
  unitPrice?: number;
  discountAmount: number;
}

export interface Sale {
  id: number;
  saleNumber: string;
  customerId?: number;
  customerName?: string;
  branchId: number;
  items: SaleItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'CHEQUE' | 'BANK_TRANSFER' | 'CREDIT';
  paidAmount: number;
  changeAmount: number;
  status: string;
  createdAt: string;
}

// Purchase Order Types
export interface PurchaseOrderItem {
  productId: number;
  quantityOrdered: number;
  unitPrice: number;
  discountPercent: number;
  gstRate: number;
  remarks?: string;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  supplierName?: string;
  branchId: number;
  expectedDeliveryDate: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  items: PurchaseOrderItem[];
  createdAt: string;
}

// GRN Types
export interface GRNItem {
  productId: number;
  batchNumber: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  manufacturingDate: string;
  expiryDate: string;
  discountAmount: number;
}

export interface GRN {
  id: number;
  grnNumber: string;
  supplierId: number;
  branchId: number;
  purchaseOrderId?: number;
  receivedDate: string;
  supplierInvoiceNumber?: string;
  status: string;
  items: GRNItem[];
  totalAmount: number;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalSales: number;
  salesCount: number;
  lowStockCount: number;
  expiringItemsCount: number;
  todaySales: number;
  monthSales: number;
}
