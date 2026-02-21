/**
 * Sales Report Page
 * Enhanced sales analysis with trends, customer analytics, returns & discounts
 */

import { useState } from "react";
import { format, subDays } from "date-fns";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  RotateCcw,
  Percent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageHeader, LoadingSpinner } from "@/components/common";
import { ReportFilters, ReportSummaryCard } from "@/features/reports";
import {
  useSalesReport,
  useTopCustomers,
  useReturnsSummary,
  useDiscountAnalysis,
  useSalesByDayOfWeek,
} from "@/features/reports";
import { useActiveBranches } from "@/features/branches";
import { formatCurrency } from "@/utils/formatters";
import { exportSalesReportCSV, printReport } from "@/utils/reportExport";
import { toast } from "sonner";
import { useAuthStore } from "@/store";

const SalesReportPage = () => {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    branchId: user?.branchId || null,
  });

  const { data: branches } = useActiveBranches();

  // Derive effective branchId — auto-select first branch if user has none
  const effectiveBranchId = filters.branchId || branches?.[0]?.id?.toString() || null;
  const effectiveFilters = { ...filters, branchId: effectiveBranchId };

  const { data: report, isLoading, error } = useSalesReport(effectiveFilters);

  const queryParams = {
    branchId: effectiveBranchId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const { data: topCustomers } = useTopCustomers({ ...queryParams, limit: 20 });
  const { data: returnsSummary } = useReturnsSummary(queryParams);
  const { data: discounts } = useDiscountAnalysis(queryParams);
  const { data: salesByDay } = useSalesByDayOfWeek(queryParams);

  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const handleBranchChange = (branchId) => {
    setFilters((prev) => ({
      ...prev,
      branchId: branchId === "all" ? null : branchId,
    }));
  };

  const handleExport = (fmt) => {
    try {
      if (!report || !report.summary) {
        toast.error("No data available to export");
        return;
      }
      const branchName = branches?.find(b => b.id?.toString() === effectiveBranchId?.toString())?.branchName || "All Branches";
      const exportData = {
        summary: report.summary || {},
        topProducts: report.topProducts || [],
        dailySales: report.dailySales || [],
      };
      if (fmt === "csv" || fmt === "excel") {
        exportSalesReportCSV(exportData, { ...filters, branchName });
        toast.success("Report exported successfully");
      } else if (fmt === "pdf") {
        printReport();
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export report");
    }
  };

  const summary = report?.summary || {};
  const topProducts = report?.topProducts || [];
  const dailySales = report?.dailySales || [];
  const customerList = Array.isArray(topCustomers) ? topCustomers : [];
  const returns = returnsSummary || {};
  const disc = discounts || {};
  const dayOfWeekData = salesByDay || {};

  if (error) {
    console.error("Sales report error:", error);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        description="Comprehensive sales analysis with trends, customers, and returns"
        icon={TrendingUp}
      />

      <ReportFilters
        startDate={filters.startDate}
        endDate={filters.endDate}
        onDateChange={handleDateChange}
        branchId={effectiveBranchId}
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
              title="Total Sales"
              value={formatCurrency(summary.totalSales || 0)}
              description={`${summary.salesCount || 0} transactions`}
              icon={DollarSign}
              trend={summary.salesTrend}
              trendValue={summary.salesTrendValue}
            />
            <ReportSummaryCard
              title="Average Sale"
              value={formatCurrency(summary.averageSale || 0)}
              description="Per transaction"
              icon={ShoppingBag}
            />
            <ReportSummaryCard
              title="Items Sold"
              value={summary.itemsSold || 0}
              description="Total quantity"
              icon={Package}
            />
            <ReportSummaryCard
              title="Returns"
              value={formatCurrency(returns.totalReturnAmount || returns.returnAmount || 0)}
              description={`${returns.returnCount || returns.totalReturns || 0} returns`}
              icon={RotateCcw}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="overview">
                <TrendingUp className="mr-1 h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="customers">
                <Users className="mr-1 h-4 w-4" /> Customers
              </TabsTrigger>
              <TabsTrigger value="trends">
                <Clock className="mr-1 h-4 w-4" /> Trends
              </TabsTrigger>
              <TabsTrigger value="returns">
                <RotateCcw className="mr-1 h-4 w-4" /> Returns & Discounts
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {topProducts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Quantity Sold</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topProducts.slice(0, 10).map((product, index) => (
                          <TableRow key={product.productId || index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{product.productName}</TableCell>
                            <TableCell className="text-right">{product.quantitySold}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No sales data for the selected period</p>
                  )}
                </CardContent>
              </Card>

              {/* Daily Sales */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  {dailySales.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailySales.map((day, index) => (
                          <TableRow key={day.date || index}>
                            <TableCell>{format(new Date(day.date + "T00:00:00"), "MMM dd, yyyy")}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(day.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No sales data for the selected period</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers by Purchase Value</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="text-right">Total Spent</TableHead>
                          <TableHead className="text-right">Transactions</TableHead>
                          <TableHead className="text-right">Avg per Visit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerList.map((c, idx) => {
                          const total = c.totalAmount || c.totalSpent || 0;
                          const visits = c.visitCount || c.transactionCount || 1;
                          return (
                            <TableRow key={c.customerId || idx}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell className="font-medium">{c.customerName || c.name || "Walk-in"}</TableCell>
                              <TableCell className="text-right">{formatCurrency(total)}</TableCell>
                              <TableCell className="text-right">{visits}</TableCell>
                              <TableCell className="text-right">{formatCurrency(total / Math.max(visits, 1))}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No customer data for the selected period</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Day of Week</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(dayOfWeekData).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(dayOfWeekData).map(([day, amount]) => {
                        const maxVal = Math.max(...Object.values(dayOfWeekData).map(Number)) || 1;
                        const pct = (Number(amount) / maxVal) * 100;
                        return (
                          <div key={day} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{day}</span>
                              <span>{formatCurrency(Number(amount))}</span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No trend data for the selected period</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Returns & Discounts Tab */}
            <TabsContent value="returns" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Returns Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Returns Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Total Returns</span>
                        <span className="font-medium">{returns.returnCount || returns.totalReturns || 0}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Return Amount</span>
                        <span className="font-medium">{formatCurrency(returns.totalReturnAmount || returns.returnAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Return Rate</span>
                        <Badge variant={(returns.returnRate || 0) > 5 ? "destructive" : "default"}>
                          {(returns.returnRate || 0).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Discount Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Discount Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Total Discounts Given</span>
                        <span className="font-medium">{formatCurrency(disc.totalDiscount || disc.discountAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Discount Rate</span>
                        <Badge variant="secondary">
                          {(disc.discountRate || disc.averageDiscountRate || 0).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm text-muted-foreground">Revenue Impact</span>
                        <span className="font-medium">{formatCurrency(disc.revenueImpact || disc.impactOnRevenue || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SalesReportPage;
