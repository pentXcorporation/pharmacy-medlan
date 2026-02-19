/**
 * Customer Prescription Service
 * Handles customer prescription related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const customerPrescriptionService = {
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.CUSTOMER_PRESCRIPTIONS.BASE, { params });
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.CUSTOMER_PRESCRIPTIONS.BY_ID(id));
  },

  getByCustomer: (customerId, params = {}) => {
    return api.get(API_ENDPOINTS.CUSTOMER_PRESCRIPTIONS.BY_CUSTOMER(customerId), { params });
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.CUSTOMER_PRESCRIPTIONS.BASE, data);
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.CUSTOMER_PRESCRIPTIONS.BY_ID(id), data);
  },

  delete: (id) => {
    return api.delete(API_ENDPOINTS.CUSTOMER_PRESCRIPTIONS.BY_ID(id));
  },
};

export default customerPrescriptionService;
