/**
 * Employee Authorization Service
 * Handles employee authorization request/approval flows
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const employeeAuthService = {
  /**
   * Submit an authorization request
   */
  request: (data) => {
    return api.post(API_ENDPOINTS.EMPLOYEE_AUTH.REQUEST, data);
  },

  /**
   * Approve an authorization request
   */
  approve: (id, data = {}) => {
    return api.put(API_ENDPOINTS.EMPLOYEE_AUTH.APPROVE(id), data);
  },

  /**
   * Reject an authorization request
   */
  reject: (id, data = {}) => {
    return api.put(API_ENDPOINTS.EMPLOYEE_AUTH.REJECT(id), data);
  },

  /**
   * Get authorization by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.EMPLOYEE_AUTH.BY_ID(id));
  },

  /**
   * Get authorization by code
   */
  getByCode: (code) => {
    return api.get(API_ENDPOINTS.EMPLOYEE_AUTH.BY_CODE(code));
  },

  /**
   * Get authorizations by employee
   */
  getByEmployee: (employeeId, params = {}) => {
    return api.get(API_ENDPOINTS.EMPLOYEE_AUTH.BY_EMPLOYEE(employeeId), { params });
  },

  /**
   * Get authorizations by status
   */
  getByStatus: (status, params = {}) => {
    return api.get(API_ENDPOINTS.EMPLOYEE_AUTH.BY_STATUS(status), { params });
  },

  /**
   * Get pending authorizations for a branch
   */
  getPending: (branchId, params = {}) => {
    return api.get(API_ENDPOINTS.EMPLOYEE_AUTH.PENDING(branchId), { params });
  },

  /**
   * Validate an authorization code
   */
  validate: (code) => {
    return api.get(API_ENDPOINTS.EMPLOYEE_AUTH.VALIDATE(code));
  },
};

export default employeeAuthService;
