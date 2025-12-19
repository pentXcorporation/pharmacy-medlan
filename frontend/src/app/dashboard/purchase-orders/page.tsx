'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { purchaseOrderService, supplierService, productService } from '@/lib/services';
import { toast } from 'sonner';
import type { PurchaseOrder, Supplier, Product, PurchaseOrderItem } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    expectedDeliveryDate: '',
    discountAmount: '0',
    remarks: ''
  });
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);

  useEffect(() => {
    loadOrders();
    supplierService.getActive().then(res => {
      if (res.data?.data) setSuppliers(res.data.data);
    }).catch(err => console.error('Failed to load suppliers:', err));
    productService.getAll(0, 100).then(res => {
      if (res.data?.data?.content) setProducts(res.data.data.content);
    }).catch(err => console.error('Failed to load products:', err));
  }, []);

  const loadOrders = async () => {
    try {
      const res = await purchaseOrderService.getAll(0, 100);
      setOrders(res.data?.data?.content || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const addItem = () => {
    setItems([...items, {
      productId: 0,
      quantityOrdered: 1,
      unitPrice: 0,
      discountPercent: 0,
      gstRate: 5
    }]);
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Add at least one item');
      return;
    }

    try {
      const branchId = Number(localStorage.getItem('branchId') || '1');
      await purchaseOrderService.create({
        supplierId: Number(formData.supplierId),
        branchId,
        expectedDeliveryDate: formData.expectedDeliveryDate,
        discountAmount: Number(formData.discountAmount),
        remarks: formData.remarks,
        items
      });

      toast.success('Purchase order created');
      setDialogOpen(false);
      loadOrders();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await purchaseOrderService.approve(id);
      toast.success('Purchase order approved');
      loadOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Approval failed');
    }
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      expectedDeliveryDate: '',
      discountAmount: '0',
      remarks: ''
    });
    setItems([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create PO
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Supplier *</Label>
                    <Select value={formData.supplierId} onValueChange={(v) => setFormData({...formData, supplierId: v})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(s => (
                          <SelectItem key={s.id} value={s.id.toString()}>{s.supplierName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Expected Delivery *</Label>
                    <Input type="date" value={formData.expectedDeliveryDate} onChange={(e) => setFormData({...formData, expectedDeliveryDate: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Discount Amount</Label>
                    <Input type="number" value={formData.discountAmount} onChange={(e) => setFormData({...formData, discountAmount: e.target.value})} />
                  </div>
                  <div>
                    <Label>Remarks</Label>
                    <Input value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Items</Label>
                    <Button type="button" size="sm" onClick={addItem}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount %</TableHead>
                        <TableHead>GST %</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Select value={item.productId.toString()} onValueChange={(v) => updateItem(idx, 'productId', Number(v))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map(p => (
                                  <SelectItem key={p.id} value={p.id.toString()}>{p.productName}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.quantityOrdered} onChange={(e) => updateItem(idx, 'quantityOrdered', Number(e.target.value))} className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))} className="w-24" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.discountPercent} onChange={(e) => updateItem(idx, 'discountPercent', Number(e.target.value))} className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.gstRate} onChange={(e) => updateItem(idx, 'gstRate', Number(e.target.value))} className="w-20" />
                          </TableCell>
                          <TableCell>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.poNumber}</TableCell>
                    <TableCell>{order.supplierName}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(order.expectedDeliveryDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-bold">₹{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.status === 'DRAFT' && (
                        <Button variant="ghost" size="icon" onClick={() => handleApprove(order.id)}>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
