/**
 * InventoryManagerDashboard Component
 * Dashboard for INVENTORY_MANAGER role
 * Focus on stock management, procurement, and supplier relations
 */

import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  AlertTriangle,
  Clock,
  ArrowLeftRight,
  ClipboardList,
  FileText,
  ArrowRight,
  TrendingDown,
  Calendar,
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks";
import {
  useDashboardStats,
  useLowStockAlerts,
  useExpiringProducts,
} from "@/features/dashboard";
import { ROUTES } from "@/config";

/**
 * Inventory Manager Dashboard - Stock & Procurement focused
 */
const InventoryManagerDashboard = () => {
  const { displayName } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: lowStock, isLoading: lowStockLoading } = useLowStockAlerts(10);
  const { data: expiring, isLoading: expiringLoading } = useExpiringProducts(30, 10);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const lowStockCount = lowStock?.totalElements || 0;
  const expiringCount = expiring?.totalElements || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`${getGreeting()}, ${displayName || "Inventory Manager"}!`}
        description="Stock overview and procurement management."
      />

      {/* Alert Banner if there are critical items */}
      {(lowStockCount > 0 || expiringCount > 0) && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Attention Required
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  {lowStockCount} items low on stock, {expiringCount} items expiring soon
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="border-amber-300">
              <Link to={ROUTES.INVENTORY.LOW_STOCK}>Review Now</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={<Package className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          variant={lowStockCount > 0 ? "warning" : "default"}
          icon={<TrendingDown className="h-4 w-4" />}
          loading={lowStockLoading}
        />
        <StatCard
          title="Pending POs"
          value={stats?.pendingPurchaseOrders || 0}
          icon={<ClipboardList className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Pending GRNs"
          value={stats?.pendingGRNs || 0}
          icon={<Truck className="h-4 w-4" />}
          loading={statsLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-5">
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.PURCHASE_ORDERS.NEW} className="flex flex-col items-center">
            <ClipboardList className="h-6 w-6 mb-2" />
            <span className="font-medium">New PO</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.GRN.CREATE} className="flex flex-col items-center">
            <Truck className="h-6 w-6 mb-2" />
            <span className="font-medium">Receive Goods</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.INVENTORY.TRANSFERS} className="flex flex-col items-center">
            <ArrowLeftRight className="h-6 w-6 mb-2" />
            <span className="font-medium">Transfer Stock</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.INVENTORY.ADJUSTMENTS} className="flex flex-col items-center">
            <Package className="h-6 w-6 mb-2" />
            <span className="font-medium">Stock Adjust</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.SUPPLIERS.LIST} className="flex flex-col items-center">
            <Truck className="h-6 w-6 mb-2" />
            <span className="font-medium">Suppliers</span>
          </Link>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-amber-500" />
                Low Stock Items
              </CardTitle>
              <CardDescription>Requires reordering</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to={ROUTES.INVENTORY.LOW_STOCK}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : lowStock?.content?.length > 0 ? (
              <div className="space-y-2">
                {lowStock.content.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Min: {item.minStock} | Reorder: {item.reorderLevel}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.currentStock <= 0 ? "destructive" : "outline"}>
                        {item.currentStock} in stock
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">All items well stocked</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-500" />
                Expiring Products
              </CardTitle>
              <CardDescription>Within next 30 days</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to={ROUTES.INVENTORY.EXPIRY}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {expiringLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : expiring?.content?.length > 0 ? (
              <div className="space-y-2">
                {expiring.content.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Batch: {item.batchNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No items expiring soon</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending Purchase Orders</CardTitle>
            <CardDescription>Orders awaiting delivery or approval</CardDescription>
          </div>
          <Button asChild>
            <Link to={ROUTES.PURCHASE_ORDERS.NEW}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Create New PO
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-amber-600">
                {stats?.draftPOs || 0}
              </p>
              <p className="text-sm text-muted-foreground">Draft</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {stats?.submittedPOs || 0}
              </p>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {stats?.approvedPOs || 0}
              </p>
              <p className="text-sm text-muted-foreground">Approved (Awaiting Delivery)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagerDashboard;
