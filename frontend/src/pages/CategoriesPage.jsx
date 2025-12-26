import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/api';
import { usePermission } from '../hooks/usePermission';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Textarea } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const { can } = usePermission();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryService.delete(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error) => toast.error(error.message || 'Failed to delete'),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        {can('CREATE_PRODUCT') && (
          <Button onClick={() => { setShowForm(true); setEditingCategory(null); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => { setShowForm(false); setEditingCategory(null); }}
          onSuccess={() => {
            setShowForm(false);
            setEditingCategory(null);
            queryClient.invalidateQueries(['categories']);
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
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.data?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.categoryName}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <Badge variant={category.active ? 'success' : 'destructive'}>
                        {category.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {can('EDIT_PRODUCT') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingCategory(category); setShowForm(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {can('DELETE_PRODUCT') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(category.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

function CategoryForm({ category, onClose, onSuccess }) {
  const [formData, setFormData] = useState(category || {
    categoryName: '',
    description: '',
    active: true,
  });

  const mutation = useMutation({
    mutationFn: (data) => category 
      ? categoryService.update(category.id, data)
      : categoryService.create(data),
    onSuccess: () => {
      toast.success(`Category ${category ? 'updated' : 'created'}`);
      onSuccess();
    },
    onError: (error) => toast.error(error.message || 'Operation failed'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? 'Edit Category' : 'Add Category'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Category Name *</Label>
            <Input
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
