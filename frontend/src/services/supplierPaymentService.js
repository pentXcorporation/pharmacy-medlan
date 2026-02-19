/**
 * Supplier Payment Service
 * Handles all supplier payment related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const supplierPaymentService = {
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.SUPPLIER_PAYMENTS.BASE, { params });
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.SUPPLIER_PAYMENTS.BY_ID(id));
  },

  getBySupplier: (supplierId, params = {}) => {
    return api.get(API_ENDPOINTS.SUPPLIER_PAYMENTS.BY_SUPPLIER(supplierId), { params });
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.SUPPLIER_PAYMENTS.BASE, data);
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.SUPPLIER_PAYMENTS.BY_ID(id), data);
  },

  delete: (id) => {
    return api.delete(API_ENDPOINTS.SUPPLIER_PAYMENTS.BY_ID(id));
  },
};

export default supplierPaymentService;
