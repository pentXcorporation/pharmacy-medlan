'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types';

interface TodayReportProps {
  stats: DashboardStats | null;
}

export function TodayReport({ stats }: TodayReportProps) {
  const reports = [
    { label: 'Total Sales', value: stats?.todaySales?.toFixed(2) || '0' },
    { label: 'Total Purchase', value: '0' },
    { label: 'Cash Received', value: '0' },
    { label: 'Bank Receive', value: '0' },
    { label: 'Total Service', value: '0' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Today's Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg font-semibold text-sm">
            <div>Today's Report</div>
            <div className="text-right">Amount</div>
          </div>
          {reports.map((report) => (
            <div key={report.label} className="grid grid-cols-2 gap-4 text-sm py-2 border-b last:border-0">
              <div className="text-gray-700">{report.label}</div>
              <div className="text-right font-medium">{report.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
