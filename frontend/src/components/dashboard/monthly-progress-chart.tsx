'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { date: '2024-12-01', value: 0 },
  { date: '2024-12-02', value: 0 },
  { date: '2024-12-03', value: 0 },
  { date: '2024-12-04', value: 2000 },
  { date: '2024-12-05', value: 0 },
  { date: '2024-12-06', value: 0 },
  { date: '2024-12-07', value: 0 },
  { date: '2024-12-08', value: 1600 },
  { date: '2024-12-09', value: 400 },
  { date: '2024-12-10', value: 0 },
  { date: '2024-12-11', value: 0 },
  { date: '2024-12-12', value: 0 },
  { date: '2024-12-13', value: 0 },
  { date: '2024-12-14', value: 0 },
  { date: '2024-12-15', value: 0 },
  { date: '2024-12-16', value: 0 },
  { date: '2024-12-17', value: 0 },
  { date: '2024-12-18', value: 0 },
  { date: '2024-12-19', value: 0 },
  { date: '2024-12-20', value: 100 },
  { date: '2024-12-21', value: 100 },
  { date: '2024-12-22', value: 0 },
  { date: '2024-12-23', value: 0 },
  { date: '2024-12-24', value: 0 },
  { date: '2024-12-25', value: 0 },
  { date: '2024-12-26', value: 0 },
  { date: '2024-12-27', value: 0 },
  { date: '2024-12-28', value: 0 },
  { date: '2024-12-29', value: 0 },
  { date: '2024-12-30', value: 0 },
  { date: '2024-12-31', value: 0 }
];

export function MonthlyProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Progress Report</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fontSize: 8 }}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
