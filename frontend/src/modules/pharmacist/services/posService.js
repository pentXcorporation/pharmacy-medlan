// Pharmacist Services - POS Service
import apiClient from '@/lib/api';

const posService = {
  // Cart & Sales
  createSale: async (saleData) => {
    const response = await apiClient.post('/sales', saleData);
    return response.data;
  },

  getSaleById: async (saleId) => {
    const response = await apiClient.get(`/sales/${saleId}`);
    return response.data;
  },

  voidSale: async (saleId, reason) => {
    const response = await apiClient.post(`/sales/${saleId}/void`, { reason });
    return response.data;
  },

  getTodaySales: async (params = {}) => {
    const response = await apiClient.get('/sales/today', { params });
    return response.data;
  },

  // Products
  searchProducts: async (query, params = {}) => {
    const response = await apiClient.get('/products/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  getProductByBarcode: async (barcode) => {
    const response = await apiClient.get(`/products/barcode/${barcode}`);
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },

  checkProductStock: async (productId, quantity) => {
    const response = await apiClient.get(`/products/${productId}/stock-check`, {
      params: { quantity },
    });
    return response.data;
  },

  // Customers
  searchCustomers: async (query) => {
    const response = await apiClient.get('/customers/search', { 
      params: { q: query } 
    });
    return response.data;
  },

  getCustomerById: async (customerId) => {
    const response = await apiClient.get(`/customers/${customerId}`);
    return response.data;
  },

  createQuickCustomer: async (customerData) => {
    const response = await apiClient.post('/customers/quick', customerData);
    return response.data;
  },

  // Payment
  processPayment: async (paymentData) => {
    const response = await apiClient.post('/payments', paymentData);
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await apiClient.get('/payments/methods');
    return response.data;
  },

  // Receipts
  generateReceipt: async (saleId, format = 'thermal') => {
    const response = await apiClient.get(`/sales/${saleId}/receipt`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  emailReceipt: async (saleId, email) => {
    const response = await apiClient.post(`/sales/${saleId}/receipt/email`, { email });
    return response.data;
  },

  // Shift Management
  startShift: async (branchId) => {
    const response = await apiClient.post('/shifts/start', { branchId });
    return response.data;
  },

  endShift: async (shiftId, closingData) => {
    const response = await apiClient.post(`/shifts/${shiftId}/end`, closingData);
    return response.data;
  },

  getCurrentShift: async () => {
    const response = await apiClient.get('/shifts/current');
    return response.data;
  },

  getShiftSummary: async (shiftId) => {
    const response = await apiClient.get(`/shifts/${shiftId}/summary`);
    return response.data;
  },

  // Discounts & Promotions
  validateDiscount: async (code) => {
    const response = await apiClient.get(`/discounts/validate/${code}`);
    return response.data;
  },

  getActivePromotions: async () => {
    const response = await apiClient.get('/promotions/active');
    return response.data;
  },

  // Returns
  createReturn: async (returnData) => {
    const response = await apiClient.post('/returns', returnData);
    return response.data;
  },

  getSaleForReturn: async (saleId) => {
    const response = await apiClient.get(`/sales/${saleId}/return-info`);
    return response.data;
  },
};

export default posService;
