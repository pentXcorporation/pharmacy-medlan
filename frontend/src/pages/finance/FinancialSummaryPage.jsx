import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services";
import { useBranchStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/**
 * Financial Summary Page - Comprehensive financial overview
 * Shows income, expenses, profitability, and cash flow
 */
const FinancialSummaryPage = () => {
  const selectedBranch = useBranchStore((state) => state.selectedBranch);
  const branchId = selectedBranch?.id;

  const [period, setPeriod] = useState("month");
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    };
  });

  // Fetch financial summary
  const { data: financialData, isLoading, error, refetch } = useQuery({
    queryKey: ["financial-summary", branchId, dateRange.start, dateRange.end],
    queryFn: async () => {
      if (!branchId) return null;
      const response = await reportService.getFinancialSummary(
        branchId,
        dateRange.start,
        dateRange.end
      );
      return response.data;
    },
    enabled: !!branchId,
    onError: (err) => {
      toast.error("Failed to load financial summary");
    },
  });

  const financialSummary = financialData || {
    revenue: {
      totalSales: 0,
      cashSales: 0,
      creditSales: 0,
      returnsRefunds: 0,
      netRevenue: 0,
    },
    expenses: {
      purchases: 0,
      salaries: 0,
      rent: 0,
      utilities: 0,
      transportation: 0,
      marketing: 0,
      miscellaneous: 0,
      totalExpenses: 0,
    },
    profitability: {
      grossProfit: 0,
      grossMargin: 0,
      netProfit: 0,
      netMargin: 0,
    },
    cashFlow: {
      openingCash: 0,
      cashIn: 0,
      cashOut: 0,
      closingCash: 0,
    },
    accountsReceivable: 0,
    accountsPayable: 0,
  };

  // Calculate monthly trend from daily revenue
  const { data: dailyRevenueData } = useQuery({
    queryKey: ["daily-revenue", branchId, dateRange.start, dateRange.end],
    queryFn: async () => {
      if (!branchId) return null;
      const response = await reportService.getDailyRevenue(
        branchId,
        dateRange.start,
        dateRange.end
      );
      return response.data;
    },
    enabled: !!branchId,
  });

  const monthlyTrend = useMemo(() => {
    if (!dailyRevenueData) return [];
    
    const monthData = {};
    Object.entries(dailyRevenueData).forEach(([date, revenue]) => {
      const month = new Date(date).toLocaleDateString('en-US', { month: 'short' });
      if (!monthData[month]) {
        monthData[month] = { month, revenue: 0, expense: 0, profit: 0 };
      }
      monthData[month].revenue += Number(revenue);
      monthData[month].expense += Number(revenue) * 0.7; // Estimate
      monthData[month].profit = monthData[month].revenue - monthData[month].expense;
    });
    
    return Object.values(monthData).slice(-6);
  }, [dailyRevenueData]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    const today = new Date();
    let start, end;

    switch (newPeriod) {
      case "today":
        start = end = today;
        break;
      case "week":
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        end = today;
        break;
      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;
      case "quarter":
        start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        end = today;
        break;
      case "year":
        start = new Date(today.getFullYear(), 0, 1);
        end = today;
        break;
      default:
        return;
    }

    setDateRange({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    });
  };

  const handleGenerateReport = () => {
    refetch();
    toast.success("Report refreshed");
  };

  const handleExport = () => {
    if (!financialSummary || !financialSummary.revenue) {
      toast.error("No data to export");
      return;
    }

    const csvData = [
      ["Financial Summary Report"],
      ["Period:", `${dateRange.start} to ${dateRange.end}`],
      [""],
      ["REVENUE"],
      ["Total Sales", financialSummary.revenue.totalSales],
      ["Cash Sales", financialSummary.revenue.cashSales],
      ["Credit Sales", financialSummary.revenue.creditSales],
      ["Returns/Refunds", financialSummary.revenue.returnsRefunds],
      ["Net Revenue", financialSummary.revenue.netRevenue],
      [""],
      ["EXPENSES"],
      ["Purchases", financialSummary.expenses.purchases],
      ["Salaries", financialSummary.expenses.salaries],
      ["Rent", financialSummary.expenses.rent],
      ["Utilities", financialSummary.expenses.utilities],
      ["Transportation", financialSummary.expenses.transportation],
      ["Marketing", financialSummary.expenses.marketing],
      ["Miscellaneous", financialSummary.expenses.miscellaneous],
      ["Total Expenses", financialSummary.expenses.totalExpenses],
      [""],
      ["PROFITABILITY"],
      ["Gross Profit", financialSummary.profitability.grossProfit],
      ["Gross Margin (%)", financialSummary.profitability.grossMargin],
      ["Net Profit", financialSummary.profitability.netProfit],
      ["Net Margin (%)", financialSummary.profitability.netMargin],
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial-summary-${dateRange.start}-to-${dateRange.end}.csv`;
    link.click();
    toast.success("Report exported successfully");
  };

  // Show error if no branch selected
  if (!branchId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Please select a branch from the header to view financial summary.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Summary</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive financial performance overview
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Period</label>
              <Select value={period} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={handleGenerateReport} disabled={isLoading}>
                {isLoading ? "Loading..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs. {financialSummary.revenue.netRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="mr-1 h-4 w-4" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs. {financialSummary.expenses.totalExpenses.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-orange-600 mt-1">
              <TrendingUp className="mr-1 h-4 w-4" />
              +8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rs. {financialSummary.profitability.netProfit.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <Badge variant="success">
                {financialSummary.profitability.netMargin}% Margin
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cash in Hand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs. {financialSummary.cashFlow.closingCash.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-blue-600 mt-1">
              <Wallet className="mr-1 h-4 w-4" />
              Available Balance
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Detailed revenue analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-semibold">
                      Rs. {financialSummary.revenue.totalSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600 ml-4">Cash Sales</span>
                    <span className="font-medium text-green-600">
                      Rs. {financialSummary.revenue.cashSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600 ml-4">Credit Sales</span>
                    <span className="font-medium text-orange-600">
                      Rs. {financialSummary.revenue.creditSales.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Returns & Refunds</span>
                    <span className="font-medium text-red-600">
                      -Rs. {financialSummary.revenue.returnsRefunds.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b bg-blue-50 px-2">
                    <span className="font-semibold">Net Revenue</span>
                    <span className="font-bold text-blue-600">
                      Rs. {financialSummary.revenue.netRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Detailed expense analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(financialSummary.expenses)
                  .filter(([key]) => key !== "totalExpenses")
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between py-2 border-b">
                      <span className="text-gray-600 capitalize">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (amount / financialSummary.expenses.totalExpenses) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="font-semibold w-32 text-right">
                          Rs. {amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                <div className="flex justify-between py-3 border-t-2 bg-red-50 px-2 mt-4">
                  <span className="font-bold">Total Expenses</span>
                  <span className="font-bold text-red-600">
                    Rs. {financialSummary.expenses.totalExpenses.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profitability Tab */}
        <TabsContent value="profitability">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Analysis</CardTitle>
              <CardDescription>Profit margins and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Gross Profit</div>
                    <div className="text-3xl font-bold text-green-600">
                      Rs. {financialSummary.profitability.grossProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Margin: {financialSummary.profitability.grossMargin}%
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Net Profit</div>
                    <div className="text-3xl font-bold text-blue-600">
                      Rs. {financialSummary.profitability.netProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Margin: {financialSummary.profitability.netMargin}%
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold mb-3">6-Month Trend</h3>
                  {monthlyTrend.map((month) => (
                    <div key={month.month} className="flex justify-between py-1">
                      <span className="text-gray-600">{month.month}</span>
                      <span
                        className={`font-semibold ${
                          month.profit > 170000
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        Rs. {month.profit.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
              <CardDescription>Cash movement analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b-2">
                  <span className="font-semibold">Opening Cash Balance</span>
                  <span className="font-bold">
                    Rs. {financialSummary.cashFlow.openingCash.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 ml-4">
                  <span className="text-green-600">+ Cash Inflow</span>
                  <span className="font-semibold text-green-600">
                    Rs. {financialSummary.cashFlow.cashIn.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 ml-4">
                  <span className="text-red-600">- Cash Outflow</span>
                  <span className="font-semibold text-red-600">
                    Rs. {financialSummary.cashFlow.cashOut.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-t-2 bg-blue-50 px-2">
                  <span className="font-bold">Closing Cash Balance</span>
                  <span className="font-bold text-blue-600">
                    Rs. {financialSummary.cashFlow.closingCash.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Accounts Receivable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      Rs. {financialSummary.accountsReceivable.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Amount to be collected from customers
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Accounts Payable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      Rs. {financialSummary.accountsPayable.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Amount to be paid to suppliers
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialSummaryPage;
