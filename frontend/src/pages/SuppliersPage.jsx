import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function SuppliersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers', searchQuery],
    queryFn: () => searchQuery ? supplierService.search(searchQuery) : supplierService.getAll({ page: 0, size: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => supplierService.delete(id),
    onSuccess: () => {
      toast.success('Supplier deleted');
      queryClient.invalidateQueries(['suppliers']);
    },
  });

  const suppliersData = suppliers?.data?.content || suppliers?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <Button onClick={() => { setShowForm(true); setEditingSupplier(null); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onClose={() => { setShowForm(false); setEditingSupplier(null); }}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries(['suppliers']);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search suppliers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliersData.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.supplierName}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.phoneNumber}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.active ? 'success' : 'destructive'}>
                      {supplier.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingSupplier(supplier); setShowForm(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(supplier.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
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
  );
}

function SupplierForm({ supplier, onClose, onSuccess }) {
  const [formData, setFormData] = useState(supplier || {
    supplierName: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => supplier ? supplierService.update(supplier.id, data) : supplierService.create(data),
    onSuccess: () => {
      toast.success(`Supplier ${supplier ? 'updated' : 'created'}`);
      onSuccess();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Supplier Name *</Label>
              <Input value={formData.supplierName} onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })} required />
            </div>
            <div>
              <Label>Contact Person</Label>
              <Input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{mutation.isPending ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
