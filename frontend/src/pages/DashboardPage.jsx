import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { dashboardService, inventoryService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

function StatCard({ title, value, icon: Icon, trend, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { selectedBranch } = useAppStore();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboard-summary', selectedBranch?.id],
    queryFn: () => dashboardService.getSummary(selectedBranch?.id),
    enabled: !!selectedBranch?.id,
  });

  const { data: lowStock } = useQuery({
    queryKey: ['low-stock', selectedBranch?.id],
    queryFn: () => inventoryService.getLowStock(selectedBranch?.id),
    enabled: !!selectedBranch?.id,
  });

  const { data: expiring } = useQuery({
    queryKey: ['expiring-stock', selectedBranch?.id],
    queryFn: () => {
      const alertDate = new Date();
      alertDate.setMonth(alertDate.getMonth() + 3);
      return inventoryService.getExpiring(selectedBranch?.id, alertDate.toISOString().split('T')[0]);
    },
    enabled: !!selectedBranch?.id,
  });

  if (!selectedBranch) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Please select a branch to view dashboard</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  const stats = summary?.data || {};

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value={`Rs. ${stats.todaySales?.toLocaleString() || '0'}`}
          icon={DollarSign}
          trend="+12% from yesterday"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.todayOrders || '0'}
          icon={ShoppingCart}
          trend={`${stats.todayOrders || 0} orders today`}
          color="blue"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStock?.data?.length || '0'}
          icon={AlertTriangle}
          trend="Requires attention"
          color="orange"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts || '0'}
          icon={Package}
          trend={`${stats.activeProducts || 0} active`}
          color="purple"
        />
      </div>

      {/* Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock?.data?.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lowStock.data.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {item.availableQuantity} / Min: {item.minimumStock}
                      </p>
                    </div>
                    <Badge variant="warning">Low</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No low stock items</p>
            )}
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-500" />
              Expiring Soon (3 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiring?.data?.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {expiring.data.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Batch: {item.batchNumber} | Exp: {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="destructive">Expiring</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No expiring items</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <ShoppingCart className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">New Sale</p>
              <p className="text-xs text-muted-foreground">Create POS transaction</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <Package className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Add Product</p>
              <p className="text-xs text-muted-foreground">Register new product</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Purchase Order</p>
              <p className="text-xs text-muted-foreground">Create new PO</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <Users className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Add Customer</p>
              <p className="text-xs text-muted-foreground">Register customer</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
