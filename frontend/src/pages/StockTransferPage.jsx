import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockTransferService, branchService, productService } from '../services/api';
import { usePermission } from '../hooks/usePermission';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function StockTransferPage() {
  const queryClient = useQueryClient();
  const { can } = usePermission();
  const { selectedBranch } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);

  const { data: transfers, isLoading } = useQuery({
    queryKey: ['stock-transfers', page],
    queryFn: () => stockTransferService.getAll({ page, size: 20 }),
  });

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'destructive',
      IN_TRANSIT: 'default',
      COMPLETED: 'success',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock Transfers</h1>
        {can('MANAGE_INVENTORY') && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Transfer
          </Button>
        )}
      </div>

      {showForm && (
        <StockTransferForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries(['stock-transfers']);
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
                  <TableHead>Transfer No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From Branch</TableHead>
                  <TableHead>To Branch</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers?.data?.content?.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                    <TableCell>{new Date(transfer.transferDate).toLocaleDateString()}</TableCell>
                    <TableCell>{transfer.fromBranchName}</TableCell>
                    <TableCell>{transfer.toBranchName}</TableCell>
                    <TableCell>{transfer.itemCount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(transfer.status)}>
                        {transfer.status}
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

function StockTransferForm({ onClose, onSuccess }) {
  const { selectedBranch } = useAppStore();
  const [formData, setFormData] = useState({
    fromBranchId: selectedBranch?.id || '',
    toBranchId: '',
    transferDate: new Date().toISOString().split('T')[0],
    items: [],
  });

  const { data: branches } = useQuery({
    queryKey: ['branches-active'],
    queryFn: () => branchService.getActive(),
  });

  const mutation = useMutation({
    mutationFn: (data) => stockTransferService.create(data),
    onSuccess: () => {
      toast.success('Transfer created');
      onSuccess();
    },
    onError: (error) => toast.error(error.message || 'Failed to create transfer'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Stock Transfer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From Branch *</Label>
              <Select
                value={formData.fromBranchId}
                onChange={(e) => setFormData({ ...formData, fromBranchId: e.target.value })}
                required
              >
                <option value="">Select branch</option>
                {branches?.data?.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.branchName}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>To Branch *</Label>
              <Select
                value={formData.toBranchId}
                onChange={(e) => setFormData({ ...formData, toBranchId: e.target.value })}
                required
              >
                <option value="">Select branch</option>
                {branches?.data?.filter(b => b.id !== formData.fromBranchId).map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.branchName}</option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label>Transfer Date *</Label>
            <Input
              type="date"
              value={formData.transferDate}
              onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Transfer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
