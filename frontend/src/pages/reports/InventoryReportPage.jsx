/**
 * Inventory Report Page
 * Stock levels, movements, and valuation
 */

import { useState } from "react";
import { Package, AlertTriangle, TrendingDown, DollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader, LoadingSpinner } from "@/components/common";
import { ReportSummaryCard } from "@/features/reports";
import { useInventoryReport } from "@/features/reports";
import { useActiveBranches } from "@/features/branches";
import { formatCurrency } from "@/utils/formatters";
import { exportInventoryReportCSV, printReport } from "@/utils/reportExport";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InventoryReportPage = () => {
  const [branchId, setBranchId] = useState(null);

  const { data: branches } = useActiveBranches();
  const { data: report, isLoading, error } = useInventoryReport({ branchId });

  const handleExport = (format) => {
    try {
      if (!report || !report.summary) {
        toast.error("No data available to export");
        return;
      }

      const branchName = branches?.find(b => b.id?.toString() === branchId?.toString())?.branchName || "All Branches";
      const exportData = {
        summary: report.summary || {},
        stockLevels: report.stockLevels || [],
        lowStockItems: report.lowStockItems || [],
        expiringItems: report.expiringItems || [],
      };
      
      const exportFilters = {
        branchId,
        branchName,
      };

      if (format === "csv" || format === "excel") {
        exportInventoryReportCSV(exportData, exportFilters);
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
  const stockLevels = report?.stockLevels || [];
  const lowStockItems = report?.lowStockItems || [];
  const expiringItems = report?.expiringItems || [];

  // Log error for debugging
  if (error) {
    console.error("Inventory report error:", error);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Report"
        description="Stock levels, valuation, and alerts"
        icon={Package}
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select
                value={branchId || "all"}
                onValueChange={(v) => setBranchId(v === "all" ? null : v)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {(branches || []).map((branch) => (
                    <SelectItem key={branch.id} value={branch.id?.toString()}>
                      {branch.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Export Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportSummaryCard
              title="Total Stock Value"
              value={formatCurrency(summary.totalStockValue || 0)}
              description={`${summary.totalProducts || 0} products`}
              icon={DollarSign}
            />
            <ReportSummaryCard
              title="Low Stock Items"
              value={summary.lowStockCount || 0}
              description="Need reordering"
              icon={TrendingDown}
            />
            <ReportSummaryCard
              title="Out of Stock"
              value={summary.outOfStockCount || 0}
              description="Zero quantity"
              icon={AlertTriangle}
            />
            <ReportSummaryCard
              title="Expiring Soon"
              value={summary.expiringCount || 0}
              description="Within 30 days"
              icon={AlertTriangle}
            />
          </div>

          {/* Low Stock Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-500" />
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">
                        Current Stock
                      </TableHead>
                      <TableHead className="text-right">
                        Reorder Level
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.slice(0, 10).map((item, index) => (
                      <TableRow key={item.productId || index}>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.sku}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.currentStock}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.reorderLevel}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.currentStock === 0
                                ? "destructive"
                                : "warning"
                            }
                          >
                            {item.currentStock === 0
                              ? "Out of Stock"
                              : "Low Stock"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No low stock items
                </p>
              )}
            </CardContent>
          </Card>

          {/* Expiring Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expiringItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Batch No.</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Days Left</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringItems.slice(0, 10).map((item, index) => (
                      <TableRow key={item.batchId || index}>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.batchNumber}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell>{item.expiryDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.daysLeft <= 7 ? "destructive" : "warning"
                            }
                          >
                            {item.daysLeft} days
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No items expiring soon
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stock by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Stock by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {stockLevels.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Products</TableHead>
                      <TableHead className="text-right">
                        Total Quantity
                      </TableHead>
                      <TableHead className="text-right">Stock Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockLevels.map((category, index) => (
                      <TableRow key={category.categoryId || index}>
                        <TableCell className="font-medium">
                          {category.categoryName}
                        </TableCell>
                        <TableCell className="text-right">
                          {category.productCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {category.totalQuantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(category.stockValue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No inventory data available
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InventoryReportPage;
