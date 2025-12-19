'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { grnService, supplierService, productService } from '@/lib/services';
import { toast } from 'sonner';
import type { GRN, Supplier, Product, GRNItem } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function GRNPage() {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    receivedDate: new Date().toISOString().split('T')[0],
    supplierInvoiceNumber: '',
    supplierInvoiceDate: '',
    remarks: ''
  });
  const [items, setItems] = useState<GRNItem[]>([]);

  useEffect(() => {
    loadGRNs();
    supplierService.getActive().then(res => {
      if (res.data?.data) setSuppliers(res.data.data);
    }).catch(err => console.error('Failed to load suppliers:', err));
    productService.getAll(0, 100).then(res => {
      if (res.data?.data?.content) setProducts(res.data.data.content);
    }).catch(err => console.error('Failed to load products:', err));
  }, []);

  const loadGRNs = async () => {
    try {
      const res = await grnService.getAll(0, 100);
      setGrns(res.data?.data?.content || []);
    } catch (err) {
      console.error('Failed to load GRNs:', err);
    }
  };

  const addItem = () => {
    setItems([...items, {
      productId: 0,
      batchNumber: '',
      quantity: 1,
      costPrice: 0,
      sellingPrice: 0,
      manufacturingDate: '',
      expiryDate: '',
      discountAmount: 0
    }]);
  };

  const updateItem = (index: number, field: keyof GRNItem, value: any) => {
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
      await grnService.create({
        supplierId: Number(formData.supplierId),
        branchId,
        receivedDate: formData.receivedDate,
        supplierInvoiceNumber: formData.supplierInvoiceNumber,
        supplierInvoiceDate: formData.supplierInvoiceDate,
        remarks: formData.remarks,
        items
      });

      toast.success('GRN created successfully');
      setDialogOpen(false);
      loadGRNs();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await grnService.approve(id);
      toast.success('GRN approved and stock updated');
      loadGRNs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Approval failed');
    }
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      receivedDate: new Date().toISOString().split('T')[0],
      supplierInvoiceNumber: '',
      supplierInvoiceDate: '',
      remarks: ''
    });
    setItems([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Goods Receipt Note (GRN)</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Receive Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create GRN - Receive Stock</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
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
                    <Label>Received Date *</Label>
                    <Input type="date" value={formData.receivedDate} onChange={(e) => setFormData({...formData, receivedDate: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Invoice Number</Label>
                    <Input value={formData.supplierInvoiceNumber} onChange={(e) => setFormData({...formData, supplierInvoiceNumber: e.target.value})} />
                  </div>
                  <div>
                    <Label>Invoice Date</Label>
                    <Input type="date" value={formData.supplierInvoiceDate} onChange={(e) => setFormData({...formData, supplierInvoiceDate: e.target.value})} />
                  </div>
                  <div className="col-span-2">
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
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Batch</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Selling</TableHead>
                          <TableHead>Mfg Date</TableHead>
                          <TableHead>Exp Date</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Select value={item.productId.toString()} onValueChange={(v) => updateItem(idx, 'productId', Number(v))}>
                                <SelectTrigger className="w-40">
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
                              <Input value={item.batchNumber} onChange={(e) => updateItem(idx, 'batchNumber', e.target.value)} className="w-28" placeholder="BATCH-001" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} className="w-20" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" step="0.01" value={item.costPrice} onChange={(e) => updateItem(idx, 'costPrice', Number(e.target.value))} className="w-24" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" step="0.01" value={item.sellingPrice} onChange={(e) => updateItem(idx, 'sellingPrice', Number(e.target.value))} className="w-24" />
                            </TableCell>
                            <TableCell>
                              <Input type="date" value={item.manufacturingDate} onChange={(e) => updateItem(idx, 'manufacturingDate', e.target.value)} className="w-36" />
                            </TableCell>
                            <TableCell>
                              <Input type="date" value={item.expiryDate} onChange={(e) => updateItem(idx, 'expiryDate', e.target.value)} className="w-36" />
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
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create GRN</Button>
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
                  <TableHead>GRN Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grns.map(grn => (
                  <TableRow key={grn.id}>
                    <TableCell className="font-mono text-xs">{grn.grnNumber}</TableCell>
                    <TableCell>{grn.supplierId}</TableCell>
                    <TableCell>{new Date(grn.receivedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm">{grn.supplierInvoiceNumber}</TableCell>
                    <TableCell className="font-bold">₹{grn.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={grn.status === 'APPROVED' ? 'default' : 'secondary'}>
                        {grn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {grn.status === 'PENDING' && (
                        <Button variant="ghost" size="icon" onClick={() => handleApprove(grn.id)}>
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
