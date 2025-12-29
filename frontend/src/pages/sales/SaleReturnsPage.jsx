/**
 * Sale Returns Page
 * Process and manage sale returns
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, DataTable } from "@/components/common";
import { useSaleReturns, useApproveSaleReturn } from "@/features/sales";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { ROUTES } from "@/config";

// Status badge variants
const statusConfig = {
  PENDING: { label: "Pending", variant: "warning" },
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  COMPLETED: { label: "Completed", variant: "default" },
};

const SaleReturnsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    page: 0,
    size: 20,
  });

  // Query
  const { data, isLoading } = useSaleReturns({
    ...filters,
    status: filters.status === "all" ? undefined : filters.status,
  });
  const approveMutation = useApproveSaleReturn();

  const returns = data?.content || data || [];
  const totalPages = data?.totalPages || 1;

  // Columns
  const columns = [
    {
      accessorKey: "returnNumber",
      header: "Return #",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("returnNumber")}</span>
      ),
    },
    {
      accessorKey: "originalInvoiceNumber",
      header: "Original Invoice",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => row.getValue("customerName") || "Walk-in",
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <span className="truncate max-w-[200px] block">
          {row.getValue("reason")}
        </span>
      ),
    },
    {
      accessorKey: "refundAmount",
      header: "Refund Amount",
      cell: ({ row }) => (
        <span className="font-bold">
          {formatCurrency(row.getValue("refundAmount"))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") || "PENDING";
        const config = statusConfig[status] || statusConfig.PENDING;
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const returnItem = row.original;
        const isPending = returnItem.status === "PENDING";

        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(ROUTES.SALE_RETURNS.VIEW(returnItem.id))
              }
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => approveMutation.mutate(returnItem.id)}
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" title="Reject">
                  <XCircle className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Sale Returns"
        description="View and manage sale returns"
      >
        <Button onClick={() => navigate(ROUTES.SALE_RETURNS.CREATE)}>
          Process Return
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by return or invoice number..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 0 })
          }
          className="sm:w-80"
        />
        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters({ ...filters, status: value, page: 0 })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={returns}
        isLoading={isLoading}
        pagination={{
          pageIndex: filters.page,
          pageSize: filters.size,
          pageCount: totalPages,
          onPageChange: (page) => setFilters({ ...filters, page }),
        }}
      />
    </div>
  );
};

export default SaleReturnsPage;
