import api from '../lib/api';

export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  
  registerInitial: (userData) => api.post('/api/auth/register/initial', userData),
  
  getCurrentUser: () => api.get('/api/auth/me'),
  
  changePassword: (data) => api.post('/api/auth/change-password', data),
  
  logout: () => api.post('/api/auth/logout'),
  
  refreshToken: (refreshToken) => api.post(`/api/auth/refresh?refreshToken=${refreshToken}`),
};
