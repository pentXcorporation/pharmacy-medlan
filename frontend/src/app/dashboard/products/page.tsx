'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { productService, categoryService } from '@/lib/services';
import { toast } from 'sonner';
import type { Product, Category } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    genericName: '',
    categoryId: '',
    dosageForm: 'TABLET',
    strength: '',
    drugSchedule: 'OTC',
    manufacturer: '',
    barcode: '',
    costPrice: '',
    sellingPrice: '',
    mrp: '',
    gstRate: '5',
    reorderLevel: '100',
    minimumStock: '50',
    maximumStock: '1000',
    isPrescriptionRequired: false
  });

  useEffect(() => {
    loadProducts();
    categoryService.getActive().then(res => {
      if (res.data?.data) {
        setCategories(res.data.data);
      }
    }).catch(err => console.error('Failed to load categories:', err));
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productService.getAll(0, 100);
      if (res.data?.data?.content) {
        setProducts(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadProducts();
      return;
    }
    try {
      const res = await productService.search(searchQuery);
      if (res.data?.data) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        categoryId: Number(formData.categoryId),
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        mrp: Number(formData.mrp),
        gstRate: Number(formData.gstRate),
        reorderLevel: Number(formData.reorderLevel),
        minimumStock: Number(formData.minimumStock),
        maximumStock: Number(formData.maximumStock),
        profitMargin: ((Number(formData.sellingPrice) - Number(formData.costPrice)) / Number(formData.costPrice)) * 100
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, data);
        toast.success('Product updated');
      } else {
        await productService.create(data);
        toast.success('Product created');
      }

      setDialogOpen(false);
      loadProducts();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      genericName: product.genericName || '',
      categoryId: product.categoryId.toString(),
      dosageForm: product.dosageForm,
      strength: product.strength || '',
      drugSchedule: product.drugSchedule,
      manufacturer: product.manufacturer || '',
      barcode: product.barcode || '',
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      mrp: product.mrp.toString(),
      gstRate: product.gstRate.toString(),
      reorderLevel: product.reorderLevel.toString(),
      minimumStock: product.minimumStock.toString(),
      maximumStock: product.maximumStock.toString(),
      isPrescriptionRequired: product.isPrescriptionRequired
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this product?')) {
      try {
        await productService.delete(id);
        toast.success('Product deleted');
        loadProducts();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      productName: '',
      genericName: '',
      categoryId: '',
      dosageForm: 'TABLET',
      strength: '',
      drugSchedule: 'OTC',
      manufacturer: '',
      barcode: '',
      costPrice: '',
      sellingPrice: '',
      mrp: '',
      gstRate: '5',
      reorderLevel: '100',
      minimumStock: '50',
      maximumStock: '1000',
      isPrescriptionRequired: false
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Products</h1>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Product Name *</Label>
                    <Input value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Generic Name</Label>
                    <Input value={formData.genericName} onChange={(e) => setFormData({...formData, genericName: e.target.value})} />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select value={formData.categoryId} onValueChange={(v) => setFormData({...formData, categoryId: v})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map(cat => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>{cat.categoryName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Dosage Form</Label>
                    <Select value={formData.dosageForm} onValueChange={(v) => setFormData({...formData, dosageForm: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM', 'OINTMENT'].map(form => (
                          <SelectItem key={form} value={form}>{form}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Strength</Label>
                    <Input value={formData.strength} onChange={(e) => setFormData({...formData, strength: e.target.value})} />
                  </div>
                  <div>
                    <Label>Manufacturer</Label>
                    <Input value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
                  </div>
                  <div>
                    <Label>Barcode</Label>
                    <Input value={formData.barcode} onChange={(e) => setFormData({...formData, barcode: e.target.value})} />
                  </div>
                  <div>
                    <Label>Drug Schedule</Label>
                    <Select value={formData.drugSchedule} onValueChange={(v) => setFormData({...formData, drugSchedule: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['OTC', 'H', 'H1', 'X'].map(schedule => (
                          <SelectItem key={schedule} value={schedule}>{schedule}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cost Price *</Label>
                    <Input type="number" step="0.01" value={formData.costPrice} onChange={(e) => setFormData({...formData, costPrice: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Selling Price *</Label>
                    <Input type="number" step="0.01" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} required />
                  </div>
                  <div>
                    <Label>MRP *</Label>
                    <Input type="number" step="0.01" value={formData.mrp} onChange={(e) => setFormData({...formData, mrp: e.target.value})} required />
                  </div>
                  <div>
                    <Label>GST Rate (%)</Label>
                    <Input type="number" value={formData.gstRate} onChange={(e) => setFormData({...formData, gstRate: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-2">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Generic</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-xs">{product.productCode}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-xs text-gray-500">{product.strength}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{product.genericName}</TableCell>
                    <TableCell><Badge variant="outline">{product.dosageForm}</Badge></TableCell>
                    <TableCell>₹{product.sellingPrice}</TableCell>
                    <TableCell>{product.minimumStock}</TableCell>
                    <TableCell>
                      <Badge variant={product.active ? 'default' : 'secondary'}>
                        {product.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
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
    </DashboardLayout>
  );
}
