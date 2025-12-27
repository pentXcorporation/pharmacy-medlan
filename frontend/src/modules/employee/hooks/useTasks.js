// Employee Hooks - Tasks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services';

export const TASK_QUERY_KEYS = {
  tasks: 'employee-tasks',
  task: 'employee-task',
  taskStats: 'employee-task-stats',
  taskComments: 'employee-task-comments',
};

// My Tasks Hook
export const useMyTasks = (params = {}) => {
  return useQuery({
    queryKey: [TASK_QUERY_KEYS.tasks, params],
    queryFn: () => taskService.getMyTasks(params),
  });
};

// Single Task Hook
export const useTask = (taskId) => {
  return useQuery({
    queryKey: [TASK_QUERY_KEYS.task, taskId],
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
  });
};

// Update Task Status Hook
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }) => taskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEYS.tasks] });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEYS.taskStats] });
    },
  });
};

// Task Comments Hook
export const useTaskComments = (taskId) => {
  return useQuery({
    queryKey: [TASK_QUERY_KEYS.taskComments, taskId],
    queryFn: () => taskService.getTaskComments(taskId),
    enabled: !!taskId,
  });
};

// Add Task Comment Hook
export const useAddTaskComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, comment }) => taskService.addTaskComment(taskId, comment),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEYS.taskComments, taskId] });
    },
  });
};

// Task Stats Hook
export const useTaskStats = () => {
  return useQuery({
    queryKey: [TASK_QUERY_KEYS.taskStats],
    queryFn: taskService.getTaskStats,
  });
};
