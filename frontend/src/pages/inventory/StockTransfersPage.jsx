/**
 * Stock Transfers Page
 * Displays and manages stock transfers between branches
 */

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import { ROUTES } from "@/config";
import {
  useStockTransfers,
  useApproveStockTransfer,
  useRejectStockTransfer,
  useDispatchStockTransfer,
  getStockTransferColumns,
} from "@/features/inventory";
import { DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirm } from "@/components/common/ConfirmDialog";
import { TRANSFER_STATUS, TRANSFER_STATUS_LABELS } from "@/constants";

/**
 * StockTransfersPage component
 */
const StockTransfersPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  // Filters state
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
          : "requestedDate,desc",
      ...(statusFilter && { status: statusFilter }),
    }),
    [pagination, sorting, statusFilter]
  );

  // Fetch stock transfers
  const { data, isLoading, isFetching } = useStockTransfers(queryParams);

  // Mutations
  const approveTransfer = useApproveStockTransfer();
  const rejectTransfer = useRejectStockTransfer();
  const dispatchTransfer = useDispatchStockTransfer();

  // Handlers
  const handleView = useCallback(
    (transfer) => {
      navigate(ROUTES.INVENTORY.TRANSFERS.VIEW(transfer.id));
    },
    [navigate]
  );

  const handleApprove = useCallback(
    async (transfer) => {
      const confirmed = await confirm({
        title: "Approve Stock Transfer",
        description: `Approve transfer ${transfer.transferNumber}?`,
        confirmText: "Approve",
        cancelText: "Cancel",
      });

      if (confirmed) {
        approveTransfer.mutate(transfer.id);
      }
    },
    [confirm, approveTransfer]
  );

  const handleReject = useCallback(
    async (transfer) => {
      const confirmed = await confirm({
        title: "Reject Stock Transfer",
        description: `Are you sure you want to reject transfer ${transfer.transferNumber}?`,
        confirmText: "Reject",
        cancelText: "Cancel",
        variant: "destructive",
      });

      if (confirmed) {
        rejectTransfer.mutate({ id: transfer.id, reason: "Rejected by user" });
      }
    },
    [confirm, rejectTransfer]
  );

  const handleDispatch = useCallback(
    async (transfer) => {
      const confirmed = await confirm({
        title: "Dispatch Stock Transfer",
        description: `Mark transfer ${transfer.transferNumber} as dispatched?`,
        confirmText: "Dispatch",
        cancelText: "Cancel",
      });

      if (confirmed) {
        dispatchTransfer.mutate(transfer.id);
      }
    },
    [confirm, dispatchTransfer]
  );

  const handleReceive = useCallback(
    (transfer) => {
      navigate(ROUTES.INVENTORY.TRANSFERS.RECEIVE(transfer.id));
    },
    [navigate]
  );

  // Get columns
  const columns = useMemo(
    () =>
      getStockTransferColumns({
        onView: handleView,
        onApprove: handleApprove,
        onReject: handleReject,
        onDispatch: handleDispatch,
        onReceive: handleReceive,
      }),
    [handleView, handleApprove, handleReject, handleDispatch, handleReceive]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Stock Transfers</CardTitle>
            <CardDescription>
              Manage stock transfers between branches
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => navigate(ROUTES.INVENTORY.TRANSFERS.NEW)}>
              <Plus className="mr-2 h-4 w-4" />
              New Transfer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {Object.entries(TRANSFER_STATUS_LABELS).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default StockTransfersPage;
