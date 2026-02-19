/**
 * Branch Staff Service
 * Handles branch-staff assignment operations
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const branchStaffService = {
  getAll: (params = {}) => {
    return api.get(API_ENDPOINTS.BRANCH_STAFF.BASE, { params });
  },

  getById: (id) => {
    return api.get(API_ENDPOINTS.BRANCH_STAFF.BY_ID(id));
  },

  getByBranch: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.BRANCH_STAFF.BY_BRANCH(branchId), { params });
  },

  getByUser: (userId) => {
    return api.get(API_ENDPOINTS.BRANCH_STAFF.BY_USER(userId));
  },

  getPrimaryBranch: (userId) => {
    return api.get(API_ENDPOINTS.BRANCH_STAFF.PRIMARY(userId));
  },

  assign: (data) => {
    return api.post(API_ENDPOINTS.BRANCH_STAFF.BASE, data);
  },

  update: (id, data) => {
    return api.put(API_ENDPOINTS.BRANCH_STAFF.BY_ID(id), data);
  },

  remove: (id) => {
    return api.delete(API_ENDPOINTS.BRANCH_STAFF.BY_ID(id));
  },
};

export default branchStaffService;
