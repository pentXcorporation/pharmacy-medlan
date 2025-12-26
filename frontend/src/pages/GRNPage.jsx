import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { grnService, supplierService, productService, purchaseOrderService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function GRNPage() {
  const queryClient = useQueryClient();
  const { selectedBranch } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const { data: grns, isLoading } = useQuery({
    queryKey: ['grns', selectedBranch?.id],
    queryFn: () => grnService.getByBranch(selectedBranch?.id, { page: 0, size: 50 }),
    enabled: !!selectedBranch?.id,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => grnService.approve(id),
    onSuccess: () => {
      toast.success('GRN approved and stock updated');
      queryClient.invalidateQueries(['grns']);
      queryClient.invalidateQueries(['inventory']);
    },
  });

  const grnsData = grns?.data?.content || grns?.data || [];

  const getStatusBadge = (status) => {
    const variants = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'destructive', CANCELLED: 'secondary' };
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
        <h1 className="text-3xl font-bold">Goods Receipt Note (GRN)</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create GRN
        </Button>
      </div>

      {showForm && (
        <GRNForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries(['grns']);
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
                  <TableHead>GRN Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grnsData.map((grn) => (
                  <TableRow key={grn.id}>
                    <TableCell className="font-medium">{grn.grnNumber}</TableCell>
                    <TableCell>{grn.supplierName}</TableCell>
                    <TableCell>{new Date(grn.receivedDate).toLocaleDateString()}</TableCell>
                    <TableCell>Rs. {grn.totalAmount?.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(grn.status)}</TableCell>
                    <TableCell>
                      {grn.status === 'PENDING' && (
                        <Button size="sm" variant="outline" onClick={() => approveMutation.mutate(grn.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
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

function GRNForm({ onClose, onSuccess }) {
  const { selectedBranch } = useAppStore();
  const [items, setItems] = useState([{ productId: '', batchNumber: '', quantity: '', costPrice: '', sellingPrice: '', manufacturingDate: '', expiryDate: '' }]);
  const [formData, setFormData] = useState({
    supplierId: '',
    purchaseOrderId: '',
    receivedDate: new Date().toISOString().split('T')[0],
    supplierInvoiceNumber: '',
    supplierInvoiceDate: '',
  });

  const { data: suppliers } = useQuery({ queryKey: ['suppliers-active'], queryFn: () => supplierService.getActive() });
  const { data: products } = useQuery({ queryKey: ['products-all'], queryFn: () => productService.getAll({ page: 0, size: 100 }) });
  const { data: pos } = useQuery({
    queryKey: ['purchase-orders-approved'],
    queryFn: () => purchaseOrderService.getByStatus('APPROVED'),
    enabled: !!formData.supplierId,
  });

  const mutation = useMutation({
    mutationFn: (data) => grnService.create(data),
    onSuccess: () => {
      toast.success('GRN created successfully');
      onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      branchId: selectedBranch.id,
      items: items.filter(item => item.productId && item.quantity),
    });
  };

  const addItem = () => {
    setItems([...items, { productId: '', batchNumber: '', quantity: '', costPrice: '', sellingPrice: '', manufacturingDate: '', expiryDate: '' }]);
  };

  const productsData = products?.data?.content || products?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create GRN</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label>Purchase Order</Label>
              <Select value={formData.purchaseOrderId} onChange={(e) => setFormData({ ...formData, purchaseOrderId: e.target.value })}>
                <option value="">Select PO (Optional)</option>
                {pos?.data?.map((po) => (
                  <option key={po.id} value={po.id}>{po.poNumber}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Received Date *</Label>
              <Input type="date" value={formData.receivedDate} onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })} required />
            </div>
            <div>
              <Label>Supplier Invoice Number</Label>
              <Input value={formData.supplierInvoiceNumber} onChange={(e) => setFormData({ ...formData, supplierInvoiceNumber: e.target.value })} />
            </div>
            <div>
              <Label>Invoice Date</Label>
              <Input type="date" value={formData.supplierInvoiceDate} onChange={(e) => setFormData({ ...formData, supplierInvoiceDate: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Items</Label>
              <Button type="button" size="sm" onClick={addItem}>Add Item</Button>
            </div>
            <div className="overflow-x-auto">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-7 gap-2 items-end mb-2">
                  <Select value={item.productId} onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].productId = e.target.value;
                    setItems(newItems);
                  }} required>
                    <option value="">Product</option>
                    {productsData.map((p) => (
                      <option key={p.id} value={p.id}>{p.productName}</option>
                    ))}
                  </Select>
                  <Input placeholder="Batch" value={item.batchNumber} onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].batchNumber = e.target.value;
                    setItems(newItems);
                  }} required />
                  <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].quantity = e.target.value;
                    setItems(newItems);
                  }} required />
                  <Input type="number" step="0.01" placeholder="Cost" value={item.costPrice} onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].costPrice = e.target.value;
                    setItems(newItems);
                  }} required />
                  <Input type="number" step="0.01" placeholder="Selling" value={item.sellingPrice} onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].sellingPrice = e.target.value;
                    setItems(newItems);
                  }} required />
                  <Input type="date" placeholder="Mfg" value={item.manufacturingDate} onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].manufacturingDate = e.target.value;
                    setItems(newItems);
                  }} />
                  <Input type="date" placeholder="Exp" value={item.expiryDate} onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].expiryDate = e.target.value;
                    setItems(newItems);
                  }} required />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create GRN'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
