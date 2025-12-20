'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'NAPA', value: 150 },
  { name: 'Moov', value: 100 },
  { name: 'Fexo', value: 120 },
  { name: 'Cetiriz', value: 80 },
  { name: 'Insta', value: 60 },
  { name: 'ADOL', value: 50 },
  { name: 'Sando', value: 40 },
  { name: 'Napa', value: 30 },
  { name: 'Combi', value: 20 },
  { name: 'Panadol', value: 15 },
  { name: 'A', value: 10 },
  { name: 'Idil', value: 5 }
];

export function BestSalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Best Sales Of The Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tick={{ fontSize: 10 }}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Bar dataKey="value" fill="#86efac" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
