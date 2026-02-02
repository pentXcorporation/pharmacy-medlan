/**
 * Payroll Service
 * Handles all payroll-related API calls
 */

import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config";

const payrollService = {
  /**
   * Get all payroll records with pagination
   */
  getAll: (params = {}) => {
    // Support branchId parameter
    return api.get(API_ENDPOINTS.PAYROLL.BASE, { params });
  },

  /**
   * Get payroll by ID
   */
  getById: (id) => {
    return api.get(API_ENDPOINTS.PAYROLL.BY_ID(id));
  },

  /**
   * Get payroll by employee ID
   */
  getByEmployee: (employeeId, params = {}) => {
    return api.get(API_ENDPOINTS.PAYROLL.BY_EMPLOYEE(employeeId), { params });
  },

  /**
   * Create new payroll record (pay salary)
   */
  create: (data) => {
    return api.post(API_ENDPOINTS.PAYROLL.BASE, data);
  },

  /**
   * Update payroll record
   */
  update: (id, data) => {
    return api.put(API_ENDPOINTS.PAYROLL.BY_ID(id), data);
  },

  /**
   * Delete payroll record
   */
  delete: (id) => {
    return api.delete(API_ENDPOINTS.PAYROLL.BY_ID(id));
  },

  /**
   * Export payroll data
   */
  export: (params = {}) => {
    return api.get(`${API_ENDPOINTS.PAYROLL.BASE}/export`, {
      params,
      responseType: "blob",
    });
  },

  /**
   * Get all employees
   */
  getAllEmployees: (params = {}) => {
    return api.get("/employees", { params });
  },

  /**
   * Get employee by ID
   */
  getEmployeeById: (id) => {
    return api.get(`/employees/${id}`);
  },
};

export default payrollService;