/**
 * Sales Report Page
 * Detailed sales analysis and trends
 */

import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
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
import { useSalesReport } from "@/features/reports";
import { useActiveBranches } from "@/features/branches";
import { formatCurrency } from "@/utils/formatters";

const SalesReportPage = () => {
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    branchId: null,
  });

  const { data: branches } = useActiveBranches();
  const { data: report, isLoading } = useSalesReport(filters);

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
      // Generate CSV export
      if (format === "csv") {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Summary Section
        csvContent += "Sales Report Summary\n";
        csvContent += `Period:,${filters.startDate} to ${filters.endDate}\n`;
        csvContent += `Total Sales:,${summary.totalSales || 0}\n`;
        csvContent += `Sales Count:,${summary.salesCount || 0}\n`;
        csvContent += `Average Sale:,${summary.averageSale || 0}\n\n`;
        
        // Top Products Section
        csvContent += "Top Selling Products\n";
        csvContent += "Product Name,Quantity Sold,Revenue\n";
        topProducts.forEach(product => {
          csvContent += `"${product.productName}",${product.quantity},${product.revenue}\n`;
        });
        
        csvContent += "\n";
        
        // Daily Sales Section
        csvContent += "Daily Sales\n";
        csvContent += "Date,Sales Amount,Transaction Count\n";
        dailySales.forEach(day => {
          csvContent += `${day.date},${day.amount},${day.count}\n`;
        });
        
        // Download file
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // PDF export placeholder - would use a library like jsPDF
      if (format === "pdf") {
        console.log("PDF export requires jsPDF library implementation");
        alert("PDF export feature coming soon. Please use CSV for now.");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export report");
    }
  };

  // Summary metrics
  const summary = report?.summary || {};
  const topProducts = report?.topProducts || [];
  const dailySales = report?.dailySales || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        description="Analyze sales performance and trends"
        icon={TrendingUp}
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
              title="Total Customers"
              value={summary.uniqueCustomers || 0}
              description="Unique customers"
              icon={Users}
            />
            <ReportSummaryCard
              title="Items Sold"
              value={summary.itemsSold || 0}
              description="Total quantity"
              icon={Package}
            />
          </div>

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
                      <TableHead className="text-right">
                        Quantity Sold
                      </TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.slice(0, 10).map((product, index) => (
                      <TableRow key={product.productId || index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {product.productName}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.quantitySold}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No sales data for the selected period
                </p>
              )}
            </CardContent>
          </Card>

          {/* Daily Sales Table */}
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
                      <TableHead className="text-right">Transactions</TableHead>
                      <TableHead className="text-right">Items Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailySales.map((day, index) => (
                      <TableRow key={day.date || index}>
                        <TableCell>
                          {format(new Date(day.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          {day.transactionCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {day.itemsSold}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(day.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No sales data for the selected period
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SalesReportPage;
