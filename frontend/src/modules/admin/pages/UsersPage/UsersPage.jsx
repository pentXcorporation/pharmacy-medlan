import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { UserTable, UserForm } from '../../components/UserManagement';
import { useUsers } from '../../hooks/useUsers';
import { ROLES } from '@/modules/auth/constants';
import styles from './UsersPage.module.css';

/**
 * UsersPage
 * User management page for administrators
 */
export function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    users,
    totalUsers,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    activateMutation,
    deactivateMutation,
    resetPasswordMutation,
  } = useUsers();

  // Mock branches - in real app, fetch from branch service
  const branches = [
    { id: '1', branchName: 'Main Branch' },
    { id: '2', branchName: 'Branch 2' },
  ];

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleSubmit = (data) => {
    if (selectedUser) {
      updateMutation.mutate(
        { id: selectedUser.id, ...data },
        { onSuccess: () => setIsFormOpen(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsFormOpen(false) });
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId);
    }
  };

  const handleActivateUser = (userId) => {
    activateMutation.mutate(userId);
  };

  const handleDeactivateUser = (userId) => {
    deactivateMutation.mutate(userId);
  };

  const handleResetPassword = (userId) => {
    if (window.confirm('Are you sure you want to reset this user\'s password?')) {
      resetPasswordMutation.mutate(userId);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>
            Manage system users and their access permissions
          </p>
        </div>
        <Button onClick={handleCreateUser}>
          Add New User
        </Button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <Card>
          <CardContent className={styles.statContent}>
            <p className={styles.statLabel}>Total Users</p>
            <p className={styles.statValue}>{totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={styles.statContent}>
            <p className={styles.statLabel}>Active Users</p>
            <p className={styles.statValue}>
              {users?.filter(u => u.status === 'ACTIVE').length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={styles.statContent}>
            <p className={styles.statLabel}>Inactive Users</p>
            <p className={styles.statValue}>
              {users?.filter(u => u.status === 'INACTIVE').length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className={styles.statContent}>
            <p className={styles.statLabel}>Pending Users</p>
            <p className={styles.statValue}>
              {users?.filter(u => u.status === 'PENDING').length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users || []}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onActivate={handleActivateUser}
            onDeactivate={handleDeactivateUser}
            onResetPassword={handleResetPassword}
          />
        </CardContent>
      </Card>

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        user={selectedUser}
        roles={Object.values(ROLES)}
        branches={branches}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

export default UsersPage;
