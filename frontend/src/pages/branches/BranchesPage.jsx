/**
 * Branches Page
 * Lists all branches with filtering and actions
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";

import { ROUTES } from "@/config/routes.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, PageHeader, ConfirmDialog } from "@/components/common";
import {
  useBranches,
  useDeleteBranch,
  useActivateBranch,
  useDeactivateBranch,
  getBranchColumns,
} from "@/features/branches";

const BranchesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    branch: null,
  });

  // Query params
  const params = useMemo(
    () => ({
      search: search || undefined,
      isActive: statusFilter !== "all" ? statusFilter === "active" : undefined,
    }),
    [search, statusFilter]
  );

  // Queries and mutations
  const { data: branchesData, isLoading } = useBranches(params);
  const deleteMutation = useDeleteBranch();
  const activateMutation = useActivateBranch();
  const deactivateMutation = useDeactivateBranch();

  const branches = branchesData?.content || branchesData || [];

  // Handlers
  const handleView = useCallback(
    (branch) => {
      navigate(ROUTES.BRANCHES.EDIT.replace(":id", branch.id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (branch) => {
      navigate(ROUTES.BRANCHES.EDIT.replace(":id", branch.id));
    },
    [navigate]
  );

  const handleDeleteClick = useCallback((branch) => {
    setDeleteDialog({ open: true, branch });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.branch) {
      deleteMutation.mutate(deleteDialog.branch.id, {
        onSuccess: () => setDeleteDialog({ open: false, branch: null }),
      });
    }
  }, [deleteDialog.branch, deleteMutation]);

  const handleActivate = useCallback(
    (branch) => {
      activateMutation.mutate(branch.id);
    },
    [activateMutation]
  );

  const handleDeactivate = useCallback(
    (branch) => {
      deactivateMutation.mutate(branch.id);
    },
    [deactivateMutation]
  );

  // Columns
  const columns = useMemo(
    () =>
      getBranchColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        onActivate: handleActivate,
        onDeactivate: handleDeactivate,
      }),
    [
      handleView,
      handleEdit,
      handleDeleteClick,
      handleActivate,
      handleDeactivate,
    ]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branches"
        description="Manage your pharmacy branch locations"
        icon={Building2}
        actions={
          <Button onClick={() => navigate(ROUTES.BRANCHES.NEW)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-[300px]"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={branches}
        isLoading={isLoading}
        searchable={false}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, branch: null })}
        title="Delete Branch"
        description={`Are you sure you want to delete "${deleteDialog.branch?.branchName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default BranchesPage;
