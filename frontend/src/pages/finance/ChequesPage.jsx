/**
 * Cheques Page
 * Manages cheque payments and collections
 */

import { useState, useMemo, useCallback } from "react";
import { Plus, Download } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { CHEQUE_STATUS } from "@/constants";
import ChequeFormDialog from "./ChequeFormDialog";
import { toast } from "sonner";

const ChequesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "chequeDate", desc: true }]);

  const mockData = {
    content: [],
    total: 0,
    pageCount: 0,
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "chequeNumber",
        header: "Cheque #",
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {row.getValue("chequeNumber")}
          </span>
        ),
      },
      {
        accessorKey: "chequeDate",
        header: "Cheque Date",
        cell: ({ row }) => formatDate(row.getValue("chequeDate")),
      },
      {
        accessorKey: "bankName",
        header: "Bank",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "payeeName",
        header: "Payee",
        meta: { className: "hidden lg:table-cell" },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-semibold">
            {formatCurrency(row.getValue("amount"))}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          const variant =
            status === "CLEARED"
              ? "success"
              : status === "PENDING"
              ? "warning"
              : status === "BOUNCED"
              ? "destructive"
              : "default";
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        accessorKey: "clearanceDate",
        header: "Clearance Date",
        meta: { className: "hidden xl:table-cell" },
        cell: ({ row }) => {
          const date = row.getValue("clearanceDate");
          return date ? formatDate(date) : "-";
        },
      },
    ],
    []
  );

  const stats = {
    totalCheques: 0,
    pendingAmount: 0,
    clearedAmount: 0,
    bouncedCount: 0,
  };

  const handleCreateCheque = useCallback(async (data) => {
    try {
      // TODO: Call API to create cheque
      console.log("Creating cheque:", data);

      toast.success("Cheque Created", {
        description: "The cheque has been successfully recorded.",
      });

      // TODO: Refresh data after creation
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create cheque. Please try again.",
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cheques"
        description="Track cheque payments and collections"
      >
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Cheque
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      <ChequeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateCheque}
      />

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cheques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCheques}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.pendingAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cleared Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.clearedAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.bouncedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search cheques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CLEARED">Cleared</SelectItem>
            <SelectItem value="BOUNCED">Bounced</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockData.content}
        isLoading={false}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: mockData.total,
          pageCount: mockData.pageCount,
        }}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No cheques found."
      />
    </div>
  );
};

export default ChequesPage;
