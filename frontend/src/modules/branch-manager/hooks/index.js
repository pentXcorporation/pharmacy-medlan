// Branch Manager Hooks - Barrel Export

// Branch Dashboard hooks
export {
  useBranchOverview,
  useTodayMetrics,
  useSalesSummary,
  useTopProducts,
  useSalesTrend,
  useInventoryAlerts,
  useRecentActivities,
  useBranchInfo,
  useUpdateBranchSettings,
} from './useBranchDashboard';

// Staff Management hooks
export {
  useStaffList,
  useStaffDetail,
  useUpdateStaff,
  useUpdateStaffStatus,
  useStaffAttendance,
  useStaffPerformance,
  usePendingLeaveRequests,
  useLeaveRequests,
  useApproveLeave,
  useRejectLeave,
  useAssignTask,
  useStaffTasks,
  useTodayAttendanceSummary,
} from './useStaffManagement';

// Schedule hooks
export {
  useSchedule,
  useWeeklySchedule,
  useDailySchedule,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
  usePublishSchedule,
  useAvailableStaff,
  useCopyPreviousWeek,
  useShiftTemplates,
  useCreateShiftTemplate,
  useApplyTemplate,
  useScheduleConflicts,
  useScheduleTemplates,
} from './useSchedule';

// Inventory hooks
export {
  useBranchInventory,
  useLowStockItems,
  useExpiringItems,
  useExpiredItems,
  useUpdateStock,
  useRequestTransfer,
  useTransferRequests,
  useApproveTransfer,
  useRejectTransfer,
  useShipTransfer,
  useReceiveTransfer,
  useInventoryValue,
  useStockMovement,
  useRequestRestock,
  useAvailableBranches,
} from './useBranchInventory';

// Reports hooks
export {
  useBranchReports,
  useExportReport,
  useDailySalesReport,
  useWeeklySalesReport,
  useMonthlySalesReport,
  useSalesReport,
  useInventoryReport,
  useStaffPerformanceReport,
  useAttendanceReport,
  useExpiryReport,
  useLowStockReport,
  useExportReportPDF,
  useExportReportExcel,
  useComparisonReport,
  useCategorySalesReport,
  useHourlySalesPattern,
} from './useBranchReports';
