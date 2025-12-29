/**
 * Suppliers List Page
 * Displays all suppliers with filtering, sorting, and pagination
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Upload } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useSuppliers,
  useDeleteSupplier,
  useActivateSupplier,
  useDeactivateSupplier,
  getSupplierColumns,
} from "@/features/suppliers";
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

/**
 * SuppliersPage component
 */
const SuppliersPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
          : "supplierName,asc",
      ...(searchQuery && { search: searchQuery }),
      ...(statusFilter &&
        statusFilter !== "all" && { isActive: statusFilter === "active" }),
    }),
    [pagination, sorting, searchQuery, statusFilter]
  );

  // Fetch suppliers
  const { data, isLoading, isFetching } = useSuppliers(queryParams);
  const deleteSupplier = useDeleteSupplier();
  const activateSupplier = useActivateSupplier();
  const deactivateSupplier = useDeactivateSupplier();

  // Handlers
  const handleView = useCallback(
    (supplier) => {
      navigate(ROUTES.SUPPLIERS.VIEW(supplier.id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (supplier) => {
      navigate(ROUTES.SUPPLIERS.EDIT(supplier.id));
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (supplier) => {
      const confirmed = await confirm({
        title: "Delete Supplier",
        description: `Are you sure you want to delete "${supplier.supplierName}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
      });

      if (confirmed) {
        deleteSupplier.mutate(supplier.id);
      }
    },
    [confirm, deleteSupplier]
  );

  const handleActivate = useCallback(
    async (supplier) => {
      activateSupplier.mutate(supplier.id);
    },
    [activateSupplier]
  );

  const handleDeactivate = useCallback(
    async (supplier) => {
      const confirmed = await confirm({
        title: "Deactivate Supplier",
        description: `Deactivate "${supplier.supplierName}"? They won't appear in purchase orders.`,
        confirmText: "Deactivate",
        cancelText: "Cancel",
      });

      if (confirmed) {
        deactivateSupplier.mutate(supplier.id);
      }
    },
    [confirm, deactivateSupplier]
  );

  const handleCreatePO = useCallback(
    (supplier) => {
      navigate(`${ROUTES.PURCHASE_ORDERS.NEW}?supplierId=${supplier.id}`);
    },
    [navigate]
  );

  // Get columns with handlers
  const columns = useMemo(
    () =>
      getSupplierColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onActivate: handleActivate,
        onDeactivate: handleDeactivate,
        onCreatePO: handleCreatePO,
      }),
    [
      handleView,
      handleEdit,
      handleDelete,
      handleActivate,
      handleDeactivate,
      handleCreatePO,
    ]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage your supplier database"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate(ROUTES.SUPPLIERS.NEW)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
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

export default SuppliersPage;
