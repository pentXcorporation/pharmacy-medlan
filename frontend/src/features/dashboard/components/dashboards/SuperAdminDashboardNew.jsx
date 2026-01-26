/**
 * SuperAdminDashboard Component - Enhanced with Real-Time API Integration
 * Provides system-wide oversight, multi-branch analytics, and advanced controls
 * Now fully integrated with backend APIs for real-time data
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Database,
  Shield,
  BarChart3,
  Settings,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/common";
import { useAuth } from "@/hooks";
import {
  useSuperAdminDashboard,
  useSystemMetrics,
  useBranchAnalytics,
  useBusinessMetrics,
  useInventoryOverview,
  useUserStatistics,
  useFinancialSummary,
  useRecentActivities,
} from "@/hooks/useSuperAdminDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatters";
import { ROUTES } from "@/config";

/**
 * System Health Card Component
 */
const SystemHealthCard = () => {
  const { data, isLoading, refetch, isFetching } = useSystemMetrics();
  const metrics = data?.data;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">System Health</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(metrics?.status)}>
              {metrics?.status?.toUpperCase() || "UNKNOWN"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <CardDescription>Real-time system monitoring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Uptime</p>
            <p className="text-lg font-bold text-green-600">
              {metrics?.uptime ? `${metrics.uptime.toFixed(2)}%` : "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Response Time</p>
            <p className="text-lg font-bold">{metrics?.responseTime || 0}ms</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active Users</p>
            <p className="text-lg font-bold">{metrics?.activeUsers || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">DB Connections</p>
            <p className="text-lg font-bold">
              {metrics?.dbConnections || 0}/{metrics?.maxDbConnections || 20}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Error Rate</span>
            <span className="font-medium">
              {metrics?.errorRate ? `${(metrics.errorRate * 100).toFixed(2)}%` : "0%"}
            </span>
          </div>
          <Progress value={metrics?.errorRate ? metrics.errorRate * 100 : 0} className="h-2" />
        </div>

        {metrics?.memory && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Memory Usage</span>
              <span className="font-medium">
                {metrics.memory.used}MB / {metrics.memory.max}MB
              </span>
            </div>
            <Progress value={metrics.memory.usagePercentage} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="h-3 w-3" />
            <span>
              Last Backup: {metrics?.lastBackup ? new Date(metrics.lastBackup).toLocaleString() : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Business Metrics Card Component
 */
const BusinessMetricsCard = () => {
  const { data, isLoading } = useBusinessMetrics();
  const metrics = data?.data;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const growthIsPositive = (metrics?.salesGrowthRate || 0) >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Business Metrics</CardTitle>
        </div>
        <CardDescription>Today's performance overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Today's Sales</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(metrics?.todaySales || 0)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Today's Orders</p>
            <p className="text-xl font-bold">{metrics?.todayOrders || 0}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            {growthIsPositive ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm font-medium">Growth Rate</span>
          </div>
          <span className={`font-bold ${growthIsPositive ? 'text-green-600' : 'text-red-600'}`}>
            {metrics?.salesGrowthRate ? `${metrics.salesGrowthRate.toFixed(2)}%` : "0%"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">MTD Sales</p>
            <p className="font-semibold">{formatCurrency(metrics?.monthToDateSales || 0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">YTD Sales</p>
            <p className="font-semibold">{formatCurrency(metrics?.yearToDateSales || 0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Order</p>
            <p className="font-semibold">{formatCurrency(metrics?.averageOrderValue || 0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Completed</p>
            <p className="font-semibold">{metrics?.completedOrders || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Branch Performance Card Component
 */
const BranchPerformanceCard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useBranchAnalytics();
  const branches = data?.data?.branches?.slice(0, 5) || [];
  const summary = data?.data?.summary;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Top Performing Branches</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.BRANCHES.LIST)}
          >
            View All
          </Button>
        </div>
        <CardDescription>
          {summary?.activeBranches || 0} active branches • Total: {formatCurrency(summary?.totalSales || 0)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {branches.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No branch data available
          </p>
        ) : (
          branches.map((branch, index) => (
            <div
              key={branch.branchId}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate(ROUTES.BRANCHES.VIEW(branch.branchId))}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{branch.branchName}</p>
                    <Badge variant={branch.isActive ? "success" : "secondary"} className="text-xs">
                      {branch.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {branch.todayOrders || 0} orders today • {branch.totalStaff || 0} staff
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{formatCurrency(branch.todaySales || 0)}</p>
                {branch.dailyGrowth !== undefined && (
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    {branch.dailyGrowth >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        branch.dailyGrowth >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {branch.dailyGrowth.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Inventory Overview Card Component
 */
const InventoryOverviewCard = () => {
  const { data, isLoading } = useInventoryOverview();
  const inventory = data?.data;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: inventory?.totalProducts || 0,
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Low Stock",
      value: inventory?.lowStockItems || 0,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      label: "Out of Stock",
      value: inventory?.outOfStockItems || 0,
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      label: "Expiring Soon",
      value: inventory?.expiringItems || 0,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Inventory Overview</CardTitle>
        </div>
        <CardDescription>System-wide inventory status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium">Total Inventory Value</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(inventory?.totalInventoryValue || 0)}
          </span>
        </div>

        {(inventory?.criticalAlerts || 0) > 0 && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600 font-medium">
              {inventory.criticalAlerts} critical alerts require attention
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * User Statistics Card Component
 */
const UserStatisticsCard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useUserStatistics();
  const stats = data?.data;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">User Statistics</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.USERS.LIST)}
          >
            Manage Users
          </Button>
        </div>
        <CardDescription>System-wide user overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-primary">{stats?.totalUsers || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Users</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats?.activeUsers || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Active</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats?.loggedInUsers || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Online</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Administrators</span>
            <span className="font-semibold">{stats?.adminUsers || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Managers</span>
            <span className="font-semibold">{stats?.managerUsers || 0}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cashiers</span>
            <span className="font-semibold">{stats?.cashierUsers || 0}</span>
          </div>
        </div>

        {(stats?.recentlyAddedUsers || 0) > 0 && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">
              {stats.recentlyAddedUsers} new users in last 7 days
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Recent Activities Component
 */
const RecentActivitiesCard = () => {
  const { data, isLoading } = useRecentActivities(10);
  const activities = data?.data || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Recent Activities</CardTitle>
        </div>
        <CardDescription>Latest system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activities
            </p>
          ) : (
            activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Badge className={`${getSeverityColor(activity.severity)} mt-1`} variant="secondary">
                  {activity.activityType}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.branchName} • {activity.userName} •{" "}
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Main Super Admin Dashboard Component
 */
const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Dashboard"
        subtitle={`Welcome back, ${user?.fullName || "Admin"}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600">
              SUPER ADMIN
            </Badge>
            <Badge variant="outline">All Permissions Active</Badge>
            <Badge variant="outline">All Branches Access</Badge>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SystemHealthCard />
            <BusinessMetricsCard />
            <InventoryOverviewCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BranchPerformanceCard />
            <UserStatisticsCard />
          </div>

          <RecentActivitiesCard />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SystemHealthCard />
            <InventoryOverviewCard />
          </div>
          <RecentActivitiesCard />
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <BranchPerformanceCard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BusinessMetricsCard />
            <UserStatisticsCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;
