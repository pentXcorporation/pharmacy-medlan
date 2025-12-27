// Employee Services - Task Service
import apiClient from '@/lib/api';

const taskService = {
  // Tasks
  getMyTasks: async (params = {}) => {
    const response = await apiClient.get('/employee/tasks', { params });
    return response.data;
  },

  getTaskById: async (taskId) => {
    const response = await apiClient.get(`/employee/tasks/${taskId}`);
    return response.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await apiClient.patch(`/employee/tasks/${taskId}/status`, { status });
    return response.data;
  },

  addTaskComment: async (taskId, comment) => {
    const response = await apiClient.post(`/employee/tasks/${taskId}/comments`, { comment });
    return response.data;
  },

  getTaskComments: async (taskId) => {
    const response = await apiClient.get(`/employee/tasks/${taskId}/comments`);
    return response.data;
  },

  // Task Statistics
  getTaskStats: async () => {
    const response = await apiClient.get('/employee/tasks/stats');
    return response.data;
  },
};

export default taskService;
