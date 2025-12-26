import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { dashboardService, inventoryService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Package, AlertTriangle, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function StatCard({ title, value, icon: Icon, color = "blue", onShowDetails }) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`h-16 w-16 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground uppercase mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-3">{value}</h3>
          {onShowDetails && (
            <button 
              onClick={onShowDetails}
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              <Package className="h-4 w-4" />
              Show Details
            </button>
          )}
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

  // Mock data for charts - replace with real data from API
  const incomeExpenseData = [
    { name: 'Income', value: stats.totalIncome || 75000, color: '#ff9800' },
    { name: 'Expense', value: stats.totalExpense || 25000, color: '#f5f5f5' },
  ];

  const bestSalesData = [
    { name: 'NAPA', sales: 150 },
    { name: 'Maxpro', sales: 120 },
    { name: 'Fexo', sales: 100 },
    { name: 'Cetifen', sales: 90 },
    { name: 'Tista', sales: 80 },
    { name: 'ADOL Syrup', sales: 70 },
    { name: 'Tista Syrup', sales: 60 },
    { name: 'Pantolex', sales: 50 },
    { name: 'Panadol A', sales: 40 },
    { name: 'Idil', sales: 30 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <p className="text-green-800">Welcome Back Admin User</p>
        <button className="text-green-600 hover:text-green-700">
          <span className="text-xl">×</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customer"
          value={stats.totalCustomers || '196'}
          icon={Users}
          color="blue"
          onShowDetails={() => {}}
        />
        <StatCard
          title="Total Medicine"
          value={stats.totalProducts || '90'}
          icon={Package}
          color="green"
          onShowDetails={() => {}}
        />
        <StatCard
          title="Out of Stock"
          value={lowStock?.data?.length || '38'}
          icon={AlertTriangle}
          color="red"
          onShowDetails={() => {}}
        />
        <StatCard
          title="Expired Medicine"
          value={expiring?.data?.length || '59'}
          icon={Calendar}
          color="orange"
          onShowDetails={() => {}}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Income Expense Statement */}
        <Card>
          <CardHeader>
            <CardTitle>Income Expense Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeExpenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Best Sales Of The Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bestSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Monthly Progress Report */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Progress Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { date: '2023-12-01', value: 0 },
                { date: '2023-12-03', value: 2000 },
                { date: '2023-12-05', value: 0 },
                { date: '2023-12-07', value: 1600 },
                { date: '2023-12-09', value: 400 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Report */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Total Sales</span>
                <span className="text-sm font-bold">{stats.todaySales || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Total Purchase</span>
                <span className="text-sm font-bold">{stats.todayPurchases || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Cash Received</span>
                <span className="text-sm font-bold">{stats.todayCash || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-medium">Bank Receive</span>
                <span className="text-sm font-bold">{stats.todayBank || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Total Service</span>
                <span className="text-sm font-bold">{stats.todayServices || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
