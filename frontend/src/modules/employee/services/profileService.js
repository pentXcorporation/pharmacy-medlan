// Employee Services - Profile Service
import apiClient from '@/lib/api';

const profileService = {
  // Profile
  getMyProfile: async () => {
    const response = await apiClient.get('/employee/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/employee/profile', profileData);
    return response.data;
  },

  updateProfilePicture: async (formData) => {
    const response = await apiClient.post('/employee/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await apiClient.post('/employee/profile/change-password', passwordData);
    return response.data;
  },

  // Notifications
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/employee/notifications', { params });
    return response.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await apiClient.patch(`/employee/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await apiClient.patch('/employee/notifications/read-all');
    return response.data;
  },

  // Activity
  getMyActivity: async (params = {}) => {
    const response = await apiClient.get('/employee/activity', { params });
    return response.data;
  },
};

export default profileService;
