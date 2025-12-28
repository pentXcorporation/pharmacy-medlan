/**
 * Inventory Overview Page
 * Main inventory dashboard with tabs for different views
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  Clock,
  ArrowLeftRight,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { ROUTES } from "@/config";
import { useLowStockProducts, useExpiringProducts } from "@/features/inventory";
import { PageHeader, StatCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import sub-pages
import LowStockPage from "./LowStockPage";
import ExpiringPage from "./ExpiringPage";
import StockTransfersPage from "./StockTransfersPage";

/**
 * InventoryPage component
 */
const InventoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch summary data
  const { data: lowStockData } = useLowStockProducts({ size: 1 });
  const { data: expiringData } = useExpiringProducts({ size: 1, days: 90 });

  const lowStockCount = lowStockData?.totalElements || 0;
  const expiringCount = expiringData?.totalElements || 0;

  const stats = [
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: TrendingDown,
      trend: lowStockCount > 10 ? "Needs attention" : "Good",
      trendUp: lowStockCount <= 10,
      onClick: () => setActiveTab("low-stock"),
    },
    {
      title: "Expiring Soon",
      value: expiringCount,
      icon: Clock,
      description: "Within 90 days",
      onClick: () => setActiveTab("expiring"),
    },
    {
      title: "Out of Stock",
      value:
        lowStockData?.content?.filter((p) => p.currentStock === 0).length || 0,
      icon: AlertCircle,
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Monitor stock levels, expiry dates, and manage stock transfers"
        actions={
          <Button onClick={() => navigate(ROUTES.INVENTORY.TRANSFERS.NEW)}>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            New Stock Transfer
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock
            {lowStockCount > 0 && (
              <span className="ml-2 bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs">
                {lowStockCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="expiring">
            Expiring
            {expiringCount > 0 && (
              <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs">
                {expiringCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                trend={stat.trend}
                trendUp={stat.trendUp}
                className={
                  stat.onClick
                    ? "cursor-pointer hover:shadow-md transition-shadow"
                    : ""
                }
                onClick={stat.onClick}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("low-stock")}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Low Stock Alert</CardTitle>
                    <CardDescription>
                      {lowStockCount} items need reordering
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("expiring")}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Expiry Tracking</CardTitle>
                    <CardDescription>
                      {expiringCount} items expiring soon
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab("transfers")}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ArrowLeftRight className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Stock Transfers</CardTitle>
                    <CardDescription>
                      Manage inter-branch transfers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="low-stock">
          <LowStockPage />
        </TabsContent>

        <TabsContent value="expiring">
          <ExpiringPage />
        </TabsContent>

        <TabsContent value="transfers">
          <StockTransfersPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryPage;
