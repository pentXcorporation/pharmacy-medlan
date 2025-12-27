import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { productService, customerService, salesService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Search, Plus, Trash2, ShoppingCart, User, CreditCard, Loader2, Package, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export function POSPage() {
  const { selectedBranch } = useAppStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paidAmount, setPaidAmount] = useState('');

  const { data: products, isLoading: isSearching } = useQuery({
    queryKey: ['products-search', searchQuery],
    queryFn: () => productService.search(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const { data: customers } = useQuery({
    queryKey: ['customers-active'],
    queryFn: () => customerService.getActive(),
  });

  const createSaleMutation = useMutation({
    mutationFn: (data) => salesService.create(data),
    onSuccess: () => {
      toast.success('Sale completed successfully!');
      setCart([]);
      setSelectedCustomer(null);
      setPaidAmount('');
      queryClient.invalidateQueries(['dashboard-summary']);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to complete sale');
    },
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.productName,
        sellingPrice: product.sellingPrice,
        quantity: 1,
        discountAmount: 0,
      }]);
    }
    setSearchQuery('');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(cart.map(item => 
      item.productId === productId ? { ...item, quantity: parseInt(quantity) } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discountAmount, 0);
  const total = subtotal - totalDiscount;
  const change = paidAmount ? parseFloat(paidAmount) - total : 0;

  const handleCheckout = () => {
    if (!selectedBranch) {
      toast.error('Please select a branch');
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!paidAmount || parseFloat(paidAmount) < total) {
      toast.error('Insufficient payment amount');
      return;
    }

    const saleData = {
      branchId: selectedBranch.id,
      customerId: selectedCustomer?.id,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        discountAmount: item.discountAmount,
      })),
      paymentMethod,
      paidAmount: parseFloat(paidAmount),
      discountAmount: totalDiscount,
    };

    createSaleMutation.mutate(saleData);
  };

  if (!selectedBranch) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 max-w-md text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Branch Selected</h3>
          <p className="text-muted-foreground">Please select a branch to use the POS system</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Product Search & Cart */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, code, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {isSearching && searchQuery.length > 2 && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
              )}
            </div>
            {products?.data && searchQuery.length > 2 && (
              <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg divide-y">
                {products.data.length === 0 ? (
                  <p className="p-4 text-center text-muted-foreground">No products found</p>
                ) : (
                  products.data.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="w-full p-3 text-left hover:bg-accent/50 transition-colors flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.genericName}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="success">Rs. {product.sellingPrice}</Badge>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Cart
              </span>
              <Badge variant="secondary">{cart.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Search for products to add</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          Rs. {item.sellingPrice}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, e.target.value)}
                              className="w-14 h-8 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          Rs. {(item.sellingPrice * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Checkout */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const customer = customers?.data?.find(c => c.id === parseInt(e.target.value));
                setSelectedCustomer(customer);
              }}
            >
              <option value="">Walk-in Customer</option>
              {customers?.data?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customerName} - {customer.phoneNumber}
                </option>
              ))}
            </Select>
            {selectedCustomer && (
              <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                <p className="font-medium">{selectedCustomer.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.phoneNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </Select>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <span className="text-destructive">- Rs. {totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total:</span>
                <span className="text-primary">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Amount Paid</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                step="0.01"
                className="text-lg font-medium"
              />
            </div>

            {paidAmount && (
              <div className={cn(
                "flex justify-between items-center p-3 rounded-lg",
                change >= 0 ? "bg-success/10" : "bg-destructive/10"
              )}>
                <span className="font-medium">Change:</span>
                <span className={cn(
                  "text-lg font-bold",
                  change >= 0 ? "text-success" : "text-destructive"
                )}>
                  Rs. {change.toFixed(2)}
                </span>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={cart.length === 0 || createSaleMutation.isPending || change < 0}
              loading={createSaleMutation.isPending}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Complete Sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
