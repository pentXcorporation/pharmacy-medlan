/**
 * SalesOverviewWidget Component
 * Displays sales statistics card
 */

import { DollarSign, TrendingUp, ShoppingCart, CreditCard } from 'lucide-react';
import { StatCard } from '@/components/common';
import { formatCurrency } from '@/utils/formatters';

/**
 * Sales overview widget with multiple stat cards
 */
const SalesOverviewWidget = ({ data, isLoading }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Today's Revenue"
        value={formatCurrency(data?.todayRevenue || 0)}
        icon={DollarSign}
        iconColor="text-emerald-600"
        iconBgColor="bg-emerald-100"
        trend={data?.revenueTrend}
        trendLabel="from yesterday"
        isLoading={isLoading}
      />
      <StatCard
        title="Today's Sales"
        value={data?.todaySalesCount || 0}
        description={`${data?.averageTransactionValue ? formatCurrency(data.averageTransactionValue) : 'LKR 0.00'} avg`}
        icon={ShoppingCart}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
        trend={data?.salesCountTrend}
        trendLabel="from yesterday"
        isLoading={isLoading}
      />
      <StatCard
        title="Monthly Revenue"
        value={formatCurrency(data?.monthRevenue || 0)}
        icon={TrendingUp}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100"
        trend={data?.monthTrend}
        trendLabel="from last month"
        isLoading={isLoading}
      />
      <StatCard
        title="Outstanding Credit"
        value={formatCurrency(data?.outstandingCredit || 0)}
        description={`${data?.creditCustomersCount || 0} customers`}
        icon={CreditCard}
        iconColor="text-amber-600"
        iconBgColor="bg-amber-100"
        isLoading={isLoading}
      />
    </div>
  );
};

export default SalesOverviewWidget;
