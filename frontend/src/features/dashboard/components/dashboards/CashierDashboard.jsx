/**
 * CashierDashboard Component
 * Streamlined dashboard for CASHIER role
 * Focus on POS and daily sales metrics
 */

import { Link } from "react-router-dom";
import {
  ShoppingCart,
  DollarSign,
  Receipt,
  Clock,
  TrendingUp,
  ArrowRight,
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
import { useAuth } from "@/hooks";
import { useDashboardStats, useRecentSales } from "@/features/dashboard";
import { ROUTES } from "@/config";
import { formatCurrency } from "@/utils/formatters";

/**
 * Cashier Dashboard - POS focused
 */
const CashierDashboard = () => {
  const { displayName } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentSales, isLoading: salesLoading } = useRecentSales(5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${getGreeting()}, ${displayName || "Cashier"}!`}
        description="Ready to serve customers. Here's your sales summary."
      />

      {/* Quick Start POS Button */}
      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Start New Sale</h2>
            <p className="text-emerald-100">
              Open the Point of Sale terminal to begin a transaction
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-white text-emerald-600 hover:bg-emerald-50"
          >
            <Link to={ROUTES.POS.NEW_SALE}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Open POS
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(stats?.todaySales || 0)}
          icon={<DollarSign className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Transactions"
          value={stats?.todayTransactions || 0}
          icon={<Receipt className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Avg. Transaction"
          value={formatCurrency(
            stats?.todayTransactions
              ? (stats?.todaySales || 0) / stats.todayTransactions
              : 0
          )}
          icon={<TrendingUp className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Held Sales"
          value={stats?.heldSales || 0}
          icon={<Clock className="h-4 w-4" />}
          loading={statsLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.POS.HELD_SALES} className="flex flex-col items-center">
            <Clock className="h-6 w-6 mb-2" />
            <span className="font-medium">Held Sales</span>
            <span className="text-xs text-muted-foreground">
              Resume pending transactions
            </span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.SALES.LIST} className="flex flex-col items-center">
            <Receipt className="h-6 w-6 mb-2" />
            <span className="font-medium">Sales History</span>
            <span className="text-xs text-muted-foreground">
              View past transactions
            </span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.CUSTOMERS.LIST} className="flex flex-col items-center">
            <ShoppingCart className="h-6 w-6 mb-2" />
            <span className="font-medium">Customers</span>
            <span className="text-xs text-muted-foreground">
              Search customer records
            </span>
          </Link>
        </Button>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Your last few transactions</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to={ROUTES.SALES.LIST}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : recentSales?.content?.length > 0 ? (
            <div className="space-y-2">
              {recentSales.content.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">#{sale.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.customerName || "Walk-in Customer"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(sale.total)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sale.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No sales today yet. Start selling!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CashierDashboard;
