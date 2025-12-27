import api from '@/lib/api';

/**
 * Audit Service
 * Handles audit log operations
 */
export const auditService = {
  /**
   * Get audit logs with pagination and filters
   */
  getAll: (params) => api.get('/api/audit-logs', { params }),

  /**
   * Get audit log by ID
   */
  getById: (id) => api.get(`/api/audit-logs/${id}`),

  /**
   * Get audit logs by user
   */
  getByUser: (userId, params) => api.get(`/api/audit-logs/user/${userId}`, { params }),

  /**
   * Get audit logs by action type
   */
  getByAction: (action, params) => api.get(`/api/audit-logs/action/${action}`, { params }),

  /**
   * Get audit logs by date range
   */
  getByDateRange: (startDate, endDate, params) => 
    api.get('/api/audit-logs/date-range', { 
      params: { ...params, startDate, endDate } 
    }),

  /**
   * Get audit log statistics
   */
  getStatistics: (params) => api.get('/api/audit-logs/statistics', { params }),

  /**
   * Export audit logs
   */
  export: (params) => api.get('/api/audit-logs/export', { 
    params, 
    responseType: 'blob' 
  }),
};

export default auditService;
