import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, TrendingUp, TrendingDown, Download, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { cashBookService } from "@/services";
import { useBranch } from "@/hooks";
import { toast } from "sonner";

/**
 * Cash Book Page - Track all cash transactions
 * Records cash receipts and payments with running balance
 */
const CashBookPage = () => {
  const { selectedBranch } = useBranch();
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    type: "all",
  });

  const [cashTransactions, setCashTransactions] = useState([]);
  const [summary, setSummary] = useState({
    openingBalance: 0,
    totalReceipts: 0,
    totalPayments: 0,
    closingBalance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch cash book data
  useEffect(() => {
    if (selectedBranch?.id) {
      fetchCashBookData();
    }
  }, [selectedBranch, filters.startDate, filters.endDate]);

  const fetchCashBookData = async () => {
    if (!selectedBranch?.id) {
      toast.error("Please select a branch");
      return;
    }

    setLoading(true);
    try {
      // Fetch transactions
      const transactionsResponse = await cashBookService.getByBranchAndDateRange(
        selectedBranch.id,
        filters.startDate,
        filters.endDate
      );

      // Fetch summary
      const summaryResponse = await cashBookService.getSummary(
        selectedBranch.id,
        filters.startDate,
        filters.endDate
      );

      const transactions = transactionsResponse.data.data || [];
      const summaryData = summaryResponse.data.data || {};

      // Filter by type if needed
      let filteredTransactions = transactions;
      if (filters.type === "RECEIPT") {
        filteredTransactions = transactions.filter(t => t.debitAmount > 0);
      } else if (filters.type === "PAYMENT") {
        filteredTransactions = transactions.filter(t => t.creditAmount > 0);
      }

      setCashTransactions(filteredTransactions);
      setSummary({
        openingBalance: summaryData.openingBalance || 0,
        totalReceipts: summaryData.totalReceipts || 0,
        totalPayments: summaryData.totalPayments || 0,
        closingBalance: summaryData.closingBalance || 0,
      });
    } catch (error) {
      console.error("Error fetching cash book data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch cash book data");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchCashBookData();
  };

  const handleExport = async () => {
    if (!selectedBranch?.id) {
      toast.error("Please select a branch");
      return;
    }

    setExporting(true);
    try {
      const response = await cashBookService.export({
        branchId: selectedBranch.id,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cash-book-${filters.startDate}-to-${filters.endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Cash book exported successfully");
    } catch (error) {
      console.error("Error exporting cash book:", error);
      toast.error("Failed to export cash book");
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "N/A", time: "" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB"),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cash Book</h1>
          <p className="text-gray-600 mt-1">Track all cash receipts and payments</p>
          {selectedBranch && (
            <p className="text-sm text-gray-500 mt-1">Branch: {selectedBranch.name}</p>
          )}
        </div>
        <Button onClick={handleExport} disabled={exporting || loading}>
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Cash Book
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Opening Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.openingBalance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
              Total Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.totalReceipts)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
              Total Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.totalPayments)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Closing Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.closingBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="RECEIPT">Receipts Only</SelectItem>
                  <SelectItem value="PAYMENT">Payments Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={handleApplyFilters} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Apply Filters"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Book Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Book Entries</CardTitle>
          <CardDescription>
            Chronological record of all cash transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Loading cash book entries...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Receipt (Rs.)</TableHead>
                  <TableHead className="text-right">Payment (Rs.)</TableHead>
                  <TableHead className="text-right">Balance (Rs.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell colSpan={6}>Opening Balance</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(summary.openingBalance)}
                  </TableCell>
                </TableRow>
                {cashTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No transactions found for the selected date range
                    </TableCell>
                  </TableRow>
                ) : (
                  cashTransactions.map((transaction) => {
                    const { date, time } = formatDateTime(transaction.createdAt || transaction.transactionDate);
                    const isReceipt = transaction.debitAmount > 0;
                    
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{date}</div>
                            <div className="text-sm text-gray-500">{time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {transaction.referenceNumber || "N/A"}
                          </code>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <Badge variant={isReceipt ? "success" : "destructive"}>
                            {isReceipt ? "RECEIPT" : "PAYMENT"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {isReceipt ? formatCurrency(transaction.debitAmount) : "-"}
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          {!isReceipt ? formatCurrency(transaction.creditAmount) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(transaction.runningBalance)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
                {cashTransactions.length > 0 && (
                  <TableRow className="bg-gray-100 font-bold">
                    <TableCell colSpan={4}>Totals</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(summary.totalReceipts)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(summary.totalPayments)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(summary.closingBalance)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBookPage;
