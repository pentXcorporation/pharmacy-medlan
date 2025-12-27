import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffManagementService } from '../services';

/**
 * Staff Management Hooks
 */

// Query keys
const STAFF_KEYS = {
  all: ['branch', 'staff'],
  list: (params) => [...STAFF_KEYS.all, 'list', params],
  detail: (id) => [...STAFF_KEYS.all, 'detail', id],
  attendance: (params) => [...STAFF_KEYS.all, 'attendance', params],
  performance: (id, period) => [...STAFF_KEYS.all, 'performance', id, period],
  leave: {
    all: () => [...STAFF_KEYS.all, 'leave'],
    pending: () => [...STAFF_KEYS.all, 'leave', 'pending'],
    list: (params) => [...STAFF_KEYS.all, 'leave', 'list', params],
  },
  tasks: (staffId, params) => [...STAFF_KEYS.all, 'tasks', staffId, params],
  todayAttendance: () => [...STAFF_KEYS.all, 'attendance', 'today'],
};

/**
 * Hook to get staff list
 */
export const useStaffList = (params = {}) => {
  return useQuery({
    queryKey: STAFF_KEYS.list(params),
    queryFn: () => staffManagementService.getStaffList(params),
  });
};

/**
 * Hook to get single staff member
 */
export const useStaffDetail = (id) => {
  return useQuery({
    queryKey: STAFF_KEYS.detail(id),
    queryFn: () => staffManagementService.getStaffById(id),
    enabled: !!id,
  });
};

/**
 * Hook to update staff
 */
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => staffManagementService.updateStaff(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.detail(id) });
    },
  });
};

/**
 * Hook to update staff status
 */
export const useUpdateStaffStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => staffManagementService.updateStaffStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.all });
    },
  });
};

/**
 * Hook to get staff attendance
 */
export const useStaffAttendance = (params = {}) => {
  return useQuery({
    queryKey: STAFF_KEYS.attendance(params),
    queryFn: () => staffManagementService.getStaffAttendance(params),
  });
};

/**
 * Hook to get staff performance
 */
export const useStaffPerformance = (id, period = 'month') => {
  return useQuery({
    queryKey: STAFF_KEYS.performance(id, period),
    queryFn: () => staffManagementService.getStaffPerformance(id, period),
    enabled: !!id,
  });
};

/**
 * Hook to get pending leave requests
 */
export const usePendingLeaveRequests = () => {
  return useQuery({
    queryKey: STAFF_KEYS.leave.pending(),
    queryFn: staffManagementService.getPendingLeaveRequests,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook to get all leave requests
 */
export const useLeaveRequests = (params = {}) => {
  return useQuery({
    queryKey: STAFF_KEYS.leave.list(params),
    queryFn: () => staffManagementService.getLeaveRequests(params),
  });
};

/**
 * Hook to approve leave request
 */
export const useApproveLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }) => staffManagementService.approveLeave(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.leave.all() });
    },
  });
};

/**
 * Hook to reject leave request
 */
export const useRejectLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => staffManagementService.rejectLeave(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.leave.all() });
    },
  });
};

/**
 * Hook to assign task to staff
 */
export const useAssignTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, taskData }) =>
      staffManagementService.assignTask(staffId, taskData),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEYS.tasks(staffId, {}) });
    },
  });
};

/**
 * Hook to get staff tasks
 */
export const useStaffTasks = (staffId, params = {}) => {
  return useQuery({
    queryKey: STAFF_KEYS.tasks(staffId, params),
    queryFn: () => staffManagementService.getStaffTasks(staffId, params),
    enabled: !!staffId,
  });
};

/**
 * Hook to get today's attendance summary
 */
export const useTodayAttendanceSummary = () => {
  return useQuery({
    queryKey: STAFF_KEYS.todayAttendance(),
    queryFn: staffManagementService.getTodayAttendance,
    staleTime: 1000 * 60, // 1 minute
  });
};
