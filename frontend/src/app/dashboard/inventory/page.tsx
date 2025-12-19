'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, AlertTriangle, AlertCircle } from 'lucide-react';
import { inventoryService } from '@/lib/services';
import type { Inventory } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [lowStock, setLowStock] = useState<Inventory[]>([]);
  const [expiring, setExpiring] = useState<Inventory[]>([]);
  const branchId = typeof window !== 'undefined' ? Number(localStorage.getItem('branchId') || '1') : 1;

  useEffect(() => {
    loadInventory();
    loadLowStock();
    loadExpiring();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await inventoryService.getByBranch(branchId, 0, 100);
      setInventory(res.data?.data?.content || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    }
  };

  const loadLowStock = async () => {
    try {
      const res = await inventoryService.getLowStock(branchId);
      setLowStock(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load low stock:', err);
    }
  };

  const loadExpiring = async () => {
    try {
      const alertDate = new Date();
      alertDate.setMonth(alertDate.getMonth() + 3);
      const res = await inventoryService.getExpiring(branchId, alertDate.toISOString().split('T')[0]);
      setExpiring(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load expiring items:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStock.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertCircle className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiring.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Inventory</TabsTrigger>
            <TabsTrigger value="low">Low Stock</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Total Qty</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.totalQuantity}</TableCell>
                        <TableCell>{item.availableQuantity}</TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell>
                          <Badge variant={item.availableQuantity > item.reorderLevel ? 'default' : 'destructive'}>
                            {item.availableQuantity > item.reorderLevel ? 'Good' : 'Low'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Shortage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStock.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-orange-600 font-bold">{item.availableQuantity}</TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell className="text-red-600">
                          {item.reorderLevel - item.availableQuantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expiring">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiring.map((item, idx) => 
                      item.batches.map((batch, bidx) => (
                        <TableRow key={`${idx}-${bidx}`}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell className="font-mono text-xs">{batch.batchNumber}</TableCell>
                          <TableCell>{batch.quantity}</TableCell>
                          <TableCell className="text-red-600">
                            {new Date(batch.expiryDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
