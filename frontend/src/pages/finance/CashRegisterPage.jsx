/**
 * Cash Register Page
 * Manages daily cash register operations and balances
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Plus,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
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
import { cashRegisterService } from "@/services";
import { useAuth } from "@/hooks";

const CashRegisterPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRegister, setCurrentRegister] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([{ id: "timestamp", desc: true }]);

  // Fetch current register and transactions
  useEffect(() => {
    const branchId = user?.branchId || user?.branch?.id || user?.branch;
    if (branchId) {
      fetchCurrentRegister(branchId);
    }
  }, [user]);

  const fetchCurrentRegister = async (branchId) => {
    try {
      setIsLoading(true);
      const register = await cashRegisterService.getCurrentRegister(branchId);
      setCurrentRegister(register);
      
      if (register?.id) {
        const txns = await cashRegisterService.getRegisterTransactions(register.id);
        setTransactions(txns || []);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // No open register
        setCurrentRegister(null);
        setTransactions([]);
      } else {
        toast.error("Error", {
          description: "Failed to load cash register data.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRegister = useCallback(async () => {
    // Try different possible branch field names
    const branchId = user?.branchId || user?.branch?.id || user?.branch;
    
    console.log("User object:", user); // Debug log
    console.log("Branch ID:", branchId); // Debug log
    
    if (!branchId) {
      toast.error("Error", {
        description: "Branch information not found. Please ensure your user account is assigned to a branch.",
      });
      return;
    }

    const openingBalance = prompt("Enter opening balance:", "0");
    if (openingBalance === null) return;

    try {
      setIsLoading(true);
      const data = {
        branchId: branchId,
        openingBalance: parseFloat(openingBalance),
        notes: "Register opened",
      };

      const register = await cashRegisterService.openRegister(data);
      setCurrentRegister(register);
      setTransactions([]);

      toast.success("Register Opened", {
        description: "Cash register has been opened successfully.",
      });
    } catch (error) {
      console.error("Error opening register:", error); // Debug log
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to open register.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleCloseRegister = useCallback(async () => {
    if (!currentRegister?.id) return;

    const closingBalance = prompt("Enter closing balance:", currentRegister.expectedClosingBalance);
    if (closingBalance === null) return;

    try {
      setIsLoading(true);
      const data = {
        closingBalance: parseFloat(closingBalance),
        notes: "Register closed",
      };

      const register = await cashRegisterService.closeRegister(currentRegister.id, data);
      setCurrentRegister(register);

      toast.success("Register Closed", {
        description: `Register closed. Discrepancy: ${formatCurrency(register.discrepancy)}`,
      });

      // Refresh data
      await fetchCurrentRegister();
    } catch (error) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to close register.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentRegister]);

  const handleCashTransaction = useCallback(async (data) => {
    if (!currentRegister?.id) {
      toast.error("Error", {
        description: "No open register found.",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const transactionData = {
        type: data.type,
        amount: parseFloat(data.amount),
        description: data.description,
        category: data.category,
      };

      let register;
      if (data.type === "CASH_OUT" || data.type === "EXPENSE" || data.type === "REFUND") {
        register = await cashRegisterService.recordCashOut(currentRegister.id, transactionData);
      } else {
        register = await cashRegisterService.recordCashIn(currentRegister.id, transactionData);
      }

      setCurrentRegister(register);
      
      // Refresh transactions
      const txns = await cashRegisterService.getRegisterTransactions(register.id);
      setTransactions(txns || []);

      toast.success("Transaction Recorded", {
        description: "Cash register transaction has been recorded successfully.",
      });

      setIsFormOpen(false);
    } catch (error) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to record transaction.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentRegister]);

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
            type === "CASH_IN" || type === "SALE" || type === "COLLECTION"
              ? "success"
              : type === "CASH_OUT" || type === "EXPENSE" || type === "REFUND"
              ? "destructive"
              : "default";
          return (
            <Badge variant={variant}>
              {type.replace("_", " ")}
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
          const isCredit = ["CASH_OUT", "EXPENSE", "REFUND"].includes(type);
          return (
            <span
              className={`font-semibold ${
                isCredit ? "text-red-600" : "text-green-600"
              }`}
            >
              {isCredit ? "-" : "+"}
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
        accessorKey: "category",
        header: "Category",
        meta: { className: "hidden lg:table-cell" },
        cell: ({ row }) => row.getValue("category") || "-",
      },
      {
        accessorKey: "userName",
        header: "Handled By",
        meta: { className: "hidden xl:table-cell" },
        cell: ({ row }) => row.getValue("userName") || "-",
      },
    ],
    []
  );

  const stats = {
    openingBalance: currentRegister?.openingBalance || 0,
    cashIn: (currentRegister?.cashInTotal || 0) + (currentRegister?.salesTotal || 0),
    cashOut: currentRegister?.cashOutTotal || 0,
    currentBalance: currentRegister?.expectedClosingBalance || 0,
  };

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter(
        (txn) =>
          txn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((txn) => txn.type === typeFilter);
    }

    return filtered;
  }, [transactions, searchQuery, typeFilter]);

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, pagination]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash Register"
        description="Manage daily cash register operations"
      >
        <div className="flex gap-2">
          {!currentRegister ? (
            <Button onClick={handleOpenRegister} disabled={isLoading}>
              <Unlock className="mr-2 h-4 w-4" />
              Open Register
            </Button>
          ) : currentRegister.status === "OPEN" ? (
            <>
              <Button onClick={() => setIsFormOpen(true)} disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
              <Button variant="outline" onClick={handleCloseRegister} disabled={isLoading}>
                <Lock className="mr-2 h-4 w-4" />
                Close Register
              </Button>
            </>
          ) : (
            <Badge variant="secondary" className="px-4 py-2">
              Register Closed ({currentRegister.status})
            </Badge>
          )}
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
            <SelectItem value="SALE">Sale</SelectItem>
            <SelectItem value="REFUND">Refund</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="COLLECTION">Collection</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        isLoading={isLoading}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          total: filteredTransactions.length,
          pageCount: Math.ceil(filteredTransactions.length / pagination.pageSize),
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
