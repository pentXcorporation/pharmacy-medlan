'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRight } from 'lucide-react';

export default function StockTransferPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Stock Transfer</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              Inter-Branch Stock Transfer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Transfer stock between branches</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
