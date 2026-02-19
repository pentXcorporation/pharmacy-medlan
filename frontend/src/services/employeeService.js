/**
 * Employee Service
 * Handles employee CRUD operations
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const employeeService = {
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.EMPLOYEES.BASE, { params });
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.EMPLOYEES.BASE, data);
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.EMPLOYEES.BY_ID(id), data);
  },

  delete: (id) => {
    return api.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
  },
};

export default employeeService;
