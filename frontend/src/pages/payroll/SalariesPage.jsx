/**
 * Salaries Page
 * Manage employee salary payments
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
import SalaryPaymentDialog from "./SalaryPaymentDialog";
import { toast } from "sonner";
import { payrollService } from "@/services";

const SalariesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);
  const [stats, setStats] = useState({
    totalSalaries: 0,
    paidAmount: 0,
    pendingAmount: 0,
    employeeCount: 0,
  });

  // Fetch salary data
  useEffect(() => {
    fetchSalaries();
  }, [pagination.pageIndex, pagination.pageSize, statusFilter, searchQuery]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.pageIndex,
        size: pagination.pageSize,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await payrollService.getAll(params);
      console.log("Payroll API Response:", response.data);
      
      // Spring Boot Page response structure is directly in response.data
      const pageData = response.data;
      const salaries = pageData?.content || [];
      const totalElements = pageData?.totalElements || 0;

      console.log("Salaries data:", salaries);
      setSalaryData(salaries);
      setTotalElements(totalElements);

      // Calculate stats - all records from backend are paid
      const total = salaries.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);
      const uniqueEmployees = new Set(salaries.map((s) => s.employeeId)).size;

      setStats({
        totalSalaries: total,
        paidAmount: total, // All records are paid
        pendingAmount: 0,  // No pending since we only store paid salaries
        employeeCount: uniqueEmployees,
      });
    } catch (error) {
      console.error("Failed to fetch salaries:", error);
      toast.error("Failed to load salary records");
      setSalaryData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "employeeName",
        header: "Employee",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("employeeName") || row.original.workerName}</div>
            <div className="text-xs text-muted-foreground">
              ID: {row.original.employeeId}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "paymentDate",
        header: "Payment Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("paymentDate"));
          return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-semibold text-lg">
            {formatCurrency(row.getValue("amount") || 0)}
          </span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => {
          const method = row.getValue("paymentMethod");
          return method?.replace(/_/g, " ") || "N/A";
        },
      },
      {
        accessorKey: "reason",
        header: "Details",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => (
          <div className="max-w-xs truncate text-xs text-muted-foreground">
            {row.getValue("reason") || "No details"}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Recorded",
        meta: { className: "hidden xl:table-cell" },
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        },
      },
    ],
    []
  );

  const handlePaySalary = useCallback(async (data) => {
    try {
      // Calculate net salary
      const basicSalary = parseFloat(data.basicSalary) || 0;
      const allowances = parseFloat(data.allowances) || 0;
      const deductions = parseFloat(data.deductions) || 0;
      const netSalary = basicSalary + allowances - deductions;

      // Convert month (YYYY-MM) to last day of that month for paymentDate
      const [year, month] = data.month.split('-');
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const paymentDate = `${year}-${month}-${lastDayOfMonth}`;

      // Transform data to match backend DTO
      const payload = {
        employeeId: parseInt(data.employeeId),
        workerName: data.employeeName,
        paymentDate: paymentDate,
        amount: netSalary,
        reason: `Salary for ${data.month} - Basic: Rs.${basicSalary.toFixed(2)}, Allowances: Rs.${allowances.toFixed(2)}, Deductions: Rs.${deductions.toFixed(2)}`,
        paymentMethod: data.paymentMethod,
        remarks: data.notes || null,
      };

      await payrollService.create(payload);

      // Close the dialog
      setIsFormOpen(false);

      toast.success("Salary Paid", {
        description: "Salary payment has been recorded successfully.",
      });

      // Refresh the data
      await fetchSalaries();
    } catch (error) {
      console.error("Error processing salary:", error);
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to process salary payment. Please try again.",
      });
    }
  }, [fetchSalaries]);

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
        data={salaryData}
        isLoading={loading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: totalElements,
          pageCount: Math.ceil(totalElements / pagination.pageSize),
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
