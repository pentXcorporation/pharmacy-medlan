import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saleReturnService } from '../services/api';
import { usePermission } from '../hooks/usePermission';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function SaleReturnsPage() {
  const queryClient = useQueryClient();
  const { can } = usePermission();
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);

  const { data: returns, isLoading } = useQuery({
    queryKey: ['sale-returns', page],
    queryFn: () => saleReturnService.getAll({ page, size: 20 }),
  });

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'destructive',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sale Returns</h1>
        {can('ACCESS_POS') && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Return
          </Button>
        )}
      </div>

      {showForm && (
        <SaleReturnForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries(['sale-returns']);
          }}
        />
      )}

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="text-center py-8">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return No</TableHead>
                  <TableHead>Sale No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns?.data?.content?.map((ret) => (
                  <TableRow key={ret.id}>
                    <TableCell className="font-medium">{ret.returnNumber}</TableCell>
                    <TableCell>{ret.saleNumber}</TableCell>
                    <TableCell>{new Date(ret.returnDate).toLocaleDateString()}</TableCell>
                    <TableCell>{ret.customerName}</TableCell>
                    <TableCell>Rs. {ret.totalAmount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(ret.status)}>
                        {ret.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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

function SaleReturnForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    saleId: '',
    returnReason: '',
    items: [],
  });

  const mutation = useMutation({
    mutationFn: (data) => saleReturnService.create(data),
    onSuccess: () => {
      toast.success('Return created');
      onSuccess();
    },
    onError: (error) => toast.error(error.message || 'Failed to create return'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Sale Return</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Sale Invoice Number *</Label>
            <Input
              value={formData.saleId}
              onChange={(e) => setFormData({ ...formData, saleId: e.target.value })}
              placeholder="Enter sale invoice number"
              required
            />
          </div>
          <div>
            <Label>Return Reason *</Label>
            <Select
              value={formData.returnReason}
              onChange={(e) => setFormData({ ...formData, returnReason: e.target.value })}
              required
            >
              <option value="">Select reason</option>
              <option value="DAMAGED">Damaged Product</option>
              <option value="EXPIRED">Expired Product</option>
              <option value="WRONG_ITEM">Wrong Item</option>
              <option value="CUSTOMER_REQUEST">Customer Request</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Return'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
