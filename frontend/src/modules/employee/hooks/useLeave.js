// Employee Hooks - Leave
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveService } from '../services';

export const LEAVE_QUERY_KEYS = {
  leaves: 'employee-leaves',
  leave: 'employee-leave',
  leaveBalance: 'employee-leave-balance',
  holidays: 'holidays',
};

// My Leaves Hook
export const useMyLeaves = (params = {}) => {
  return useQuery({
    queryKey: [LEAVE_QUERY_KEYS.leaves, params],
    queryFn: () => leaveService.getMyLeaves(params),
  });
};

// Single Leave Hook
export const useLeave = (leaveId) => {
  return useQuery({
    queryKey: [LEAVE_QUERY_KEYS.leave, leaveId],
    queryFn: () => leaveService.getLeaveById(leaveId),
    enabled: !!leaveId,
  });
};

// Apply Leave Hook
export const useApplyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveService.applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_QUERY_KEYS.leaves] });
      queryClient.invalidateQueries({ queryKey: [LEAVE_QUERY_KEYS.leaveBalance] });
    },
  });
};

// Cancel Leave Hook
export const useCancelLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveService.cancelLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAVE_QUERY_KEYS.leaves] });
      queryClient.invalidateQueries({ queryKey: [LEAVE_QUERY_KEYS.leaveBalance] });
    },
  });
};

// Leave Balance Hook
export const useLeaveBalance = () => {
  return useQuery({
    queryKey: [LEAVE_QUERY_KEYS.leaveBalance],
    queryFn: leaveService.getLeaveBalance,
  });
};

// Holidays Hook
export const useHolidays = (year) => {
  return useQuery({
    queryKey: [LEAVE_QUERY_KEYS.holidays, year],
    queryFn: () => leaveService.getHolidays(year),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
