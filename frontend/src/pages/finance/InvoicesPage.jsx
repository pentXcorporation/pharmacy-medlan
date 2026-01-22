/**
 * Invoices Page
 * Manages customer and supplier invoices
 */

import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Download, Eye, Edit, FileText } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { INVOICE_STATUS, PAYMENT_STATUS } from "@/constants";
import InvoiceFormDialog from "./InvoiceFormDialog";
import { toast } from "sonner";
import { invoiceService } from "@/services";
import { useBranchStore } from "@/store";

const InvoicesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "invoiceDate", desc: true }]);
  
  const queryClient = useQueryClient();

  // Fetch invoices based on status filter
  const { data: invoicesData, isLoading, error } = useQuery({
    queryKey: ['invoices', statusFilter, pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      try {
        const response = statusFilter === 'all' 
          ? await invoiceService.getAll({
              page: pagination.pageIndex,
              size: pagination.pageSize,
            })
          : await invoiceService.getByStatus(statusFilter, {
              page: pagination.pageIndex,
              size: pagination.pageSize,
            });
        
        console.log('Invoice API Response:', response);
        
        // Handle different response structures
        const data = response.data?.data || response.data || {};
        const content = Array.isArray(data) ? data : (data.content || []);
        
        return {
          content: content,
          total: data.totalElements || content.length,
          pageCount: data.totalPages || Math.ceil(content.length / pagination.pageSize),
        };
      } catch (error) {
        console.error('Invoice fetch error:', error);
        return { content: [], total: 0, pageCount: 0 };
      }
    },
    refetchInterval: 30000,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice #",
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {row.getValue("invoiceNumber")}
          </span>
        ),
      },
      {
        accessorKey: "invoiceDate",
        header: "Date",
        cell: ({ row }) => formatDate(row.getValue("invoiceDate")),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "totalAmount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-semibold">
            {formatCurrency(row.getValue("totalAmount"))}
          </span>
        ),
      },
      {
        accessorKey: "balanceAmount",
        header: "Balance",
        meta: { className: "hidden sm:table-cell" },
        cell: ({ row }) => {
          const balance = row.getValue("balanceAmount");
          return (
            <span className={balance > 0 ? "text-orange-600 font-medium" : ""}>
              {formatCurrency(balance)}
            </span>
          );
        },
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => {
          const status = row.getValue("paymentStatus");
          const variant =
            status === "PAID"
              ? "success"
              : status === "PARTIAL"
              ? "warning"
              : "destructive";
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => {
          const status = row.getValue("status");
          return <Badge variant="outline">{status}</Badge>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  // Calculate statistics from fetched data
  const stats = useMemo(() => {
    const invoices = invoicesData?.content || [];
    return {
      totalInvoices: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0),
      paidAmount: invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0),
      outstandingAmount: invoices.reduce((sum, inv) => sum + (inv.balanceAmount || 0), 0),
    };
  }, [invoicesData]);

  const handleCreateInvoice = useCallback(async (data) => {
    try {
      console.log("Creating invoice:", data);

      toast.success("Invoice Created", {
        description: "The invoice has been successfully created.",
      });

      // Refresh data after creation
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create invoice. Please try again.",
      });
    }
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Manage all invoices">
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      <InvoiceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateInvoice}
      />

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.paidAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.outstandingAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search invoices..."
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
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
          Failed to load invoices. Please try again.
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={invoicesData?.content || []}
        isLoading={isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: invoicesData?.total || 0,
          pageCount: invoicesData?.pageCount || 0,
        }}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No invoices found."
      />
    </div>
  );
};

export default InvoicesPage;
