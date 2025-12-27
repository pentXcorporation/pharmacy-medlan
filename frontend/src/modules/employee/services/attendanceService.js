// Employee Services - Attendance Service
import apiClient from '@/lib/api';

const attendanceService = {
  // Check In/Out
  checkIn: async (data = {}) => {
    const response = await apiClient.post('/employee/attendance/check-in', data);
    return response.data;
  },

  checkOut: async (data = {}) => {
    const response = await apiClient.post('/employee/attendance/check-out', data);
    return response.data;
  },

  // Attendance Records
  getMyAttendance: async (params = {}) => {
    const response = await apiClient.get('/employee/attendance', { params });
    return response.data;
  },

  getTodayAttendance: async () => {
    const response = await apiClient.get('/employee/attendance/today');
    return response.data;
  },

  getMonthlyAttendance: async (month, year) => {
    const response = await apiClient.get('/employee/attendance/monthly', {
      params: { month, year },
    });
    return response.data;
  },

  // Statistics
  getAttendanceStats: async (params = {}) => {
    const response = await apiClient.get('/employee/attendance/stats', { params });
    return response.data;
  },
};

export default attendanceService;
