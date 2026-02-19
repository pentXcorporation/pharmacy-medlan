/**
 * Unit Service
 * Handles all unit of measure related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const unitService = {
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.UNITS.BASE, { params });
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.UNITS.BY_ID(id));
  },

  getActive: () => {
    return api.get(API_ENDPOINTS.UNITS.ACTIVE);
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.UNITS.BASE, data);
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.UNITS.BY_ID(id), data);
  },

  delete: (id) => {
    return api.delete(API_ENDPOINTS.UNITS.BY_ID(id));
  },
};

export default unitService;
