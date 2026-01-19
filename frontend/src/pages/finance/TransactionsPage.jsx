/**
 * Transactions Page
 * Displays all financial transactions
 */

import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, RefreshCw } from "lucide-react";
import { PageHeader, DataTable } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBranchStore } from "@/store";
import { inventoryTransactionService } from "@/services";
import { toast } from "sonner";
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

const TransactionsPage = () => {
  const queryClient = useQueryClient();
  const { selectedBranch } = useBranchStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);

  // Fetch inventory transactions
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["inventoryTransactions", selectedBranch?.id, pagination, typeFilter],
    queryFn: () => inventoryTransactionService.getByBranch(selectedBranch?.id, {
      page: pagination.pageIndex,
      size: pagination.pageSize,
      ...(typeFilter !== "all" && { type: typeFilter }),
    }),
    enabled: Boolean(selectedBranch?.id),
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  // Log errors
  useEffect(() => {
    if (error) {
      console.error('Transaction fetch error:', error);
      toast.error('Failed to load transactions');
    }
  }, [error]);

  // Extract transactions from response
  const transactions = data?.content || data || [];
  const totalPages = data?.totalPages || 1;
  const totalElements = data?.totalElements || transactions.length || 0;

  const columns = useMemo(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => formatDate(row.getValue("createdAt") || row.original.transactionDate),
      },
      {
        accessorKey: "referenceNumber",
        header: "Reference",
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {row.getValue("referenceNumber") || row.original.transactionId || "-"}
          </span>
        ),
      },
      {
        accessorKey: "transactionType",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("transactionType") || row.original.type;
          const variant =
            type === "IN" || type === "GRN" || type === "PURCHASE" || type?.includes("IN")
              ? "success"
              : type === "OUT" || type === "SALE" || type?.includes("OUT")
              ? "destructive"
              : "default";
          return <Badge variant={variant}>{type || "N/A"}</Badge>;
        },
      },
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => row.original.product?.productName || row.original.productName || "-",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
          const qty = row.getValue("quantity");
          const type = row.original.transactionType || row.original.type;
          return (
            <span
              className={`font-semibold ${
                type?.includes("IN") || type === "GRN" || type === "PURCHASE" ? "text-green-600" : "text-red-600"
              }`}
            >
              {type?.includes("IN") || type === "GRN" || type === "PURCHASE" ? "+" : "-"}
              {qty}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const qty = row.original.quantity || 0;
          const price = row.original.unitPrice || row.original.costPrice || 0;
          const amount = qty * price;
          const type = row.original.transactionType || row.original.type;
          return (
            <span
              className={`font-semibold ${
                type?.includes("IN") || type === "GRN" || type === "PURCHASE" ? "text-green-600" : "text-red-600"
              }`}
            >
              {type?.includes("IN") || type === "GRN" || type === "PURCHASE" ? "+" : "-"}
              {formatCurrency(amount)}
            </span>
          );
        },
      },
      {
        accessorKey: "batchNumber",
        header: "Batch",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => row.getValue("batchNumber") || "-",
      },
    ],
    []
  );

  // Calculate statistics from transactions
  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        transactionCount: 0,
      };
    }

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      const amount = transaction.quantity * (transaction.unitPrice || transaction.costPrice || 0);
      const type = transaction.transactionType || transaction.type;
      
      if (type === "IN" || type === "GRN" || type === "PURCHASE" || type === "TRANSFER_IN" || type === "ADJUSTMENT_IN") {
        totalIncome += amount;
      } else if (type === "OUT" || type === "SALE" || type === "RETURN" || type === "TRANSFER_OUT" || type === "ADJUSTMENT_OUT") {
        totalExpense += amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      transactionCount: totalElements,
    };
  }, [transactions, totalElements]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Transactions"
        description="View and track all inventory movements and transactions"
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

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
            <SelectItem value="IN">Stock In</SelectItem>
            <SelectItem value="OUT">Stock Out</SelectItem>
            <SelectItem value="GRN">GRN</SelectItem>
            <SelectItem value="SALE">Sale</SelectItem>
            <SelectItem value="TRANSFER_IN">Transfer In</SelectItem>
            <SelectItem value="TRANSFER_OUT">Transfer Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      {!selectedBranch ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            Please select a branch to view transactions
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          isLoading={isLoading}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            pageCount: totalPages,
            onPageChange: (page) => setPagination({ ...pagination, pageIndex: page }),
          }}
          sorting={sorting}
          onSortingChange={setSorting}
          emptyMessage="No transactions found."
        />
      )}
    </div>
  );
};

export default TransactionsPage;
