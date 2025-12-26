import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function UsersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll({ page: 0, size: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries(['users']);
    },
  });

  const usersData = users?.data?.content || users?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={() => { setShowForm(true); setEditingUser(null); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => { setShowForm(false); setEditingUser(null); }}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries(['users']);
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
                  <TableHead>Username</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge>{user.role}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={user.active ? 'success' : 'destructive'}>
                        {user.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingUser(user); setShowForm(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(user.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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

function UserForm({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState(user || {
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'PHARMACIST',
    employeeCode: '',
  });

  const mutation = useMutation({
    mutationFn: (data) => user ? userService.update(user.id, data) : userService.create(data),
    onSuccess: () => {
      toast.success(`User ${user ? 'updated' : 'created'}`);
      onSuccess();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? 'Edit User' : 'Add New User'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Username *</Label>
              <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required disabled={!!user} />
            </div>
            {!user && (
              <div>
                <Label>Password *</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
            )}
            <div>
              <Label>Full Name *</Label>
              <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
            </div>
            <div>
              <Label>Role *</Label>
              <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="BRANCH_MANAGER">Branch Manager</option>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="CASHIER">Cashier</option>
                <option value="INVENTORY_MANAGER">Inventory Manager</option>
                <option value="ACCOUNTANT">Accountant</option>
              </Select>
            </div>
            <div>
              <Label>Employee Code</Label>
              <Input value={formData.employeeCode} onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
