import api from '@/lib/api';

/**
 * Role Service
 * Handles role and permission management
 */
export const roleService = {
  /**
   * Get all roles
   */
  getAll: () => api.get('/api/roles'),

  /**
   * Get role by ID
   */
  getById: (id) => api.get(`/api/roles/${id}`),

  /**
   * Create new role
   */
  create: (data) => api.post('/api/roles', data),

  /**
   * Update role
   */
  update: (id, data) => api.put(`/api/roles/${id}`, data),

  /**
   * Delete role
   */
  delete: (id) => api.delete(`/api/roles/${id}`),

  /**
   * Get all permissions
   */
  getPermissions: () => api.get('/api/permissions'),

  /**
   * Update role permissions
   */
  updatePermissions: (roleId, permissions) => 
    api.put(`/api/roles/${roleId}/permissions`, { permissions }),

  /**
   * Get role permissions
   */
  getRolePermissions: (roleId) => api.get(`/api/roles/${roleId}/permissions`),
};

export default roleService;
