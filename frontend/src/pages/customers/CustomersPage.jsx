/**
 * Customers List Page
 * Displays all customers with filtering, sorting, and pagination
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Upload } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useCustomers,
  useDeleteCustomer,
  useActivateCustomer,
  useDeactivateCustomer,
  getCustomerColumns,
} from "@/features/customers";
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
 * CustomersPage component
 */
const CustomersPage = () => {
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
          : "firstName,asc",
      ...(searchQuery && { search: searchQuery }),
      ...(statusFilter &&
        statusFilter !== "all" && { isActive: statusFilter === "active" }),
    }),
    [pagination, sorting, searchQuery, statusFilter]
  );

  // Fetch customers
  const { data, isLoading, isFetching } = useCustomers(queryParams);
  const deleteCustomer = useDeleteCustomer();
  const activateCustomer = useActivateCustomer();
  const deactivateCustomer = useDeactivateCustomer();

  // Handlers
  const handleView = useCallback(
    (customer) => {
      navigate(ROUTES.CUSTOMERS.VIEW(customer.id));
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (customer) => {
      navigate(ROUTES.CUSTOMERS.EDIT(customer.id));
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (customer) => {
      const confirmed = await confirm({
        title: "Delete Customer",
        description: `Are you sure you want to delete "${customer.firstName} ${customer.lastName}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
      });

      if (confirmed) {
        deleteCustomer.mutate(customer.id);
      }
    },
    [confirm, deleteCustomer]
  );

  const handleActivate = useCallback(
    async (customer) => {
      activateCustomer.mutate(customer.id);
    },
    [activateCustomer]
  );

  const handleDeactivate = useCallback(
    async (customer) => {
      const confirmed = await confirm({
        title: "Deactivate Customer",
        description: `Deactivate "${customer.firstName} ${customer.lastName}"? They won't be able to make purchases.`,
        confirmText: "Deactivate",
        cancelText: "Cancel",
      });

      if (confirmed) {
        deactivateCustomer.mutate(customer.id);
      }
    },
    [confirm, deactivateCustomer]
  );

  // Get columns with handlers
  const columns = useMemo(
    () =>
      getCustomerColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onActivate: handleActivate,
        onDeactivate: handleDeactivate,
      }),
    [handleView, handleEdit, handleDelete, handleActivate, handleDeactivate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer database"
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
            <Button onClick={() => navigate(ROUTES.CUSTOMERS.NEW)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search customers..."
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

export default CustomersPage;
