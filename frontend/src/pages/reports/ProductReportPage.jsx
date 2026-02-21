/**
 * Product Report Page
 * Comprehensive product analytics: top sellers, margins, categories, inventory
 */

import { useState } from "react";
import { format, subDays } from "date-fns";
import {
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Layers,
  AlertTriangle,
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
  useTopProductsByRevenue,
  useTopProductsByQuantity,
  useProductMargins,
  useProductByCategory,
  useProductActivitySummary,
  useSlowestMovingProducts,
} from "@/features/reports";
import { useActiveBranches } from "@/features/branches";
import { formatCurrency } from "@/utils/formatters";
import { useAuthStore } from "@/store";

const ProductReportPage = () => {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    branchId: user?.branchId || null,
  });

  const { data: branches } = useActiveBranches();

  // Derive effective branchId — auto-select first branch if user has none
  const effectiveBranchId = filters.branchId || branches?.[0]?.id?.toString() || null;

  const queryParams = {
    branchId: effectiveBranchId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const { data: topByRevenue, isLoading: l1 } = useTopProductsByRevenue({ ...queryParams, limit: 20 });
  const { data: topByQuantity, isLoading: l2 } = useTopProductsByQuantity({ ...queryParams, limit: 20 });
  const { data: margins } = useProductMargins({ ...queryParams, limit: 20 });
  const { data: byCategory } = useProductByCategory(queryParams);
  const { data: activity, isLoading: l5 } = useProductActivitySummary({ branchId: effectiveBranchId });
  const { data: slowest } = useSlowestMovingProducts({ ...queryParams, limit: 20 });

  const isLoading = l1 || l2 || l5;

  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const handleBranchChange = (branchId) => {
    setFilters((prev) => ({ ...prev, branchId: branchId === "all" ? null : branchId }));
  };

  const topRevenueList = Array.isArray(topByRevenue) ? topByRevenue : [];
  const topQuantityList = Array.isArray(topByQuantity) ? topByQuantity : [];
  const marginList = Array.isArray(margins) ? margins : [];
  const categoryList = Array.isArray(byCategory) ? byCategory : [];
  const slowestList = Array.isArray(slowest) ? slowest : [];
  const act = activity || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Report"
        description="Analyze product performance, margins, and categories"
        icon={Package}
      />

      <ReportFilters
        startDate={filters.startDate}
        endDate={filters.endDate}
        onDateChange={handleDateChange}
        branchId={effectiveBranchId}
        onBranchChange={handleBranchChange}
        branches={branches || []}
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
              title="Total Products"
              value={act.totalProducts || act.total || 0}
              description={`${act.activeProducts || act.active || 0} active`}
              icon={Package}
            />
            <ReportSummaryCard
              title="Top Revenue Product"
              value={topRevenueList[0]?.productName || topRevenueList[0]?.name || "N/A"}
              description={topRevenueList[0] ? formatCurrency(topRevenueList[0].revenue || topRevenueList[0].totalRevenue || 0) : ""}
              icon={TrendingUp}
            />
            <ReportSummaryCard
              title="Categories"
              value={categoryList.length}
              description="With sales data"
              icon={Layers}
            />
            <ReportSummaryCard
              title="Slow Moving"
              value={slowestList.length}
              description="Low sales velocity"
              icon={AlertTriangle}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="top-revenue" className="space-y-4">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="top-revenue">
                <DollarSign className="mr-1 h-4 w-4" /> Top by Revenue
              </TabsTrigger>
              <TabsTrigger value="top-quantity">
                <BarChart3 className="mr-1 h-4 w-4" /> Top by Quantity
              </TabsTrigger>
              <TabsTrigger value="margins">
                <TrendingUp className="mr-1 h-4 w-4" /> Margins
              </TabsTrigger>
              <TabsTrigger value="categories">
                <Layers className="mr-1 h-4 w-4" /> By Category
              </TabsTrigger>
              <TabsTrigger value="slow-moving">
                <TrendingDown className="mr-1 h-4 w-4" /> Slow Moving
              </TabsTrigger>
            </TabsList>

            {/* Top by Revenue */}
            <TabsContent value="top-revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  {topRevenueList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead className="text-right">Qty Sold</TableHead>
                          <TableHead className="text-right">Avg Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topRevenueList.map((p, idx) => (
                          <TableRow key={p.productId || idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell className="font-medium">{p.productName || p.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(p.revenue || p.totalRevenue || 0)}</TableCell>
                            <TableCell className="text-right">{p.quantitySold || p.quantity || 0}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency((p.revenue || p.totalRevenue || 0) / Math.max(p.quantitySold || p.quantity || 1, 1))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No product data for the selected period</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Top by Quantity */}
            <TabsContent value="top-quantity">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Quantity Sold</CardTitle>
                </CardHeader>
                <CardContent>
                  {topQuantityList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Qty Sold</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topQuantityList.map((p, idx) => (
                          <TableRow key={p.productId || idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell className="font-medium">{p.productName || p.name}</TableCell>
                            <TableCell className="text-right">{p.quantitySold || p.quantity || 0}</TableCell>
                            <TableCell className="text-right">{formatCurrency(p.revenue || p.totalRevenue || 0)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No product data for the selected period</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Margins */}
            <TabsContent value="margins">
              <Card>
                <CardHeader>
                  <CardTitle>Highest Margin Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {marginList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Margin %</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead className="text-right">Profit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {marginList.map((p, idx) => (
                          <TableRow key={p.productId || idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell className="font-medium">{p.productName || p.name}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={(p.marginPercentage || p.margin || 0) >= 30 ? "default" : "secondary"}>
                                {(p.marginPercentage || p.margin || 0).toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(p.revenue || p.totalRevenue || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(p.profit || p.grossProfit || 0)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No margin data for the selected period</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* By Category */}
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {categoryList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Total Revenue</TableHead>
                          <TableHead className="text-right">Qty Sold</TableHead>
                          <TableHead className="text-right">Products</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryList.map((c, idx) => (
                          <TableRow key={c.category || c.categoryName || idx}>
                            <TableCell className="font-medium">{c.category || c.categoryName}</TableCell>
                            <TableCell className="text-right">{formatCurrency(c.revenue || c.totalRevenue || 0)}</TableCell>
                            <TableCell className="text-right">{c.quantitySold || c.quantity || 0}</TableCell>
                            <TableCell className="text-right">{c.productCount || c.products || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No category data for the selected period</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Slow Moving */}
            <TabsContent value="slow-moving">
              <Card>
                <CardHeader>
                  <CardTitle>Slowest Moving Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {slowestList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Qty Sold</TableHead>
                          <TableHead className="text-right">Current Stock</TableHead>
                          <TableHead className="text-right">Days Since Last Sale</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {slowestList.map((p, idx) => (
                          <TableRow key={p.productId || idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell className="font-medium">{p.productName || p.name}</TableCell>
                            <TableCell className="text-right">{p.quantitySold || p.quantity || 0}</TableCell>
                            <TableCell className="text-right">{p.currentStock || p.stock || 0}</TableCell>
                            <TableCell className="text-right">{p.daysSinceLastSale || p.daysWithoutSale || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No slow-moving product data</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ProductReportPage;
