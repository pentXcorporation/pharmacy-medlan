import api from '@/lib/api';

/**
 * Settings Service
 * Handles system settings operations
 */
export const settingsService = {
  /**
   * Get all settings
   */
  getAll: () => api.get('/api/settings'),

  /**
   * Get settings by category
   */
  getByCategory: (category) => api.get(`/api/settings/category/${category}`),

  /**
   * Get setting by key
   */
  getByKey: (key) => api.get(`/api/settings/${key}`),

  /**
   * Update setting
   */
  update: (key, value) => api.put(`/api/settings/${key}`, { value }),

  /**
   * Update multiple settings
   */
  updateBulk: (settings) => api.put('/api/settings/bulk', { settings }),

  /**
   * Reset settings to defaults
   */
  resetToDefaults: (category) => api.post(`/api/settings/reset/${category}`),

  /**
   * Export settings
   */
  export: () => api.get('/api/settings/export', { responseType: 'blob' }),

  /**
   * Import settings
   */
  import: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/settings/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default settingsService;
