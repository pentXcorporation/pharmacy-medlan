/**
 * Users List Page
 * Displays all users with filtering, sorting, and pagination
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useUsers,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useResetPassword,
  getUserColumns,
} from "@/features/users";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirm } from "@/components/common/ConfirmDialog";
import { ROLE_LABELS } from "@/constants";

/**
 * UsersPage component
 */
const UsersPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Sorting state
  const [sorting, setSorting] = useState([]);

  // Build query params
  const queryParams = useMemo(
    () => ({
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sort:
        sorting.length > 0
          ? `${sorting[0].id},${sorting[0].desc ? "desc" : "asc"}`
          : "firstName,asc",
      ...(searchQuery && { search: searchQuery }),
      ...(roleFilter && { role: roleFilter }),
      ...(statusFilter && { isActive: statusFilter === "active" }),
    }),
    [pagination, sorting, searchQuery, roleFilter, statusFilter]
  );

  // Fetch users
  const { data, isLoading, isFetching } = useUsers(queryParams);
  const deleteUser = useDeleteUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const resetPassword = useResetPassword();

  // Handlers
  const handleView = useCallback(
    (user) => {
      navigate(ROUTES.USERS.VIEW(user.id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (user) => {
      navigate(ROUTES.USERS.EDIT(user.id));
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (user) => {
      const confirmed = await confirm({
        title: "Delete User",
        description: `Are you sure you want to delete "${user.firstName} ${user.lastName}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
      });

      if (confirmed) {
        deleteUser.mutate(user.id);
      }
    },
    [confirm, deleteUser]
  );

  const handleActivate = useCallback(
    (user) => {
      activateUser.mutate(user.id);
    },
    [activateUser]
  );

  const handleDeactivate = useCallback(
    async (user) => {
      const confirmed = await confirm({
        title: "Deactivate User",
        description: `Deactivate "${user.firstName} ${user.lastName}"? They won't be able to log in.`,
        confirmText: "Deactivate",
        cancelText: "Cancel",
      });

      if (confirmed) {
        deactivateUser.mutate(user.id);
      }
    },
    [confirm, deactivateUser]
  );

  const handleResetPassword = useCallback(
    async (user) => {
      const confirmed = await confirm({
        title: "Reset Password",
        description: `Send password reset email to "${user.email}"?`,
        confirmText: "Send Reset Email",
        cancelText: "Cancel",
      });

      if (confirmed) {
        resetPassword.mutate(user.id);
      }
    },
    [confirm, resetPassword]
  );

  // Get columns with handlers
  const columns = useMemo(
    () =>
      getUserColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onActivate: handleActivate,
        onDeactivate: handleDeactivate,
        onResetPassword: handleResetPassword,
      }),
    [
      handleView,
      handleEdit,
      handleDelete,
      handleActivate,
      handleDeactivate,
      handleResetPassword,
    ]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage system users and their access"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate(ROUTES.USERS.NEW)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.content || []}
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          pageCount: data?.totalPages || 0,
          total: data?.totalElements || 0,
        }}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
      />
    </div>
  );
};

export default UsersPage;
