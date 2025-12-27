import { useQuery, useMutation } from '@tanstack/react-query';
import { branchReportsService } from '../services';

/**
 * Branch Reports Hooks
 */

// Query keys
const REPORTS_KEYS = {
  all: ['branch', 'reports'],
  report: (type, params) => [...REPORTS_KEYS.all, type, params],
  dailySales: (date) => [...REPORTS_KEYS.all, 'sales', 'daily', date],
  weeklySales: (startDate) => [...REPORTS_KEYS.all, 'sales', 'weekly', startDate],
  monthlySales: (year, month) => [...REPORTS_KEYS.all, 'sales', 'monthly', year, month],
  sales: (start, end) => [...REPORTS_KEYS.all, 'sales', start, end],
  inventory: () => [...REPORTS_KEYS.all, 'inventory'],
  staffPerformance: (period) => [...REPORTS_KEYS.all, 'staff', 'performance', period],
  attendance: (year, month) => [...REPORTS_KEYS.all, 'attendance', year, month],
  expiry: (days) => [...REPORTS_KEYS.all, 'expiry', days],
  lowStock: () => [...REPORTS_KEYS.all, 'low-stock'],
  comparison: (current, previous) => [...REPORTS_KEYS.all, 'comparison', current, previous],
  categorySales: (start, end) => [...REPORTS_KEYS.all, 'sales', 'category', start, end],
  hourlySales: (date) => [...REPORTS_KEYS.all, 'sales', 'hourly', date],
};

/**
 * Hook to get branch reports (generic)
 */
export const useBranchReports = (reportType, params = {}) => {
  return useQuery({
    queryKey: REPORTS_KEYS.report(reportType, params),
    queryFn: () => branchReportsService.getReport(reportType, params),
    enabled: !!reportType,
  });
};

/**
 * Hook to export reports
 */
export const useExportReport = () => {
  return useMutation({
    mutationFn: ({ type, format, ...params }) =>
      format === 'pdf'
        ? branchReportsService.exportReportPDF(type, params)
        : branchReportsService.exportReportExcel(type, params),
    onSuccess: (data, { type, format }) => {
      const blob = new Blob([data], {
        type: format === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
  });
};

/**
 * Hook to get daily sales report
 */
export const useDailySalesReport = (date) => {
  return useQuery({
    queryKey: REPORTS_KEYS.dailySales(date),
    queryFn: () => branchReportsService.getDailySalesReport(date),
    enabled: !!date,
  });
};

/**
 * Hook to get weekly sales report
 */
export const useWeeklySalesReport = (startDate) => {
  return useQuery({
    queryKey: REPORTS_KEYS.weeklySales(startDate),
    queryFn: () => branchReportsService.getWeeklySalesReport(startDate),
    enabled: !!startDate,
  });
};

/**
 * Hook to get monthly sales report
 */
export const useMonthlySalesReport = (year, month) => {
  return useQuery({
    queryKey: REPORTS_KEYS.monthlySales(year, month),
    queryFn: () => branchReportsService.getMonthlySalesReport(year, month),
    enabled: !!year && !!month,
  });
};

/**
 * Hook to get custom date range sales report
 */
export const useSalesReport = (startDate, endDate) => {
  return useQuery({
    queryKey: REPORTS_KEYS.sales(startDate, endDate),
    queryFn: () => branchReportsService.getSalesReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

/**
 * Hook to get inventory report
 */
export const useInventoryReport = () => {
  return useQuery({
    queryKey: REPORTS_KEYS.inventory(),
    queryFn: branchReportsService.getInventoryReport,
  });
};

/**
 * Hook to get staff performance report
 */
export const useStaffPerformanceReport = (period = 'month') => {
  return useQuery({
    queryKey: REPORTS_KEYS.staffPerformance(period),
    queryFn: () => branchReportsService.getStaffPerformanceReport(period),
  });
};

/**
 * Hook to get attendance report
 */
export const useAttendanceReport = (year, month) => {
  return useQuery({
    queryKey: REPORTS_KEYS.attendance(year, month),
    queryFn: () => branchReportsService.getAttendanceReport(year, month),
    enabled: !!year && !!month,
  });
};

/**
 * Hook to get expiry report
 */
export const useExpiryReport = (days = 90) => {
  return useQuery({
    queryKey: REPORTS_KEYS.expiry(days),
    queryFn: () => branchReportsService.getExpiryReport(days),
  });
};

/**
 * Hook to get low stock report
 */
export const useLowStockReport = () => {
  return useQuery({
    queryKey: REPORTS_KEYS.lowStock(),
    queryFn: branchReportsService.getLowStockReport,
  });
};

/**
 * Hook to export report as PDF
 */
export const useExportReportPDF = () => {
  return useMutation({
    mutationFn: ({ reportType, params }) =>
      branchReportsService.exportReportPDF(reportType, params),
    onSuccess: (data, { reportType }) => {
      // Create download link
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
  });
};

/**
 * Hook to export report as Excel
 */
export const useExportReportExcel = () => {
  return useMutation({
    mutationFn: ({ reportType, params }) =>
      branchReportsService.exportReportExcel(reportType, params),
    onSuccess: (data, { reportType }) => {
      // Create download link
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
  });
};

/**
 * Hook to get comparison report
 */
export const useComparisonReport = (currentPeriod, previousPeriod) => {
  return useQuery({
    queryKey: REPORTS_KEYS.comparison(currentPeriod, previousPeriod),
    queryFn: () => branchReportsService.getComparisonReport(currentPeriod, previousPeriod),
    enabled: !!currentPeriod && !!previousPeriod,
  });
};

/**
 * Hook to get category sales breakdown
 */
export const useCategorySalesReport = (startDate, endDate) => {
  return useQuery({
    queryKey: REPORTS_KEYS.categorySales(startDate, endDate),
    queryFn: () => branchReportsService.getCategorySalesReport(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

/**
 * Hook to get hourly sales pattern
 */
export const useHourlySalesPattern = (date) => {
  return useQuery({
    queryKey: REPORTS_KEYS.hourlySales(date),
    queryFn: () => branchReportsService.getHourlySalesPattern(date),
    enabled: !!date,
  });
};
