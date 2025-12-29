/**
 * Invoices Page
 * Manages customer and supplier invoices
 */

import { useState, useMemo } from "react";
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

const InvoicesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "invoiceDate", desc: true }]);

  // Mock data
  const mockData = {
    content: [],
    total: 0,
    pageCount: 0,
  };

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

  const stats = {
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    outstandingAmount: 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Manage all invoices">
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

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
        emptyMessage="No invoices found."
      />
    </div>
  );
};

export default InvoicesPage;
