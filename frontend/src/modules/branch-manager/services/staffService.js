import { apiClient } from '@/lib/api';

/**
 * Staff Management Service
 * Handles staff-related operations for branch managers
 */

const STAFF_ENDPOINT = '/branch/staff';

export const staffManagementService = {
  /**
   * Get all staff in the branch
   */
  getStaffList: (params = {}) => {
    return apiClient.get(STAFF_ENDPOINT, { params });
  },

  /**
   * Get single staff member details
   */
  getStaffById: (id) => {
    return apiClient.get(`${STAFF_ENDPOINT}/${id}`);
  },

  /**
   * Update staff information
   */
  updateStaff: (id, data) => {
    return apiClient.put(`${STAFF_ENDPOINT}/${id}`, data);
  },

  /**
   * Update staff status
   */
  updateStaffStatus: (id, status) => {
    return apiClient.patch(`${STAFF_ENDPOINT}/${id}/status`, { status });
  },

  /**
   * Get staff attendance summary
   */
  getStaffAttendance: (params = {}) => {
    return apiClient.get(`${STAFF_ENDPOINT}/attendance`, { params });
  },

  /**
   * Get staff performance metrics
   */
  getStaffPerformance: (id, period = 'month') => {
    return apiClient.get(`${STAFF_ENDPOINT}/${id}/performance`, {
      params: { period },
    });
  },

  /**
   * Get pending leave requests
   */
  getPendingLeaveRequests: () => {
    return apiClient.get(`${STAFF_ENDPOINT}/leave/pending`);
  },

  /**
   * Get all leave requests
   */
  getLeaveRequests: (params = {}) => {
    return apiClient.get(`${STAFF_ENDPOINT}/leave`, { params });
  },

  /**
   * Approve leave request
   */
  approveLeave: (id, comment = '') => {
    return apiClient.post(`${STAFF_ENDPOINT}/leave/${id}/approve`, { comment });
  },

  /**
   * Reject leave request
   */
  rejectLeave: (id, reason) => {
    return apiClient.post(`${STAFF_ENDPOINT}/leave/${id}/reject`, { reason });
  },

  /**
   * Assign task to staff
   */
  assignTask: (staffId, taskData) => {
    return apiClient.post(`${STAFF_ENDPOINT}/${staffId}/tasks`, taskData);
  },

  /**
   * Get staff's task list
   */
  getStaffTasks: (staffId, params = {}) => {
    return apiClient.get(`${STAFF_ENDPOINT}/${staffId}/tasks`, { params });
  },

  /**
   * Get today's attendance summary
   */
  getTodayAttendance: () => {
    return apiClient.get(`${STAFF_ENDPOINT}/attendance/today`);
  },
};
