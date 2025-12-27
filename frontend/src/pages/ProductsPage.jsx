import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, categoryService } from '../services/api';
import { usePermission } from '../hooks/usePermission';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select, Textarea, Checkbox } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Plus, Edit, Trash2, Search, Package, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

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
  const totalPages = productsData?.data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your product catalog</p>
        </div>
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
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, generic name, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium">No products found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? 'Try a different search term' : 'Add your first product to get started'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="hidden md:table-cell">Generic Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Category</TableHead>
                      <TableHead className="text-right">MRP</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Selling Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.productName}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {product.genericName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {product.genericName}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{product.categoryName}</Badge>
                        </TableCell>
                        <TableCell className="text-right">Rs. {product.mrp}</TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          Rs. {product.sellingPrice}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.active ? 'success' : 'destructive'}>
                            {product.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            {can('EDIT_PRODUCT') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => { setEditingProduct(product); setShowForm(true); }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {can('DELETE_PRODUCT') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this product?')) {
                                    deleteMutation.mutate(product.id);
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
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
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          {product ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label>Generic Name</Label>
              <Input
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                placeholder="Enter generic name"
              />
            </div>
            <div className="space-y-2">
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
            <div className="space-y-2">
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
                <option value="OINTMENT">Ointment</option>
                <option value="DROPS">Drops</option>
                <option value="POWDER">Powder</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Strength</Label>
              <Input
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                placeholder="e.g., 500mg"
              />
            </div>
            <div className="space-y-2">
              <Label>Manufacturer</Label>
              <Input
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Enter manufacturer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Barcode</Label>
              <Input
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Scan or enter barcode"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Pricing</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Cost Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Selling Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>MRP *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>GST Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.gstRate}
                  onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Stock Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Reorder Level</Label>
                <Input
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Stock</Label>
                <Input
                  type="number"
                  value={formData.minimumStock}
                  onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Stock</Label>
                <Input
                  type="number"
                  value={formData.maximumStock}
                  onChange={(e) => setFormData({ ...formData, maximumStock: e.target.value })}
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="prescription"
              checked={formData.isPrescriptionRequired}
              onChange={(e) => setFormData({ ...formData, isPrescriptionRequired: e.target.checked })}
            />
            <Label htmlFor="prescription" className="cursor-pointer font-normal">
              Prescription Required
            </Label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
