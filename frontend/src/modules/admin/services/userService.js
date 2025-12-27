import api from '@/lib/api';

/**
 * User Service
 * Handles all user management API calls
 */
export const userService = {
  /**
   * Get all users with pagination and filters
   */
  getAll: (params) => api.get('/api/users', { params }),

  /**
   * Get active users
   */
  getActive: () => api.get('/api/users/active'),

  /**
   * Get user by ID
   */
  getById: (id) => api.get(`/api/users/${id}`),

  /**
   * Get user by username
   */
  getByUsername: (username) => api.get(`/api/users/username/${username}`),

  /**
   * Get users by role
   */
  getByRole: (role) => api.get(`/api/users/role/${role}`),

  /**
   * Get users by branch
   */
  getByBranch: (branchId) => api.get(`/api/users/branch/${branchId}`),

  /**
   * Create new user
   */
  create: (data) => api.post('/api/users', data),

  /**
   * Update user
   */
  update: (id, data) => api.put(`/api/users/${id}`, data),

  /**
   * Delete user
   */
  delete: (id) => api.delete(`/api/users/${id}`),

  /**
   * Activate user
   */
  activate: (id) => api.patch(`/api/users/${id}/activate`),

  /**
   * Deactivate user
   */
  deactivate: (id) => api.patch(`/api/users/${id}/deactivate`),

  /**
   * Reset user password
   */
  resetPassword: (id, newPassword) => 
    api.patch(`/api/users/${id}/reset-password?newPassword=${newPassword}`),

  /**
   * Bulk actions
   */
  bulkActivate: (ids) => api.post('/api/users/bulk/activate', { ids }),
  bulkDeactivate: (ids) => api.post('/api/users/bulk/deactivate', { ids }),
  bulkDelete: (ids) => api.post('/api/users/bulk/delete', { ids }),
};

export default userService;
