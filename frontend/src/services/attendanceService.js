/**
 * Attendance Service
 * API calls for attendance management
 */

import api from "@/utils/api";

const BASE_URL = "/attendance";

export const attendanceService = {
  /**
   * Get paginated attendance records
   */
  getAll: (params = {}) => {
    const { page = 0, size = 10, sort = "date,desc", search, date, status } = params;
    return api.get(BASE_URL, {
      params: { page, size, sort, search, date, status },
    });
  },

  /**
   * Get attendance by ID
   */
  getById: (id) => {
    return api.get(`${BASE_URL}/${id}`);
  },

  /**
   * Create attendance record
   */
  create: (data) => {
    return api.post(BASE_URL, data);
  },

  /**
   * Update attendance record
   */
  update: (id, data) => {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete attendance record
   */
  delete: (id) => {
    return api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Get today's attendance statistics
   */
  getTodayStats: () => {
    return api.get(`${BASE_URL}/stats/today`);
  },

  /**
   * Get employee attendance by date range
   */
  getEmployeeAttendance: (employeeId, startDate, endDate) => {
    return api.get(`${BASE_URL}/employee/${employeeId}`, {
      params: { startDate, endDate },
    });
  },

  /**
   * Approve attendance record
   */
  approve: (id, approvedBy) => {
    return api.put(`${BASE_URL}/${id}/approve`, null, {
      params: { approvedBy },
    });
  },
};

export default attendanceService;
