import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Table } from '@/shared/components/ui/Table';
import { Badge } from '@/shared/components/ui/Badge';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import styles from './AuditLogs.module.css';

/**
 * AuditLogs Component
 * System audit log viewer
 */
export function AuditLogs() {
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    startDate: '',
    endDate: '',
    search: '',
  });
  const [page, setPage] = useState(1);

  const { 
    logs, 
    totalLogs, 
    isLoading, 
    exportLogs,
    isExporting,
  } = useAuditLogs({ ...filters, page, limit: 20 });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleExport = (format) => {
    exportLogs({ ...filters, format });
  };

  const getActionBadge = (action) => {
    const variants = {
      CREATE: 'success',
      UPDATE: 'warning',
      DELETE: 'error',
      LOGIN: 'primary',
      LOGOUT: 'secondary',
      VIEW: 'outline',
    };
    return <Badge variant={variants[action] || 'secondary'}>{action}</Badge>;
  };

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      cell: (row) => new Date(row.timestamp).toLocaleString(),
    },
    {
      header: 'User',
      accessor: 'username',
      cell: (row) => (
        <div>
          <p className="font-medium">{row.username}</p>
          <p className="text-xs text-gray-500">{row.userRole}</p>
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => getActionBadge(row.action),
    },
    {
      header: 'Resource',
      accessor: 'resource',
    },
    {
      header: 'Details',
      accessor: 'details',
      cell: (row) => (
        <span className="text-sm text-gray-600 truncate max-w-xs block">
          {row.details || '-'}
        </span>
      ),
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Audit Logs</h1>
          <p className={styles.subtitle}>Track all system activities and changes</p>
        </div>
        <div className={styles.exportActions}>
          <Button 
            variant="outline" 
            onClick={() => handleExport('csv')}
            disabled={isExporting}
          >
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className={styles.filtersCard}>
        <CardContent className={styles.filtersContent}>
          <div className={styles.filtersGrid}>
            <div>
              <label className={styles.filterLabel}>Search</label>
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div>
              <label className={styles.filterLabel}>Action</label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className={styles.select}
              >
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
                <option value="VIEW">View</option>
              </select>
            </div>
            <div>
              <label className={styles.filterLabel}>Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className={styles.filterLabel}>End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.filterActions}>
            <Button 
              variant="ghost" 
              onClick={() => {
                setFilters({
                  userId: '',
                  action: '',
                  startDate: '',
                  endDate: '',
                  search: '',
                });
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className={styles.tableContent}>
          <Table
            columns={columns}
            data={logs || []}
            isLoading={isLoading}
            emptyMessage="No audit logs found"
          />
          
          {/* Pagination */}
          {totalLogs > 20 && (
            <div className={styles.pagination}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className={styles.pageInfo}>
                Page {page} of {Math.ceil(totalLogs / 20)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(totalLogs / 20)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AuditLogs;
