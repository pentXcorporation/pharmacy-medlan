/**
 * Prescription Service
 * Handles prescription related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const prescriptionService = {
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.PRESCRIPTIONS.BASE, { params });
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.PRESCRIPTIONS.BY_ID(id));
  },

  getByCustomer: (customerId, params = {}) => {
    return api.get(API_ENDPOINTS.PRESCRIPTIONS.BY_CUSTOMER(customerId), { params });
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.PRESCRIPTIONS.BASE, data);
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.PRESCRIPTIONS.BY_ID(id), data);
  },

  delete: (id) => {
    return api.delete(API_ENDPOINTS.PRESCRIPTIONS.BY_ID(id));
  },
};

export default prescriptionService;
