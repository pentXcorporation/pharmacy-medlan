'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { supplierService } from '@/lib/services';
import { toast } from 'sonner';
import type { Supplier } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstinNumber: '',
    defaultDiscountPercent: '0',
    paymentTermDays: '30',
    creditLimit: '0'
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await supplierService.getAll(0, 100);
      setSuppliers(res.data?.data?.content || []);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadSuppliers();
      return;
    }
    try {
      const res = await supplierService.search(searchQuery);
      setSuppliers(res.data?.data || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        defaultDiscountPercent: Number(formData.defaultDiscountPercent),
        paymentTermDays: Number(formData.paymentTermDays),
        creditLimit: Number(formData.creditLimit)
      };

      if (editingSupplier) {
        await supplierService.update(editingSupplier.id, data);
        toast.success('Supplier updated');
      } else {
        await supplierService.create(data);
        toast.success('Supplier created');
      }

      setDialogOpen(false);
      loadSuppliers();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      supplierName: supplier.supplierName,
      contactPerson: supplier.contactPerson || '',
      phoneNumber: supplier.phoneNumber,
      email: supplier.email || '',
      address: supplier.address || '',
      city: supplier.city || '',
      state: supplier.state || '',
      pincode: supplier.pincode || '',
      gstinNumber: supplier.gstinNumber || '',
      defaultDiscountPercent: supplier.defaultDiscountPercent.toString(),
      paymentTermDays: supplier.paymentTermDays.toString(),
      creditLimit: supplier.creditLimit.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this supplier?')) {
      try {
        await supplierService.delete(id);
        toast.success('Supplier deleted');
        loadSuppliers();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setEditingSupplier(null);
    setFormData({
      supplierName: '',
      contactPerson: '',
      phoneNumber: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstinNumber: '',
      defaultDiscountPercent: '0',
      paymentTermDays: '30',
      creditLimit: '0'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Supplier Name *</Label>
                    <Input value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <Input value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
                  </div>
                  <div>
                    <Label>GSTIN</Label>
                    <Input value={formData.gstinNumber} onChange={(e) => setFormData({...formData, gstinNumber: e.target.value})} />
                  </div>
                  <div>
                    <Label>Discount %</Label>
                    <Input type="number" value={formData.defaultDiscountPercent} onChange={(e) => setFormData({...formData, defaultDiscountPercent: e.target.value})} />
                  </div>
                  <div>
                    <Label>Payment Terms (Days)</Label>
                    <Input type="number" value={formData.paymentTermDays} onChange={(e) => setFormData({...formData, paymentTermDays: e.target.value})} />
                  </div>
                  <div>
                    <Label>Credit Limit</Label>
                    <Input type="number" value={formData.creditLimit} onChange={(e) => setFormData({...formData, creditLimit: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-2">
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map(supplier => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-mono text-xs">{supplier.supplierCode}</TableCell>
                    <TableCell className="font-medium">{supplier.supplierName}</TableCell>
                    <TableCell className="text-sm">{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.phoneNumber}</TableCell>
                    <TableCell>{supplier.city}</TableCell>
                    <TableCell>₹{supplier.creditLimit}</TableCell>
                    <TableCell>
                      <Badge variant={supplier.active ? 'default' : 'secondary'}>
                        {supplier.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
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
