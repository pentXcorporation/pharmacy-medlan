import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/api';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { FileText, Download, TrendingUp, Package, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export function ReportsPage() {
  const { selectedBranch } = useAppStore();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: salesReport, isLoading: loadingSales } = useQuery({
    queryKey: ['sales-report', selectedBranch?.id, dateRange],
    queryFn: () => reportsService.getSalesDetails(
      selectedBranch?.id,
      dateRange.startDate,
      dateRange.endDate
    ),
    enabled: !!selectedBranch?.id && reportType === 'sales',
  });

  const { data: topProducts } = useQuery({
    queryKey: ['top-products', selectedBranch?.id, dateRange],
    queryFn: () => reportsService.getTopProducts(
      selectedBranch?.id,
      dateRange.startDate,
      dateRange.endDate,
      10
    ),
    enabled: !!selectedBranch?.id && reportType === 'sales',
  });

  if (!selectedBranch) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Please select a branch to view reports</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Report Type Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="sales">Sales Report</option>
                <option value="inventory">Inventory Report</option>
                <option value="financial">Financial Report</option>
                <option value="purchase">Purchase Report</option>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary Cards */}
      {reportType === 'sales' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <h3 className="text-2xl font-bold">Rs. {salesReport?.data?.totalAmount?.toLocaleString() || '0'}</h3>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <h3 className="text-2xl font-bold">{salesReport?.data?.orderCount || '0'}</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <h3 className="text-2xl font-bold">Rs. {salesReport?.data?.avgOrderValue?.toLocaleString() || '0'}</h3>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Products Table */}
      {reportType === 'sales' && topProducts?.data && (
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSales ? (
              <p className="text-center py-8">Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Avg Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.data.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell>{product.quantitySold}</TableCell>
                      <TableCell>Rs. {product.totalRevenue?.toLocaleString()}</TableCell>
                      <TableCell>Rs. {product.avgPrice?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
