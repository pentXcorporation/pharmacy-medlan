import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { inventoryService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Search, AlertTriangle, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

export function InventoryPage() {
  const { selectedBranch } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory', selectedBranch?.id, page],
    queryFn: () => inventoryService.getByBranch(selectedBranch?.id, { page, size: 20 }),
    enabled: !!selectedBranch?.id,
  });

  const { data: lowStock } = useQuery({
    queryKey: ['low-stock', selectedBranch?.id],
    queryFn: () => inventoryService.getLowStock(selectedBranch?.id),
    enabled: !!selectedBranch?.id,
  });

  const { data: outOfStock } = useQuery({
    queryKey: ['out-of-stock', selectedBranch?.id],
    queryFn: () => inventoryService.getOutOfStock(selectedBranch?.id),
    enabled: !!selectedBranch?.id,
  });

  if (!selectedBranch) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Please select a branch to view inventory</p>
        </Card>
      </div>
    );
  }

  const inventoryData = inventory?.data?.content || inventory?.data || [];
  const filteredData = inventoryData.filter(item =>
    item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory Management</h1>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Stock</TabsTrigger>
          <TabsTrigger value="low">Low Stock ({lowStock?.data?.length || 0})</TabsTrigger>
          <TabsTrigger value="out">Out of Stock ({outOfStock?.data?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8">Loading...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Available Qty</TableHead>
                      <TableHead>Reserved Qty</TableHead>
                      <TableHead>Min Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.availableQuantity}</TableCell>
                        <TableCell>{item.reservedQuantity || 0}</TableCell>
                        <TableCell>{item.minimumStock}</TableCell>
                        <TableCell>
                          {item.availableQuantity === 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : item.availableQuantity <= item.minimumStock ? (
                            <Badge variant="warning">Low Stock</Badge>
                          ) : (
                            <Badge variant="success">In Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStock?.data?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-orange-600 font-medium">{item.availableQuantity}</TableCell>
                      <TableCell>{item.minimumStock}</TableCell>
                      <TableCell>{item.reorderLevel}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="out">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-500" />
                Out of Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Min Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outOfStock?.data?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{item.minimumStock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
