/**
 * Transaction Type Service
 * Handles all transaction type related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const transactionTypeService = {
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.TRANSACTION_TYPES.BASE, { params });
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.TRANSACTION_TYPES.BY_ID(id));
  },

  getByName: (name) => {
    return api.get(API_ENDPOINTS.TRANSACTION_TYPES.BY_NAME(name));
  },

  getActive: () => {
    return api.get(API_ENDPOINTS.TRANSACTION_TYPES.ACTIVE);
  },

  getByIncomeType: (isIncome) => {
    return api.get(API_ENDPOINTS.TRANSACTION_TYPES.BY_INCOME_TYPE(isIncome));
  },

  create: (data) => {
    return api.post(API_ENDPOINTS.TRANSACTION_TYPES.BASE, data);
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.TRANSACTION_TYPES.BY_ID(id), data);
  },

  activate: (id) => {
    return api.put(API_ENDPOINTS.TRANSACTION_TYPES.ACTIVATE(id));
  },

  deactivate: (id) => {
    return api.put(API_ENDPOINTS.TRANSACTION_TYPES.DEACTIVATE(id));
  },

  delete: (id) => {
    return api.delete(API_ENDPOINTS.TRANSACTION_TYPES.BY_ID(id));
  },
};

export default transactionTypeService;
