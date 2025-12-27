// Employee Hooks - Attendance
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../services';

export const ATTENDANCE_QUERY_KEYS = {
  attendance: 'employee-attendance',
  todayAttendance: 'employee-today-attendance',
  monthlyAttendance: 'employee-monthly-attendance',
  attendanceStats: 'employee-attendance-stats',
};

// My Attendance Hook
export const useMyAttendance = (params = {}) => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEYS.attendance, params],
    queryFn: () => attendanceService.getMyAttendance(params),
  });
};

// Today's Attendance Hook
export const useTodayAttendance = () => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEYS.todayAttendance],
    queryFn: attendanceService.getTodayAttendance,
    refetchInterval: 60 * 1000, // Refresh every minute
  });
};

// Monthly Attendance Hook
export const useMonthlyAttendance = (month, year) => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEYS.monthlyAttendance, month, year],
    queryFn: () => attendanceService.getMonthlyAttendance(month, year),
    enabled: !!month && !!year,
  });
};

// Check In Hook
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.todayAttendance] });
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.attendance] });
    },
  });
};

// Check Out Hook
export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.todayAttendance] });
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.attendance] });
    },
  });
};

// Attendance Stats Hook
export const useAttendanceStats = (params = {}) => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEYS.attendanceStats, params],
    queryFn: () => attendanceService.getAttendanceStats(params),
  });
};
