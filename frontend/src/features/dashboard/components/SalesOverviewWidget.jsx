/**
 * SalesOverviewWidget Component
 * Displays sales statistics card
 */

import { DollarSign, TrendingUp, ShoppingCart, CreditCard } from "lucide-react";
import { StatCard } from "@/components/common";
import { formatCurrency } from "@/utils/formatters";

/**
 * Sales overview widget with multiple stat cards
 */
const SalesOverviewWidget = ({ data, isLoading }) => {
  const todaySummary = data?.todaySummary || {};
  const monthlySummary = data?.monthlySummary || {};

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Today's Revenue"
        value={formatCurrency(todaySummary.totalSales || 0)}
        icon={DollarSign}
        iconColor="text-emerald-600"
        iconBgColor="bg-emerald-100"
        isLoading={isLoading}
      />
      <StatCard
        title="Today's Sales"
        value={todaySummary.salesCount || 0}
        icon={ShoppingCart}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
        isLoading={isLoading}
      />
      <StatCard
        title="Monthly Revenue"
        value={formatCurrency(monthlySummary.totalSales || 0)}
        icon={TrendingUp}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100"
        isLoading={isLoading}
      />
      <StatCard
        title="Monthly Profit"
        value={formatCurrency(monthlySummary.totalProfit || 0)}
        icon={CreditCard}
        iconColor="text-amber-600"
        iconBgColor="bg-amber-100"
        isLoading={isLoading}
      />
    </div>
  );
};

export default SalesOverviewWidget;
