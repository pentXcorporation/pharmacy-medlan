import { useQuery } from '@tanstack/react-query';
import { auditService } from '../services/auditService';

/**
 * useAuditLogs Hook
 * Manages audit log data fetching
 */
export function useAuditLogs(params = {}) {
  const AUDIT_LOGS_KEY = ['audit-logs', params];

  const {
    data: auditData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: AUDIT_LOGS_KEY,
    queryFn: () => auditService.getAll(params),
  });

  // Fetch statistics
  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['audit-logs', 'statistics', params],
    queryFn: () => auditService.getStatistics(params),
  });

  // Export function
  const exportLogs = async (exportParams) => {
    try {
      const blob = await auditService.export(exportParams);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      throw error;
    }
  };

  return {
    // Data
    logs: auditData?.data || [],
    totalLogs: auditData?.total || 0,
    statistics: statsData?.data || null,
    isLoading,
    statsLoading,
    error,

    // Actions
    refetch,
    exportLogs,
  };
}

export default useAuditLogs;
