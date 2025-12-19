'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { productService, customerService, saleService } from '@/lib/services';
import { toast } from 'sonner';
import type { Product, Customer, SaleItem } from '@/types';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<number>();
  const [cartItems, setCartItems] = useState<(SaleItem & { product?: Product })[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paidAmount, setPaidAmount] = useState('');

  useEffect(() => {
    customerService.getAll().then(res => {
      if (res.data?.data?.content) {
        setCustomers(res.data.data.content);
      }
    }).catch(err => console.error('Failed to load customers:', err));
  }, []);

  const searchProducts = async () => {
    if (!searchQuery) return;
    try {
      const res = await productService.search(searchQuery);
      if (res.data?.data) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cartItems.find(item => item.productId === product.id);
    if (existing) {
      setCartItems(cartItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        productId: product.id,
        quantity: 1,
        discountAmount: 0,
        product
      }]);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.productId !== productId));
    } else {
      setCartItems(cartItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const removeItem = (productId: number) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.product?.sellingPrice || 0) * item.quantity, 0
  );

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const branchId = Number(localStorage.getItem('branchId') || '1');
    
    try {
      await saleService.create({
        customerId: selectedCustomer,
        branchId,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          discountAmount: item.discountAmount
        })),
        discountAmount: 0,
        paymentMethod,
        paidAmount: Number(paidAmount) || total
      });

      toast.success('Sale completed successfully');
      setCartItems([]);
      setPaidAmount('');
      setSelectedCustomer(undefined);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete sale');
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchProducts()}
                />
                <Button onClick={searchProducts}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {products.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {products.map(product => (
                    <div
                      key={product.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => addToCart(product)}
                    >
                      <p className="font-medium text-sm">{product.productName}</p>
                      <p className="text-xs text-gray-500">{product.genericName}</p>
                      <p className="text-sm font-bold text-blue-600">₹{product.sellingPrice}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map(item => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.product?.productName}</p>
                          <p className="text-xs text-gray-500">{item.product?.genericName}</p>
                        </div>
                      </TableCell>
                      <TableCell>₹{item.product?.sellingPrice}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                          className="w-20"
                          min="1"
                        />
                      </TableCell>
                      <TableCell>₹{((item.product?.sellingPrice || 0) * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCustomer?.toString()} onValueChange={(v) => setSelectedCustomer(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Walk-in Customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <Label>Paid Amount</Label>
                <Input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder={total.toFixed(2)}
                />
              </div>

              {Number(paidAmount) > total && (
                <div className="flex justify-between text-green-600">
                  <span>Change:</span>
                  <span>₹{(Number(paidAmount) - total).toFixed(2)}</span>
                </div>
              )}

              <Button className="w-full" size="lg" onClick={handleCheckout}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Complete Sale
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
