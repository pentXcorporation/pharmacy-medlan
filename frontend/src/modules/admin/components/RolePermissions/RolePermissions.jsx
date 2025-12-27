import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Badge } from '@/shared/components/ui/Badge';
import { Modal } from '@/shared/components/ui/Modal';
import { useRoles } from '../../hooks/useRoles';
import styles from './RolePermissions.module.css';

/**
 * RolePermissions Component
 * Role and permission management interface
 */
export function RolePermissions() {
  const { 
    roles, 
    permissions,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    updatePermissionsMutation,
  } = useRoles();

  const [selectedRole, setSelectedRole] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [rolePermissions, setRolePermissions] = useState({});

  const handleCreateRole = () => {
    setIsEditing(false);
    setFormData({ name: '', description: '' });
    setIsFormOpen(true);
  };

  const handleEditRole = (role) => {
    setIsEditing(true);
    setFormData({ name: role.name, description: role.description || '' });
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setRolePermissions(
      role.permissions?.reduce((acc, perm) => {
        acc[perm] = true;
        return acc;
      }, {}) || {}
    );
  };

  const handlePermissionToggle = (permission) => {
    setRolePermissions(prev => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleSavePermissions = () => {
    const enabledPermissions = Object.entries(rolePermissions)
      .filter(([_, enabled]) => enabled)
      .map(([perm]) => perm);
    
    updatePermissionsMutation.mutate({
      roleId: selectedRole.id,
      permissions: enabledPermissions,
    });
  };

  const handleSubmitRole = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate({ id: selectedRole.id, ...formData }, {
        onSuccess: () => setIsFormOpen(false),
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsFormOpen(false),
      });
    }
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      deleteMutation.mutate(roleId);
      if (selectedRole?.id === roleId) {
        setSelectedRole(null);
      }
    }
  };

  const permissionGroups = {
    'User Management': ['users.view', 'users.create', 'users.edit', 'users.delete'],
    'Product Management': ['products.view', 'products.create', 'products.edit', 'products.delete'],
    'Inventory': ['inventory.view', 'inventory.manage', 'inventory.transfer'],
    'Sales': ['sales.view', 'sales.create', 'sales.void', 'sales.returns'],
    'Purchases': ['purchases.view', 'purchases.create', 'purchases.approve'],
    'Reports': ['reports.view', 'reports.export', 'reports.financial'],
    'Settings': ['settings.view', 'settings.manage'],
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Roles & Permissions</h1>
          <p className={styles.subtitle}>Manage user roles and their permissions</p>
        </div>
        <Button onClick={handleCreateRole}>Create New Role</Button>
      </div>

      <div className={styles.content}>
        {/* Roles List */}
        <Card className={styles.rolesCard}>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.rolesList}>
              {roles?.map((role) => (
                <div
                  key={role.id}
                  className={`${styles.roleItem} ${selectedRole?.id === role.id ? styles.selected : ''}`}
                  onClick={() => handleSelectRole(role)}
                >
                  <div className={styles.roleInfo}>
                    <p className={styles.roleName}>{role.name}</p>
                    <p className={styles.roleDescription}>{role.description}</p>
                    <Badge variant="secondary">
                      {role.permissions?.length || 0} permissions
                    </Badge>
                  </div>
                  <div className={styles.roleActions}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRole(role);
                      }}
                    >
                      Edit
                    </Button>
                    {!role.isSystem && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permissions Panel */}
        <Card className={styles.permissionsCard}>
          <CardHeader className={styles.permissionsHeader}>
            <CardTitle>
              {selectedRole ? `Permissions for ${selectedRole.name}` : 'Select a Role'}
            </CardTitle>
            {selectedRole && (
              <Button 
                onClick={handleSavePermissions}
                disabled={updatePermissionsMutation.isPending}
              >
                {updatePermissionsMutation.isPending ? 'Saving...' : 'Save Permissions'}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <div className={styles.permissionsGroups}>
                {Object.entries(permissionGroups).map(([group, perms]) => (
                  <div key={group} className={styles.permissionGroup}>
                    <h3 className={styles.groupTitle}>{group}</h3>
                    <div className={styles.permissionsList}>
                      {perms.map((perm) => (
                        <label key={perm} className={styles.permissionItem}>
                          <input
                            type="checkbox"
                            checked={rolePermissions[perm] || false}
                            onChange={() => handlePermissionToggle(perm)}
                          />
                          <span>{perm.replace('.', ' - ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noSelection}>
                Select a role from the list to manage its permissions
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? 'Edit Role' : 'Create New Role'}
      >
        <form onSubmit={handleSubmitRole} className={styles.form}>
          <div>
            <label className={styles.label}>Role Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter role name"
              required
            />
          </div>
          <div>
            <label className={styles.label}>Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter role description"
            />
          </div>
          <div className={styles.formActions}>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default RolePermissions;
