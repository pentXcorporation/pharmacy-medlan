'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '@/lib/services';

export interface DashboardData {
  stats: {
    totalCustomers: number;
    totalMedicine: number;
    outOfStock: number;
    expiredMedicine: number;
    todaySales: number;
  };
  monthlyProgress: Array<{ date: string; value: number }>;
  bestSales: Array<{ name: string; value: number }>;
  todayReport: {
    totalSales: number;
    totalPurchase: number;
    cashReceived: number;
    bankReceive: number;
    totalService: number;
  };
}

export function useDashboardData(branchId: number) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getSummary(branchId);
        const apiData = response.data.data;
        
        // Transform API data to dashboard format
        setData({
          stats: {
            totalCustomers: apiData.salesCount || 0,
            totalMedicine: 90, // This should come from products API
            outOfStock: apiData.lowStockCount || 0,
            expiredMedicine: apiData.expiringItemsCount || 0,
            todaySales: apiData.todaySales || 0
          },
          monthlyProgress: [], // Fetch from sales API
          bestSales: [], // Fetch from sales API
          todayReport: {
            totalSales: apiData.todaySales || 0,
            totalPurchase: 0,
            cashReceived: 0,
            bankReceive: 0,
            totalService: 0
          }
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [branchId]);

  return { data, loading, error };
}
