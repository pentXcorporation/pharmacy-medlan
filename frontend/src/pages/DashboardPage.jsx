import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { dashboardService, inventoryService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, Package, AlertTriangle, Calendar, TrendingUp, Eye, Loader2, X } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { cn } from '../lib/utils';

function StatCard({ title, value, icon: Icon, variant = "default", onShowDetails }) {
  const variantClasses = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg", variantClasses[variant])}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
        </div>
        {onShowDetails && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 w-full justify-center text-primary"
            onClick={onShowDetails}
          >
            <Eye className="h-4 w-4 mr-2" />
            Show Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2 text-right">
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-8 w-16 ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { selectedBranch } = useAppStore();
  const [showWelcome, setShowWelcome] = useState(true);

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
        <Card className="p-8 max-w-md text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Branch Selected</h3>
          <p className="text-muted-foreground">Please select a branch to view the dashboard</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = summary?.data || {};

  // Chart colors that work with theme
  const chartColors = {
    primary: 'hsl(142, 76%, 36%)',
    secondary: 'hsl(142, 76%, 85%)',
    warning: 'hsl(38, 92%, 50%)',
    muted: 'hsl(var(--muted))',
  };

  const incomeExpenseData = [
    { name: 'Income', value: stats.totalIncome || 75000, color: chartColors.warning },
    { name: 'Expense', value: stats.totalExpense || 25000, color: chartColors.secondary },
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
      {showWelcome && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-medium text-success">Welcome Back!</p>
              <p className="text-sm text-muted-foreground">Here's what's happening with your pharmacy today.</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-success hover:text-success/80"
            onClick={() => setShowWelcome(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers || '196'}
          icon={Users}
          variant="default"
          onShowDetails={() => {}}
        />
        <StatCard
          title="Total Medicine"
          value={stats.totalProducts || '90'}
          icon={Package}
          variant="success"
          onShowDetails={() => {}}
        />
        <StatCard
          title="Out of Stock"
          value={lowStock?.data?.length || '38'}
          icon={AlertTriangle}
          variant="destructive"
          onShowDetails={() => {}}
        />
        <StatCard
          title="Expired Medicine"
          value={expiring?.data?.length || '59'}
          icon={Calendar}
          variant="warning"
          onShowDetails={() => {}}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income Expense Statement */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Income Expense Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={incomeExpenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best Sales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Best Sales Of The Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bestSalesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }} 
                />
                <Bar dataKey="sales" fill={chartColors.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Progress Report */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Monthly Progress Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[
                { date: 'Dec 01', value: 0 },
                { date: 'Dec 03', value: 2000 },
                { date: 'Dec 05', value: 0 },
                { date: 'Dec 07', value: 1600 },
                { date: 'Dec 09', value: 400 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }} 
                />
                <Bar dataKey="value" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Report */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Today's Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[
                { label: 'Total Sales', value: stats.todaySales || 0, variant: 'success' },
                { label: 'Total Purchase', value: stats.todayPurchases || 0, variant: 'default' },
                { label: 'Cash Received', value: stats.todayCash || 0, variant: 'default' },
                { label: 'Bank Received', value: stats.todayBank || 0, variant: 'default' },
                { label: 'Total Service', value: stats.todayServices || 0, variant: 'default' },
              ].map((item, index) => (
                <div 
                  key={item.label}
                  className={cn(
                    "flex justify-between items-center py-3 px-3 rounded-lg",
                    index % 2 === 0 ? "bg-muted/50" : ""
                  )}
                >
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <Badge variant={item.variant === 'success' ? 'success' : 'secondary'}>
                    Rs. {item.value.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
