import React, { useState } from "react";
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

/**
 * Financial Summary Page - Comprehensive financial overview
 * Shows income, expenses, profitability, and cash flow
 */
const FinancialSummaryPage = () => {
  const [period, setPeriod] = useState("month");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  // Mock financial data - replace with actual API calls
  const financialSummary = {
    revenue: {
      totalSales: 1250000,
      cashSales: 750000,
      creditSales: 500000,
      returnsRefunds: 25000,
      netRevenue: 1225000,
    },
    expenses: {
      purchases: 850000,
      salaries: 120000,
      rent: 50000,
      utilities: 15000,
      transportation: 8000,
      marketing: 12000,
      miscellaneous: 10000,
      totalExpenses: 1065000,
    },
    profitability: {
      grossProfit: 375000,
      grossMargin: 30.6,
      netProfit: 160000,
      netMargin: 13.1,
    },
    cashFlow: {
      openingCash: 250000,
      cashIn: 800000,
      cashOut: 720000,
      closingCash: 330000,
    },
    accountsReceivable: 125000,
    accountsPayable: 180000,
  };

  const monthlyTrend = [
    { month: "Aug", revenue: 980000, expense: 820000, profit: 160000 },
    { month: "Sep", revenue: 1050000, expense: 880000, profit: 170000 },
    { month: "Oct", revenue: 1120000, expense: 940000, profit: 180000 },
    { month: "Nov", revenue: 1180000, expense: 990000, profit: 190000 },
    { month: "Dec", revenue: 1250000, expense: 1065000, profit: 185000 },
    { month: "Jan", revenue: 1250000, expense: 1065000, profit: 160000 },
  ];

  const handleExport = () => {
    console.log("Exporting financial summary...");
    // Implement actual export logic
  };

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
              <Select value={period} onValueChange={setPeriod}>
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
              <Button className="w-full">Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{financialSummary.revenue.netRevenue.toLocaleString()}
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
              ₹{financialSummary.expenses.totalExpenses.toLocaleString()}
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
              ₹{financialSummary.profitability.netProfit.toLocaleString()}
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
              ₹{financialSummary.cashFlow.closingCash.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-blue-600 mt-1">
              <Wallet className="mr-1 h-4 w-4" />
              Available Balance
            </div>
          </CardContent>
        </Card>
      </div>

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
                      ₹{financialSummary.revenue.totalSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600 ml-4">Cash Sales</span>
                    <span className="font-medium text-green-600">
                      ₹{financialSummary.revenue.cashSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600 ml-4">Credit Sales</span>
                    <span className="font-medium text-orange-600">
                      ₹{financialSummary.revenue.creditSales.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Returns & Refunds</span>
                    <span className="font-medium text-red-600">
                      -₹{financialSummary.revenue.returnsRefunds.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b bg-blue-50 px-2">
                    <span className="font-semibold">Net Revenue</span>
                    <span className="font-bold text-blue-600">
                      ₹{financialSummary.revenue.netRevenue.toLocaleString()}
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
                          ₹{amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                <div className="flex justify-between py-3 border-t-2 bg-red-50 px-2 mt-4">
                  <span className="font-bold">Total Expenses</span>
                  <span className="font-bold text-red-600">
                    ₹{financialSummary.expenses.totalExpenses.toLocaleString()}
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
                      ₹{financialSummary.profitability.grossProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Margin: {financialSummary.profitability.grossMargin}%
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Net Profit</div>
                    <div className="text-3xl font-bold text-blue-600">
                      ₹{financialSummary.profitability.netProfit.toLocaleString()}
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
                        ₹{month.profit.toLocaleString()}
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
                    ₹{financialSummary.cashFlow.openingCash.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 ml-4">
                  <span className="text-green-600">+ Cash Inflow</span>
                  <span className="font-semibold text-green-600">
                    ₹{financialSummary.cashFlow.cashIn.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 ml-4">
                  <span className="text-red-600">- Cash Outflow</span>
                  <span className="font-semibold text-red-600">
                    ₹{financialSummary.cashFlow.cashOut.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-t-2 bg-blue-50 px-2">
                  <span className="font-bold">Closing Cash Balance</span>
                  <span className="font-bold text-blue-600">
                    ₹{financialSummary.cashFlow.closingCash.toLocaleString()}
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
                      ₹{financialSummary.accountsReceivable.toLocaleString()}
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
                      ₹{financialSummary.accountsPayable.toLocaleString()}
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
