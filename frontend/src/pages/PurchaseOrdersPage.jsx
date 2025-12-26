import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { purchaseOrderService, supplierService, productService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function PurchaseOrdersPage() {
  const queryClient = useQueryClient();
  const { selectedBranch } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['purchase-orders', selectedBranch?.id],
    queryFn: () => purchaseOrderService.getByBranch(selectedBranch?.id),
    enabled: !!selectedBranch?.id,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => purchaseOrderService.approve(id),
    onSuccess: () => {
      toast.success('Purchase order approved');
      queryClient.invalidateQueries(['purchase-orders']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => purchaseOrderService.reject(id, reason),
    onSuccess: () => {
      toast.success('Purchase order rejected');
      queryClient.invalidateQueries(['purchase-orders']);
    },
  });

  const ordersData = orders?.data || [];

  const getStatusBadge = (status) => {
    const variants = {
      DRAFT: 'secondary',
      PENDING_APPROVAL: 'warning',
      APPROVED: 'success',
      REJECTED: 'destructive',
      SENT_TO_SUPPLIER: 'default',
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create PO
        </Button>
      </div>

      {showForm && (
        <POForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries(['purchase-orders']);
          }}
        />
      )}

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <p className="text-center py-8">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.poNumber}</TableCell>
                    <TableCell>{order.supplierName}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>Rs. {order.totalAmount?.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === 'PENDING_APPROVAL' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => approveMutation.mutate(order.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => rejectMutation.mutate({ id: order.id, reason: 'Rejected' })}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function POForm({ onClose, onSuccess }) {
  const { selectedBranch } = useAppStore();
  const [items, setItems] = useState([{ productId: '', quantityOrdered: '', unitPrice: '', discountPercent: 0, gstRate: 5 }]);
  const [formData, setFormData] = useState({
    supplierId: '',
    expectedDeliveryDate: '',
    remarks: '',
  });

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers-active'],
    queryFn: () => supplierService.getActive(),
  });

  const { data: products } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => productService.getAll({ page: 0, size: 100 }),
  });

  const mutation = useMutation({
    mutationFn: (data) => purchaseOrderService.create(data),
    onSuccess: () => {
      toast.success('Purchase order created');
      onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      branchId: selectedBranch.id,
      items: items.filter(item => item.productId && item.quantityOrdered),
    });
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantityOrdered: '', unitPrice: '', discountPercent: 0, gstRate: 5 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const productsData = products?.data?.content || products?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Purchase Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Supplier *</Label>
              <Select value={formData.supplierId} onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })} required>
                <option value="">Select Supplier</option>
                {suppliers?.data?.map((s) => (
                  <option key={s.id} value={s.id}>{s.supplierName}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Expected Delivery Date</Label>
              <Input type="date" value={formData.expectedDeliveryDate} onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Items</Label>
              <Button type="button" size="sm" onClick={addItem}>Add Item</Button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 items-end">
                <Select value={item.productId} onChange={(e) => updateItem(index, 'productId', e.target.value)} required>
                  <option value="">Select Product</option>
                  {productsData.map((p) => (
                    <option key={p.id} value={p.id}>{p.productName}</option>
                  ))}
                </Select>
                <Input type="number" placeholder="Quantity" value={item.quantityOrdered} onChange={(e) => updateItem(index, 'quantityOrdered', e.target.value)} required />
                <Input type="number" step="0.01" placeholder="Unit Price" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', e.target.value)} required />
                <Input type="number" step="0.01" placeholder="Discount %" value={item.discountPercent} onChange={(e) => updateItem(index, 'discountPercent', e.target.value)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create PO'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
