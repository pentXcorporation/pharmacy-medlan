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
  const [selectedCheque, setSelectedCheque] = useState(null);

  // Fetch cheques with backend integration
  const fetchCheques = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: sorting.length > 0 
          ? `${sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}`
          : 'chequeDate,desc',
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await chequeService.getAll(params);
      setData({
        content: response.data.content || [],
        total: response.data.totalElements || 0,
        pageCount: response.data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching cheques:', error);
      toast.error('Failed to load cheques');
      setData({ content: [], total: 0, pageCount: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [pagination, sorting, statusFilter, searchQuery]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await chequeService.getStats();
      setStats(response.data || {
        totalCheques: 0,
        pendingAmount: 0,
        clearedAmount: 0,
        bouncedCount: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchCheques();
  }, [fetchCheques]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Define handler functions BEFORE using them in columns to avoid TDZ error
  const handleEditCheque = useCallback((cheque) => {
    setSelectedCheque(cheque);
    setIsFormOpen(true);
  }, []);

  const handleDeleteCheque = useCallback(async (id) => {
    if (!confirm('Are you sure you want to delete this cheque?')) return;
    
    try {
      await chequeService.delete(id);
      toast.success('Cheque deleted successfully');
      fetchCheques();
      fetchStats();
    } catch (error) {
      console.error('Error deleting cheque:', error);
      toast.error(error.response?.data?.message || 'Failed to delete cheque');
    }
  }, [fetchCheques, fetchStats]);

  const handleCreateCheque = useCallback(async (chequeData) => {
    try {
      if (selectedCheque) {
        await chequeService.update(selectedCheque.id, chequeData);
        toast.success('Cheque updated successfully');
      } else {
        await chequeService.create(chequeData);
        toast.success('Cheque created successfully');
      }
      setIsFormOpen(false);
      setSelectedCheque(null);
      fetchCheques();
      fetchStats();
    } catch (error) {
      console.error('Error saving cheque:', error);
      toast.error('Error', {
        description: error.response?.data?.message || 'Failed to save cheque. Please try again.',
      });
    }
  }, [selectedCheque, fetchCheques, fetchStats]);

  const handleStatusChange = useCallback(async (id, newStatus) => {
    try {
      await chequeService.updateStatus(id, newStatus);
      toast.success('Cheque status updated');
      fetchCheques();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  }, [fetchCheques, fetchStats]);

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
        accessorKey: "receivedFrom",
        header: "Received From",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => row.getValue("receivedFrom") || "-",
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
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditCheque(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteCheque(row.original.id)}
              className="text-destructive"
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [handleEditCheque, handleDeleteCheque]
  );

  const handleExport = useCallback(() => {
    toast.info('Export functionality coming soon');
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
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedCheque(null);
        }}
        onSubmit={handleCreateCheque}
        cheque={selectedCheque}
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
