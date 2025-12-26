import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, categoryService } from '../services/api';
import { usePermission } from '../hooks/usePermission';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select, Textarea } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export function ProductsPage() {
  const queryClient = useQueryClient();
  const { can } = usePermission();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', page, searchQuery],
    queryFn: () => searchQuery 
      ? productService.search(searchQuery)
      : productService.getAll({ page, size: 20 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-active'],
    queryFn: () => categoryService.getActive(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => toast.error(error.message || 'Failed to delete product'),
  });

  const products = productsData?.data?.content || productsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        {can('CREATE_PRODUCT') && (
          <Button onClick={() => { setShowForm(true); setEditingProduct(null); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories?.data || []}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSuccess={() => {
            setShowForm(false);
            setEditingProduct(null);
            queryClient.invalidateQueries(['products']);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Generic Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell>{product.genericName}</TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>Rs. {product.mrp}</TableCell>
                    <TableCell>Rs. {product.sellingPrice}</TableCell>
                    <TableCell>
                      <Badge variant={product.active ? 'success' : 'destructive'}>
                        {product.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {can('EDIT_PRODUCT') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingProduct(product); setShowForm(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {can('DELETE_PRODUCT') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(product.id)}
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

function ProductForm({ product, categories, onClose, onSuccess }) {
  const [formData, setFormData] = useState(product || {
    productName: '',
    genericName: '',
    categoryId: '',
    dosageForm: 'TABLET',
    strength: '',
    manufacturer: '',
    barcode: '',
    description: '',
    costPrice: '',
    sellingPrice: '',
    mrp: '',
    gstRate: '5',
    reorderLevel: '100',
    minimumStock: '50',
    maximumStock: '1000',
    isPrescriptionRequired: false,
  });

  const mutation = useMutation({
    mutationFn: (data) => product 
      ? productService.update(product.id, data)
      : productService.create(data),
    onSuccess: () => {
      toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
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
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Product Name *</Label>
              <Input
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Generic Name</Label>
              <Input
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Dosage Form</Label>
              <Select
                value={formData.dosageForm}
                onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
              >
                <option value="TABLET">Tablet</option>
                <option value="CAPSULE">Capsule</option>
                <option value="SYRUP">Syrup</option>
                <option value="INJECTION">Injection</option>
                <option value="CREAM">Cream</option>
              </Select>
            </div>
            <div>
              <Label>Strength</Label>
              <Input
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                placeholder="e.g., 500mg"
              />
            </div>
            <div>
              <Label>Manufacturer</Label>
              <Input
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>
            <div>
              <Label>Cost Price *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Selling Price *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>MRP *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>GST Rate (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.gstRate}
                onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
