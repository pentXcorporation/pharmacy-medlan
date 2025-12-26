import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { salesService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Label } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Search } from 'lucide-react';

export function SalesPage() {
  const { selectedBranch } = useAppStore();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales', selectedBranch?.id, dateRange],
    queryFn: () => salesService.getByBranchAndDateRange(
      selectedBranch?.id,
      `${dateRange.startDate}T00:00:00`,
      `${dateRange.endDate}T23:59:59`
    ),
    enabled: !!selectedBranch?.id,
  });

  const { data: totalSales } = useQuery({
    queryKey: ['sales-total', selectedBranch?.id, dateRange],
    queryFn: () => salesService.getTotalAmount(
      selectedBranch?.id,
      `${dateRange.startDate}T00:00:00`,
      `${dateRange.endDate}T23:59:59`
    ),
    enabled: !!selectedBranch?.id,
  });

  const salesData = sales?.data || [];

  const getStatusBadge = (status) => {
    const variants = {
      COMPLETED: 'success',
      PENDING: 'warning',
      CANCELLED: 'destructive',
      VOIDED: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (!selectedBranch) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Please select a branch</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sales History</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
            <h3 className="text-2xl font-bold mt-2">Rs. {totalSales?.data?.toLocaleString() || '0'}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
            <h3 className="text-2xl font-bold mt-2">{salesData.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Average Sale</p>
            <h3 className="text-2xl font-bold mt-2">
              Rs. {salesData.length > 0 ? ((totalSales?.data || 0) / salesData.length).toFixed(2) : '0'}
            </h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.saleNumber}</TableCell>
                      <TableCell>{new Date(sale.saleDate).toLocaleString()}</TableCell>
                      <TableCell>{sale.customerName || 'Walk-in'}</TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                      <TableCell>Rs. {sale.totalAmount?.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
