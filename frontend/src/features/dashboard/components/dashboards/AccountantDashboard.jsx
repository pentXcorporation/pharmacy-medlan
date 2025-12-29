/**
 * AccountantDashboard Component
 * Dashboard for ACCOUNTANT role
 * Focus on financial metrics, reports, and approvals
 */

import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  CreditCard,
  Wallet,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks";
import { useDashboardStats } from "@/features/dashboard";
import { ROUTES } from "@/config";
import { formatCurrency } from "@/utils/formatters";

/**
 * Accountant Dashboard - Finance focused
 */
const AccountantDashboard = () => {
  const { displayName } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Calculate financial metrics
  const totalRevenue = stats?.monthlyRevenue || 0;
  const totalExpenses = stats?.monthlyExpenses || 0;
  const grossProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${getGreeting()}, ${displayName || "Accountant"}!`}
        description="Financial overview and pending approvals."
      />

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          trend={stats?.revenueGrowth}
          loading={statsLoading}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<CreditCard className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Gross Profit"
          value={formatCurrency(grossProfit)}
          variant={grossProfit >= 0 ? "success" : "destructive"}
          icon={grossProfit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={<PieChart className="h-4 w-4" />}
          loading={statsLoading}
        />
      </div>

      {/* Quick Actions for Accountant */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.FINANCE.ROOT} className="flex flex-col items-center">
            <Wallet className="h-6 w-6 mb-2" />
            <span className="font-medium">Finance</span>
            <span className="text-xs text-muted-foreground">Manage finances</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.REPORTS.FINANCIAL} className="flex flex-col items-center">
            <FileText className="h-6 w-6 mb-2" />
            <span className="font-medium">Financial Reports</span>
            <span className="text-xs text-muted-foreground">P&L, Balance Sheet</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.REPORTS.SALES} className="flex flex-col items-center">
            <PieChart className="h-6 w-6 mb-2" />
            <span className="font-medium">Sales Reports</span>
            <span className="text-xs text-muted-foreground">Revenue analytics</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.PURCHASE_ORDERS.LIST} className="flex flex-col items-center">
            <CheckCircle2 className="h-6 w-6 mb-2" />
            <span className="font-medium">Approvals</span>
            <span className="text-xs text-muted-foreground">PO & GRN approvals</span>
          </Link>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Expenses Card */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>This month's financial performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Revenue</span>
                <span className="font-medium">{formatCurrency(totalRevenue)}</span>
              </div>
              <Progress value={100} className="h-2 bg-emerald-100" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Expenses</span>
                <span className="font-medium">{formatCurrency(totalExpenses)}</span>
              </div>
              <Progress 
                value={totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0} 
                className="h-2"
              />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-medium">Net Profit</span>
                <span className={`font-bold ${grossProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(grossProfit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Purchase Orders */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Purchase Orders</p>
                    <p className="text-sm text-muted-foreground">Awaiting approval</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{stats?.pendingPOs || 0}</span>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={ROUTES.PURCHASE_ORDERS.LIST}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* GRNs */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Goods Received Notes</p>
                    <p className="text-sm text-muted-foreground">Awaiting verification</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{stats?.pendingGRNs || 0}</span>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={ROUTES.GRN.LIST}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Credit Notes */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Credit Notes</p>
                    <p className="text-sm text-muted-foreground">Pending review</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{stats?.pendingCredits || 0}</span>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={ROUTES.FINANCE.ROOT}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
          <CardDescription>Access commonly used financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="justify-start">
              <Link to={ROUTES.REPORTS.SALES}>
                <FileText className="mr-2 h-4 w-4" />
                Daily Sales Summary
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to={ROUTES.REPORTS.INVENTORY}>
                <FileText className="mr-2 h-4 w-4" />
                Stock Valuation Report
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to={ROUTES.REPORTS.FINANCIAL}>
                <FileText className="mr-2 h-4 w-4" />
                Monthly P&L Statement
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountantDashboard;
