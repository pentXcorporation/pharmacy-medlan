import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '../services';

/**
 * Schedule Management Hooks
 */

// Query keys
const SCHEDULE_KEYS = {
  all: ['branch', 'schedule'],
  list: (params) => [...SCHEDULE_KEYS.all, 'list', params],
  weekly: (startDate) => [...SCHEDULE_KEYS.all, 'weekly', startDate],
  daily: (date) => [...SCHEDULE_KEYS.all, 'daily', date],
  templates: () => [...SCHEDULE_KEYS.all, 'templates'],
  availableStaff: (date, shift) => [...SCHEDULE_KEYS.all, 'available', date, shift],
  conflicts: () => [...SCHEDULE_KEYS.all, 'conflicts'],
};

/**
 * Hook to get schedule
 */
export const useSchedule = (params = {}) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.list(params),
    queryFn: () => scheduleService.getSchedule(params),
  });
};

/**
 * Hook to get weekly schedule
 */
export const useWeeklySchedule = (startDate) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.weekly(startDate),
    queryFn: () => scheduleService.getWeeklySchedule(startDate),
    enabled: !!startDate,
  });
};

/**
 * Hook to get daily schedule
 */
export const useDailySchedule = (date) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.daily(date),
    queryFn: () => scheduleService.getDailySchedule(date),
    enabled: !!date,
  });
};

/**
 * Hook to create schedule entry
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleService.createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
};

/**
 * Hook to update schedule entry
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => scheduleService.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
};

/**
 * Hook to delete schedule entry
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleService.deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
};

/**
 * Hook to publish schedule
 */
export const usePublishSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleService.publishSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
};

/**
 * Hook to get available staff
 */
export const useAvailableStaff = (date, shiftType) => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.availableStaff(date, shiftType),
    queryFn: () => scheduleService.getAvailableStaff(date, shiftType),
    enabled: !!date && !!shiftType,
  });
};

/**
 * Hook to copy schedule from previous week
 */
export const useCopyPreviousWeek = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleService.copyPreviousWeek,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
};

/**
 * Hook to get shift templates
 */
export const useShiftTemplates = () => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.templates(),
    queryFn: scheduleService.getShiftTemplates,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to create shift template
 */
export const useCreateShiftTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleService.createShiftTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.templates() });
    },
  });
};

/**
 * Hook to apply shift template
 */
export const useApplyTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ templateId, dates }) =>
      scheduleService.applyTemplate(templateId, dates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
};

/**
 * Hook to check schedule conflicts
 */
export const useScheduleConflicts = () => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.conflicts(),
    queryFn: scheduleService.getScheduleConflicts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get schedule templates (alias for shift templates)
 */
export const useScheduleTemplates = () => {
  return useQuery({
    queryKey: SCHEDULE_KEYS.templates(),
    queryFn: scheduleService.getShiftTemplates,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
