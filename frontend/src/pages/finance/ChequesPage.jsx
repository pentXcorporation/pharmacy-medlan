/**
 * Cheques Page
 * Manages cheque payments and collections
 */

import { useState, useMemo, useCallback, useEffect } from "react";
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
import { chequeService } from "@/services";

const ChequesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "chequeDate", desc: true }]);
  const [data, setData] = useState({ content: [], total: 0, pageCount: 0 });
  const [stats, setStats] = useState({
    totalCheques: 0,
    pendingAmount: 0,
    clearedAmount: 0,
    bouncedCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // NOTE: Backend cheques endpoints are not yet implemented
  // Using empty data until backend is ready
  const fetchCheques = useCallback(async () => {
    // Placeholder - backend not ready yet
    setIsLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    // Placeholder - backend not ready yet
  }, []);

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

  const handleCreateCheque = useCallback(async (chequeData) => {
    try {
      // TODO: Enable when backend is ready
      // await chequeService.create(chequeData);

      toast.info("Backend Not Ready", {
        description: "The cheque feature is under development. Backend endpoints are not yet available.",
      });

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating cheque:", error);
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to create cheque. Please try again.",
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
        data={data.content}
        isLoading={isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: data.total,
          pageCount: data.pageCount,
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
