import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchService } from '../services/api';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function BranchesPage() {
  const queryClient = useQueryClient();
  const { selectedBranch, setSelectedBranch } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: () => branchService.getAllList(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => branchService.delete(id),
    onSuccess: () => {
      toast.success('Branch deleted');
      queryClient.invalidateQueries(['branches']);
    },
  });

  const branchesData = branches?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Branches</h1>
        <Button onClick={() => { setShowForm(true); setEditingBranch(null); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {showForm && (
        <BranchForm
          branch={editingBranch}
          onClose={() => { setShowForm(false); setEditingBranch(null); }}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries(['branches']);
          }}
        />
      )}

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branchesData.map((branch) => (
                <TableRow key={branch.id} className={selectedBranch?.id === branch.id ? 'bg-primary/5' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {branch.branchName}
                      {selectedBranch?.id === branch.id && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{branch.branchCode}</TableCell>
                  <TableCell>{branch.city}</TableCell>
                  <TableCell>{branch.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge variant={branch.active ? 'success' : 'destructive'}>
                      {branch.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBranch(branch)}
                      >
                        Select
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingBranch(branch); setShowForm(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(branch.id)}>
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

function BranchForm({ branch, onClose, onSuccess }) {
  const [formData, setFormData] = useState(branch || {
    branchCode: '',
    branchName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phoneNumber: '',
    email: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => branch ? branchService.update(branch.id, data) : branchService.create(data),
    onSuccess: () => {
      toast.success(`Branch ${branch ? 'updated' : 'created'}`);
      onSuccess();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{branch ? 'Edit Branch' : 'Add New Branch'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Branch Code *</Label>
              <Input value={formData.branchCode} onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })} required />
            </div>
            <div>
              <Label>Branch Name *</Label>
              <Input value={formData.branchName} onChange={(e) => setFormData({ ...formData, branchName: e.target.value })} required />
            </div>
            <div>
              <Label>Phone *</Label>
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
            <div>
              <Label>State</Label>
              <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
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
