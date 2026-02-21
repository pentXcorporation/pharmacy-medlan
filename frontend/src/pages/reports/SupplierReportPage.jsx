/**
 * Supplier Report Page
 * Comprehensive supplier analytics: purchases, payments, performance
 */

import { useState } from "react";
import { format, subDays } from "date-fns";
import {
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Package,
  CreditCard,
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
  useSupplierPurchaseSummary,
  useTopSuppliers,
  useSupplierPaymentSummary,
  useSupplierPayablesAgeing,
  useOverdueSupplierPayments,
  useSupplierDeliveryPerformance,
} from "@/features/reports";
import { useActiveBranches } from "@/features/branches";
import { formatCurrency } from "@/utils/formatters";
import { useAuthStore } from "@/store";

const SupplierReportPage = () => {
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

  const { data: purchaseSummary, isLoading: l1 } = useSupplierPurchaseSummary(queryParams);
  const { data: topSuppliers, isLoading: l2 } = useTopSuppliers({ ...queryParams, limit: 10 });
  const { data: paymentSummary, isLoading: l3 } = useSupplierPaymentSummary({ branchId: effectiveBranchId });
  const { data: payablesAgeing } = useSupplierPayablesAgeing({ branchId: effectiveBranchId });
  const { data: overduePayments } = useOverdueSupplierPayments({ branchId: effectiveBranchId });
  const { data: deliveryPerformance } = useSupplierDeliveryPerformance(queryParams);

  const isLoading = l1 || l2 || l3;

  const handleDateChange = ({ startDate, endDate }) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }));
  };

  const handleBranchChange = (branchId) => {
    setFilters((prev) => ({ ...prev, branchId: branchId === "all" ? null : branchId }));
  };

  const ps = purchaseSummary || {};
  const topList = Array.isArray(topSuppliers) ? topSuppliers : [];
  const paymentList = Array.isArray(paymentSummary) ? paymentSummary : [];
  const ageingList = Array.isArray(payablesAgeing) ? payablesAgeing : [];
  const overdueList = Array.isArray(overduePayments) ? overduePayments : [];
  const deliveryList = Array.isArray(deliveryPerformance) ? deliveryPerformance : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Report"
        description="Analyze supplier purchases, payments, and delivery performance"
        icon={Truck}
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
              title="Total Purchases"
              value={formatCurrency(ps.totalPurchases || ps.totalAmount || 0)}
              description={`${ps.purchaseCount || ps.orderCount || 0} orders`}
              icon={DollarSign}
            />
            <ReportSummaryCard
              title="Active Suppliers"
              value={topList.length || ps.supplierCount || 0}
              description="In selected period"
              icon={Truck}
            />
            <ReportSummaryCard
              title="Outstanding"
              value={formatCurrency(
                paymentList.reduce((s, p) => s + (p.outstanding || p.balance || 0), 0)
              )}
              description="Total payables"
              icon={CreditCard}
            />
            <ReportSummaryCard
              title="Overdue Payments"
              value={overdueList.length}
              description="Requiring attention"
              icon={AlertTriangle}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="top-suppliers" className="space-y-4">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="top-suppliers">
                <TrendingUp className="mr-1 h-4 w-4" /> Top Suppliers
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="mr-1 h-4 w-4" /> Payments
              </TabsTrigger>
              <TabsTrigger value="ageing">
                <Clock className="mr-1 h-4 w-4" /> Payables Ageing
              </TabsTrigger>
              <TabsTrigger value="overdue">
                <AlertTriangle className="mr-1 h-4 w-4" /> Overdue
              </TabsTrigger>
              <TabsTrigger value="delivery">
                <Package className="mr-1 h-4 w-4" /> Delivery
              </TabsTrigger>
            </TabsList>

            {/* Top Suppliers */}
            <TabsContent value="top-suppliers">
              <Card>
                <CardHeader>
                  <CardTitle>Top Suppliers by Purchase Value</CardTitle>
                </CardHeader>
                <CardContent>
                  {topList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">#</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead className="text-right">Total Purchases</TableHead>
                          <TableHead className="text-right">Orders</TableHead>
                          <TableHead className="text-right">Avg Order</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topList.map((s, idx) => {
                          const total = s.totalPurchases || s.totalAmount || 0;
                          const orders = s.orderCount || s.purchaseCount || 1;
                          return (
                            <TableRow key={s.supplierId || idx}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell className="font-medium">{s.supplierName || s.name}</TableCell>
                              <TableCell className="text-right">{formatCurrency(total)}</TableCell>
                              <TableCell className="text-right">{orders}</TableCell>
                              <TableCell className="text-right">{formatCurrency(total / Math.max(orders, 1))}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No supplier data for the selected period</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Summary */}
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Supplier</TableHead>
                          <TableHead className="text-right">Total Invoiced</TableHead>
                          <TableHead className="text-right">Paid</TableHead>
                          <TableHead className="text-right">Outstanding</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentList.map((s, idx) => (
                          <TableRow key={s.supplierId || idx}>
                            <TableCell className="font-medium">{s.supplierName || s.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(s.totalInvoiced || s.totalAmount || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(s.totalPaid || s.paidAmount || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(s.outstanding || s.balance || 0)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                (s.outstanding || s.balance || 0) === 0
                                  ? "default"
                                  : (s.outstanding || s.balance || 0) > 0
                                  ? "secondary"
                                  : "destructive"
                              }>
                                {(s.outstanding || s.balance || 0) === 0 ? "Paid" : "Outstanding"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No payment data available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payables Ageing */}
            <TabsContent value="ageing">
              <Card>
                <CardHeader>
                  <CardTitle>Payables Ageing Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {ageingList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Supplier</TableHead>
                          <TableHead className="text-right">0-30 Days</TableHead>
                          <TableHead className="text-right">31-60 Days</TableHead>
                          <TableHead className="text-right">61-90 Days</TableHead>
                          <TableHead className="text-right">90+ Days</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ageingList.map((s, idx) => (
                          <TableRow key={s.supplierId || idx}>
                            <TableCell className="font-medium">{s.supplierName || s.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(s.days0to30 || s.current || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(s.days31to60 || s.overdue30 || 0)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(s.days61to90 || s.overdue60 || 0)}</TableCell>
                            <TableCell className="text-right">
                              <span className={(s.days90plus || s.overdue90 || 0) > 0 ? "text-red-600 font-medium" : ""}>
                                {formatCurrency(s.days90plus || s.overdue90 || 0)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(s.total || s.totalOutstanding || 0)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No ageing data available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Overdue Payments */}
            <TabsContent value="overdue">
              <Card>
                <CardHeader>
                  <CardTitle>Overdue Supplier Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  {overdueList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Invoice</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Days Overdue</TableHead>
                          <TableHead>Due Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {overdueList.map((p, idx) => (
                          <TableRow key={p.invoiceId || idx}>
                            <TableCell className="font-medium">{p.supplierName || p.name}</TableCell>
                            <TableCell>{p.invoiceNumber || p.reference || `INV-${idx + 1}`}</TableCell>
                            <TableCell className="text-right">{formatCurrency(p.amount || p.outstanding || 0)}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="destructive">{p.daysOverdue || p.overdueDays || 0} days</Badge>
                            </TableCell>
                            <TableCell>
                              {p.dueDate ? (() => { try { const d = Array.isArray(p.dueDate) ? new Date(p.dueDate[0], p.dueDate[1] - 1, p.dueDate[2]) : new Date(p.dueDate); return isNaN(d.getTime()) ? String(p.dueDate) : format(d, "MMM dd, yyyy"); } catch { return String(p.dueDate); } })() : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No overdue payments — all clear!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Delivery Performance */}
            <TabsContent value="delivery">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Delivery Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {deliveryList.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Supplier</TableHead>
                          <TableHead className="text-right">Total Deliveries</TableHead>
                          <TableHead className="text-right">On-Time</TableHead>
                          <TableHead className="text-right">Late</TableHead>
                          <TableHead className="text-right">On-Time Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliveryList.map((s, idx) => {
                          const rate = s.onTimeRate || s.deliveryRate || 0;
                          return (
                            <TableRow key={s.supplierId || idx}>
                              <TableCell className="font-medium">{s.supplierName || s.name}</TableCell>
                              <TableCell className="text-right">{s.totalDeliveries || s.total || 0}</TableCell>
                              <TableCell className="text-right">{s.onTimeDeliveries || s.onTime || 0}</TableCell>
                              <TableCell className="text-right">{s.lateDeliveries || s.late || 0}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant={rate >= 90 ? "default" : rate >= 75 ? "secondary" : "destructive"}>
                                  {typeof rate === "number" ? rate.toFixed(1) : rate}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No delivery performance data</p>
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

export default SupplierReportPage;
