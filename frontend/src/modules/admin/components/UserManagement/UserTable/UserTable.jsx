import { useState } from 'react';
import { Table } from '@/shared/components/ui/Table';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Input } from '@/shared/components/ui/Input';

/**
 * UserTable Component
 * Displays list of users with actions
 */
export function UserTable({ 
  users = [], 
  isLoading = false,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onResetPassword,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const variants = {
      ACTIVE: 'success',
      INACTIVE: 'error',
      SUSPENDED: 'warning',
      PENDING: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const columns = [
    {
      header: 'User',
      accessor: 'fullName',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            {row.fullName?.[0] || row.username?.[0] || '?'}
          </div>
          <div>
            <p className="font-medium">{row.fullName || row.username}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Username',
      accessor: 'username',
    },
    {
      header: 'Role',
      accessor: 'role',
      cell: (row) => <Badge variant="outline">{row.role}</Badge>,
    },
    {
      header: 'Branch',
      accessor: 'branch',
      cell: (row) => row.branch?.branchName || '-',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit?.(row)}>
            Edit
          </Button>
          {row.status === 'ACTIVE' ? (
            <Button size="sm" variant="ghost" onClick={() => onDeactivate?.(row.id)}>
              Deactivate
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => onActivate?.(row.id)}>
              Activate
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onResetPassword?.(row.id)}>
            Reset Password
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <Table
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        emptyMessage="No users found"
      />
    </div>
  );
}

export default UserTable;
