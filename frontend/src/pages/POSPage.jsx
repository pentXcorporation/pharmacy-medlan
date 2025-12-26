import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { productService, customerService, salesService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Search, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export function POSPage() {
  const { selectedBranch } = useAppStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [paidAmount, setPaidAmount] = useState('');

  const { data: products } = useQuery({
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Product Search & Cart */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, code, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {products?.data && searchQuery.length > 2 && (
              <div className="mt-2 max-h-48 overflow-y-auto border rounded-md">
                {products.data.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="w-full p-3 text-left hover:bg-accent transition-colors border-b last:border-b-0"
                  >
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.genericName} | Rs. {product.sellingPrice}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Cart is empty</p>
            ) : (
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
                  {cart.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>Rs. {item.sellingPrice}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, e.target.value)}
                          className="w-20"
                          min="1"
                        />
                      </TableCell>
                      <TableCell>Rs. {(item.sellingPrice * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Right: Checkout */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </Select>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Discount:</span>
                <span>- Rs. {totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <Label>Amount Paid</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                step="0.01"
              />
            </div>

            {paidAmount && (
              <div className="flex justify-between text-lg font-medium">
                <span>Change:</span>
                <span className={change < 0 ? 'text-destructive' : 'text-green-600'}>
                  Rs. {change.toFixed(2)}
                </span>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={cart.length === 0 || createSaleMutation.isPending}
            >
              {createSaleMutation.isPending ? 'Processing...' : 'Complete Sale'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
