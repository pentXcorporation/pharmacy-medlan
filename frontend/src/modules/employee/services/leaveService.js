// Employee Services - Leave Service
import apiClient from '@/lib/api';

const leaveService = {
  // Leave Requests
  getMyLeaves: async (params = {}) => {
    const response = await apiClient.get('/employee/leaves', { params });
    return response.data;
  },

  getLeaveById: async (leaveId) => {
    const response = await apiClient.get(`/employee/leaves/${leaveId}`);
    return response.data;
  },

  applyLeave: async (leaveData) => {
    const response = await apiClient.post('/employee/leaves', leaveData);
    return response.data;
  },

  cancelLeave: async (leaveId) => {
    const response = await apiClient.delete(`/employee/leaves/${leaveId}`);
    return response.data;
  },

  // Leave Balance
  getLeaveBalance: async () => {
    const response = await apiClient.get('/employee/leaves/balance');
    return response.data;
  },

  // Holidays
  getHolidays: async (year) => {
    const response = await apiClient.get('/employee/holidays', { params: { year } });
    return response.data;
  },
};

export default leaveService;
