/**
 * Cash Register Page
 * Manages daily cash register operations and balances
 */

import { useState, useMemo, useCallback } from "react";
import {
  Plus,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
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
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatters";
import CashRegisterFormDialog from "./CashRegisterFormDialog";
import { toast } from "sonner";

const CashRegisterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "timestamp", desc: true }]);

  // Mock data
  const mockData = {
    content: [],
    total: 0,
    pageCount: 0,
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "timestamp",
        header: "Date & Time",
        cell: ({ row }) => formatDateTime(row.getValue("timestamp")),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type");
          const variant =
            type === "CASH_IN"
              ? "success"
              : type === "CASH_OUT"
              ? "destructive"
              : "default";
          return (
            <Badge variant={variant}>
              {type === "CASH_IN"
                ? "Cash In"
                : type === "CASH_OUT"
                ? "Cash Out"
                : type}
            </Badge>
          );
        },
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
                type === "CASH_IN" ? "text-green-600" : "text-red-600"
              }`}
            >
              {type === "CASH_IN" ? "+" : "-"}
              {formatCurrency(amount)}
            </span>
          );
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "reference",
        header: "Reference",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => {
          const ref = row.getValue("reference");
          return ref ? <span className="font-mono text-sm">{ref}</span> : "-";
        },
      },
      {
        accessorKey: "handledBy",
        header: "Handled By",
        meta: { className: "hidden xl:table-cell" },
        cell: ({ row }) => row.getValue("handledBy") || "-",
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => (
          <span className="font-semibold">
            {formatCurrency(row.getValue("balance") || 0)}
          </span>
        ),
      },
    ],
    []
  );

  const stats = {
    openingBalance: 0,
    cashIn: 0,
    cashOut: 0,
    currentBalance: 0,
  };

  const handleCashTransaction = useCallback(async (data) => {
    try {
      // TODO: Call API to record cash transaction
      console.log("Recording cash transaction:", data);

      toast.success("Transaction Recorded", {
        description:
          "Cash register transaction has been recorded successfully.",
      });

      // TODO: Refresh data after creation
    } catch (error) {
      toast.error("Error", {
        description: "Failed to record transaction. Please try again.",
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash Register"
        description="Manage daily cash register operations"
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

      <CashRegisterFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCashTransaction}
      />

      {/* Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Opening Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.openingBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash In</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.cashIn)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Out</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.cashOut)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.currentBalance)}
            </div>
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
            <SelectItem value="CASH_IN">Cash In</SelectItem>
            <SelectItem value="CASH_OUT">Cash Out</SelectItem>
            <SelectItem value="OPENING">Opening Balance</SelectItem>
            <SelectItem value="CLOSING">Closing Balance</SelectItem>
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
        emptyMessage="No cash register transactions found."
      />
    </div>
  );
};

export default CashRegisterPage;
