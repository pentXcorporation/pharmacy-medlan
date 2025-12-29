/**
 * PharmacistDashboard Component
 * Dashboard for PHARMACIST role
 * Focus on POS, prescriptions, and inventory alerts
 */

import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Pill,
  AlertTriangle,
  Package,
  Clock,
  FileText,
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks";
import {
  useDashboardStats,
  useLowStockAlerts,
  useExpiringProducts,
} from "@/features/dashboard";
import { ROUTES } from "@/config";
import { formatCurrency } from "@/utils/formatters";

/**
 * Pharmacist Dashboard - POS + Inventory focused
 */
const PharmacistDashboard = () => {
  const { displayName } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: lowStock, isLoading: lowStockLoading } = useLowStockAlerts(5);
  const { data: expiring, isLoading: expiringLoading } = useExpiringProducts(30, 5);

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
        title={`${getGreeting()}, ${displayName || "Pharmacist"}!`}
        description="Your pharmacy overview and key alerts."
      />

      {/* Quick Start POS Button */}
      <Card className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Point of Sale</h2>
            <p className="text-cyan-100">
              Start a new sale or dispense medications
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-white text-cyan-600 hover:bg-cyan-50"
          >
            <Link to={ROUTES.POS.NEW_SALE}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Open POS
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(stats?.todaySales || 0)}
          icon={<ShoppingCart className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Prescriptions"
          value={stats?.todayPrescriptions || 0}
          description="Dispensed today"
          icon={<Pill className="h-4 w-4" />}
          loading={statsLoading}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          variant={lowStockCount > 0 ? "warning" : "default"}
          icon={<Package className="h-4 w-4" />}
          loading={lowStockLoading}
        />
        <StatCard
          title="Expiring Soon"
          value={expiringCount}
          description="Within 30 days"
          variant={expiringCount > 0 ? "destructive" : "default"}
          icon={<AlertTriangle className="h-4 w-4" />}
          loading={expiringLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.POS.NEW_SALE} className="flex flex-col items-center">
            <ShoppingCart className="h-6 w-6 mb-2" />
            <span className="font-medium">New Sale</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.INVENTORY.STOCK} className="flex flex-col items-center">
            <Package className="h-6 w-6 mb-2" />
            <span className="font-medium">Check Stock</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.PRODUCTS.LIST} className="flex flex-col items-center">
            <Pill className="h-6 w-6 mb-2" />
            <span className="font-medium">Products</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4">
          <Link to={ROUTES.SALES.LIST} className="flex flex-col items-center">
            <FileText className="h-6 w-6 mb-2" />
            <span className="font-medium">Sales History</span>
          </Link>
        </Button>
      </div>

      {/* Alerts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>Items below minimum stock level</CardDescription>
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
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : lowStock?.content?.length > 0 ? (
              <div className="space-y-2">
                {lowStock.content.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded bg-amber-50 dark:bg-amber-900/20"
                  >
                    <span className="font-medium text-sm">{item.productName}</span>
                    <Badge variant="outline" className="text-amber-600">
                      {item.currentStock} left
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                All items are well stocked
              </p>
            )}
          </CardContent>
        </Card>

        {/* Expiring Soon Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                Expiring Soon
              </CardTitle>
              <CardDescription>Items expiring within 30 days</CardDescription>
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
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : expiring?.content?.length > 0 ? (
              <div className="space-y-2">
                {expiring.content.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-900/20"
                  >
                    <span className="font-medium text-sm">{item.productName}</span>
                    <Badge variant="outline" className="text-red-600">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No items expiring soon
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
