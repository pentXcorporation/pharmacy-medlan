'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Pill, Heart, Calendar, Lock } from 'lucide-react';
import { dashboardService } from '@/lib/services';
import type { DashboardStats } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { IncomeExpenseChart } from '@/components/dashboard/income-expense-chart';
import { BestSalesChart } from '@/components/dashboard/best-sales-chart';
import { MonthlyProgressChart } from '@/components/dashboard/monthly-progress-chart';
import { TodayReport } from '@/components/dashboard/today-report';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Admin User');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const branchId = localStorage.getItem('branchId') || '1';
    setUserName(localStorage.getItem('userName') || 'Admin User');
    dashboardService.getSummary(Number(branchId))
      .then(res => {
        setStats(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: 'TOTAL CUSTOMER',
      value: stats?.salesCount || 196,
      icon: Users,
      bg: 'bg-cyan-500',
      link: '/dashboard/customers'
    },
    {
      title: 'TOTAL MEDICINE',
      value: 90,
      icon: Pill,
      bg: 'bg-green-600',
      link: '/dashboard/products'
    },
    {
      title: 'OUT OF STOCK',
      value: stats?.lowStockCount || 38,
      icon: Heart,
      bg: 'bg-red-500',
      link: '/dashboard/inventory'
    },
    {
      title: 'EXPIRED MEDICINE',
      value: stats?.expiringItemsCount || 59,
      icon: Calendar,
      bg: 'bg-orange-500',
      link: '/dashboard/inventory'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {showWelcome && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-green-800 font-medium">Welcome Back {userName}</p>
            <Button variant="ghost" size="sm" onClick={() => setShowWelcome(false)}>
              <Lock className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">{card.title}</p>
                    <p className="text-3xl font-bold mb-4">{loading ? '...' : card.value}</p>
                    <Button variant="link" className="text-green-600 p-0 h-auto text-sm">
                      <Lock className="w-3 h-3 mr-1" />
                      Show Details
                    </Button>
                  </div>
                  <div className={`${card.bg} p-4 rounded-lg`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <IncomeExpenseChart />
          <BestSalesChart />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MonthlyProgressChart />
          </div>
          <TodayReport stats={stats} />
        </div>
      </div>
    </DashboardLayout>
  );
}
