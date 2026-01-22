/**
 * Financial Report Page
 * Revenue, expenses, and cash flow analysis
 */

import { useState } from "react";
import { format, subDays } from "date-fns";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, LoadingSpinner } from "@/components/common";
import { ReportFilters, ReportSummaryCard } from "@/features/reports";
import { useFinancialReport } from "@/features/reports";
import { useActiveBranches } from "@/features/branches";
import { formatCurrency } from "@/utils/formatters";
import { exportFinancialReportCSV, printReport } from "@/utils/reportExport";
import { toast } from "sonner";

const FinancialReportPage = () => {
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    branchId: null,
  });

  const { data: branches } = useActiveBranches();
  const { data: report, isLoading, error } = useFinancialReport(filters);

  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const handleBranchChange = (branchId) => {
    setFilters((prev) => ({
      ...prev,
      branchId: branchId === "all" ? null : branchId,
    }));
  };

  const handleExport = (format) => {
    try {
      if (!report || !report.summary) {
        toast.error("No data available to export");
        return;
      }

      const branchName = branches?.find(b => b.id?.toString() === filters.branchId?.toString())?.branchName || "All Branches";
      const exportData = {
        summary: report.summary || {},
        revenue: report.paymentMethods || [],
        expenses: report.expenses || [],
        profitLoss: report.transactions || [],
      };
      
      const exportFilters = {
        ...filters,
        branchName,
      };

      if (format === "csv" || format === "excel") {
        exportFinancialReportCSV(exportData, exportFilters);
        toast.success("Report exported successfully");
      } else if (format === "pdf") {
        printReport();
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    }
  };

  // Summary metrics with safe defaults
  const summary = report?.summary || {};
  const transactions = report?.transactions || [];
  const paymentMethods = report?.paymentMethods || [];

  // Log error for debugging
  if (error) {
    console.error("Financial report error:", error);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Report"
        description="Revenue, expenses, and cash flow analysis"
        icon={DollarSign}
      />

      <ReportFilters
        startDate={filters.startDate}
        endDate={filters.endDate}
        onDateChange={handleDateChange}
        branchId={filters.branchId}
        onBranchChange={handleBranchChange}
        branches={branches || []}
        onExport={handleExport}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportSummaryCard
              title="Total Revenue"
              value={formatCurrency(summary.totalRevenue || 0)}
              description="Gross sales"
              icon={TrendingUp}
              trend="up"
            />
            <ReportSummaryCard
              title="Total Expenses"
              value={formatCurrency(summary.totalExpenses || 0)}
              description="Purchases & costs"
              icon={TrendingDown}
              trend="down"
            />
            <ReportSummaryCard
              title="Net Profit"
              value={formatCurrency(summary.netProfit || 0)}
              description="Revenue - Expenses"
              icon={DollarSign}
              trend={summary.netProfit > 0 ? "up" : "down"}
            />
            <ReportSummaryCard
              title="Profit Margin"
              value={`${summary.profitMargin?.toFixed(1) || 0}%`}
              description="Net profit ratio"
              icon={TrendingUp}
            />
          </div>

          {/* Payment Methods Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethods.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Method</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method, index) => (
                      <TableRow key={method.method || index}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {method.method === "CASH" ? (
                            <Banknote className="h-4 w-4 text-green-600" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-blue-600" />
                          )}
                          {method.method}
                        </TableCell>
                        <TableCell className="text-right">
                          {method.transactionCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(method.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {method.percentage?.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No payment data for the selected period
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 20).map((tx, index) => (
                      <TableRow key={tx.id || index}>
                        <TableCell>
                          {format(new Date(tx.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.reference}
                        </TableCell>
                        <TableCell>{tx.type}</TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            tx.type === "EXPENSE"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {tx.type === "EXPENSE" ? "-" : "+"}
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No transactions for the selected period
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FinancialReportPage;
