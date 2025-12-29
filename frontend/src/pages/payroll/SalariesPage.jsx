/**
 * Salaries Page
 * Manage employee salary payments
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
import SalaryPaymentDialog from "./SalaryPaymentDialog";
import { toast } from "sonner";

const SalariesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);

  const mockData = {
    content: [],
    total: 0,
    pageCount: 0,
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "employeeName",
        header: "Employee",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("employeeName")}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.employeeCode}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "month",
        header: "Month",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "basicSalary",
        header: "Basic Salary",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => formatCurrency(row.getValue("basicSalary") || 0),
      },
      {
        accessorKey: "allowances",
        header: "Allowances",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => formatCurrency(row.getValue("allowances") || 0),
      },
      {
        accessorKey: "deductions",
        header: "Deductions",
        meta: { className: "hidden xl:table-cell" },
        cell: ({ row }) => (
          <span className="text-red-600">
            {formatCurrency(row.getValue("deductions") || 0)}
          </span>
        ),
      },
      {
        accessorKey: "netSalary",
        header: "Net Salary",
        cell: ({ row }) => (
          <span className="font-semibold text-lg">
            {formatCurrency(row.getValue("netSalary") || 0)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          const variant =
            status === "PAID"
              ? "success"
              : status === "PENDING"
              ? "warning"
              : "default";
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
    ],
    []
  );

  const stats = {
    totalSalaries: 0,
    paidAmount: 0,
    pendingAmount: 0,
    employeeCount: 0,
  };

  const handlePaySalary = useCallback(async (data) => {
    try {
      console.log("Processing salary payment:", data);

      toast.success("Salary Paid", {
        description: "Salary payment has been recorded successfully.",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to process salary payment. Please try again.",
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Salaries"
        description="Manage monthly salary payments"
      >
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Pay Salary
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      <SalaryPaymentDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handlePaySalary}
      />

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Salaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalSalaries)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.paidAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.pendingAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeeCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by employee name..."
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
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
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
        emptyMessage="No salary records found."
      />
    </div>
  );
};

export default SalariesPage;
