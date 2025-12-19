'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { categoryService } from '@/lib/services';
import { toast } from 'sonner';
import type { Category } from '@/types';

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryCode: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await categoryService.getAll();
    setCategories(res.data.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData.categoryName, formData.description);
        toast.success('Category updated');
      } else {
        await categoryService.create(formData.categoryName, formData.categoryCode, formData.description);
        toast.success('Category created');
      }
      setDialogOpen(false);
      loadCategories();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      categoryCode: category.categoryCode,
      description: category.description || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this category?')) {
      try {
        await categoryService.delete(id);
        toast.success('Category deleted');
        loadCategories();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      categoryName: '',
      categoryCode: '',
      description: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Categories</h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category Name *</Label>
                <Input 
                  value={formData.categoryName} 
                  onChange={(e) => setFormData({...formData, categoryName: e.target.value})} 
                  required 
                />
              </div>
              {!editingCategory && (
                <div>
                  <Label>Category Code *</Label>
                  <Input 
                    value={formData.categoryCode} 
                    onChange={(e) => setFormData({...formData, categoryCode: e.target.value})} 
                    required 
                  />
                </div>
              )}
              <div>
                <Label>Description</Label>
                <Input 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow key={category.id}>
              <TableCell className="font-mono text-xs">{category.categoryCode}</TableCell>
              <TableCell className="font-medium">{category.categoryName}</TableCell>
              <TableCell className="text-sm text-gray-500">{category.description}</TableCell>
              <TableCell>
                <Badge variant={category.active ? 'default' : 'secondary'}>
                  {category.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
