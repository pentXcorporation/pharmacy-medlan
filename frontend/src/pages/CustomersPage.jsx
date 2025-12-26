import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function CustomersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', searchQuery],
    queryFn: () => searchQuery ? customerService.search(searchQuery) : customerService.getAll({ page: 0, size: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => customerService.delete(id),
    onSuccess: () => {
      toast.success('Customer deleted successfully');
      queryClient.invalidateQueries(['customers']);
    },
  });

  const customersData = customers?.data?.content || customers?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => { setShowForm(true); setEditingCustomer(null); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onClose={() => { setShowForm(false); setEditingCustomer(null); }}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries(['customers']);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.customerName}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>
                    <Badge variant={customer.active ? 'success' : 'destructive'}>
                      {customer.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingCustomer(customer); setShowForm(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(customer.id)}>
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

function CustomerForm({ customer, onClose, onSuccess }) {
  const [formData, setFormData] = useState(customer || {
    customerName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => customer ? customerService.update(customer.id, data) : customerService.create(data),
    onSuccess: () => {
      toast.success(`Customer ${customer ? 'updated' : 'created'} successfully`);
      onSuccess();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Customer Name *</Label>
              <Input value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} required />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
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
