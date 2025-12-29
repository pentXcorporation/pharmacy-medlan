/**
 * Transactions Page
 * Displays all financial transactions
 */

import { useState, useMemo, useCallback } from "react";
import { Plus, Download, Filter } from "lucide-react";
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
import { TRANSACTION_TYPE, PAYMENT_METHOD } from "@/constants";
import TransactionFormDialog from "./TransactionFormDialog";
import { toast } from "sonner";

const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);

  // Mock data - replace with actual API call
  const mockData = {
    content: [],
    total: 0,
    pageCount: 0,
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => formatDate(row.getValue("date")),
      },
      {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.getValue("reference")}</span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type");
          const variant =
            type === "INCOME"
              ? "success"
              : type === "EXPENSE"
              ? "destructive"
              : "default";
          return <Badge variant={variant}>{type}</Badge>;
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = row.getValue("amount");
          const type = row.original.type;
          return (
            <span
              className={`font-semibold ${
                type === "INCOME" ? "text-green-600" : "text-red-600"
              }`}
            >
              {type === "INCOME" ? "+" : "-"}
              {formatCurrency(amount)}
            </span>
          );
        },
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => row.getValue("paymentMethod") || "-",
      },
    ],
    []
  );

  const stats = {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    transactionCount: 0,
  };

  const handleCreateTransaction = useCallback(async (data) => {
    try {
      // TODO: Call API to create transaction
      console.log("Creating transaction:", data);

      toast.success("Transaction Created", {
        description: "The transaction has been successfully created.",
      });

      // TODO: Refresh data after creation
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create transaction. Please try again.",
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View and manage all financial transactions"
      >
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      <TransactionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateTransaction}
      />

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpense)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.netBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.transactionCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="TRANSFER">Transfer</SelectItem>
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
        emptyMessage="No transactions found."
      />
    </div>
  );
};

export default TransactionsPage;
