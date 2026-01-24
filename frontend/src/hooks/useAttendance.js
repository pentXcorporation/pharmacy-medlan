/**
 * Attendance React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";
import { toast } from "sonner";

const QUERY_KEY = "attendance";

/**
 * Hook to fetch paginated attendance records
 */
export const useAttendance = (params) => {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => attendanceService.getAll(params),
    select: (response) => response.data,
  });
};

/**
 * Hook to fetch attendance by ID
 */
export const useAttendanceById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => attendanceService.getById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

/**
 * Hook to fetch today's attendance stats
 */
export const useAttendanceStats = () => {
  return useQuery({
    queryKey: [QUERY_KEY, "stats", "today"],
    queryFn: () => attendanceService.getTodayStats(),
    select: (response) => response.data,
  });
};

/**
 * Hook to create attendance record
 */
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => attendanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Attendance Marked", {
        description: "Employee attendance has been recorded successfully.",
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to mark attendance";
      toast.error("Error", { description: message });
    },
  });
};

/**
 * Hook to update attendance record
 */
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => attendanceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Attendance Updated", {
        description: "Attendance record has been updated successfully.",
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update attendance";
      toast.error("Error", { description: message });
    },
  });
};

/**
 * Hook to delete attendance record
 */
export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => attendanceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Attendance Deleted", {
        description: "Attendance record has been deleted successfully.",
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete attendance";
      toast.error("Error", { description: message });
    },
  });
};

/**
 * Hook to approve attendance record
 */
export const useApproveAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approvedBy }) => attendanceService.approve(id, approvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Attendance Approved", {
        description: "Attendance record has been approved successfully.",
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to approve attendance";
      toast.error("Error", { description: message });
    },
  });
};
