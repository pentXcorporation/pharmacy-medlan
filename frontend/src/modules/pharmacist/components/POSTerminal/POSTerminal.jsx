// POS Terminal Component
import { useState, useCallback, useRef, useEffect } from 'react';
import { useCart, useProductSearch, useCreateSale, useProcessPayment } from '../../hooks';
import { POS_CONFIG, QUICK_ACTIONS } from '../../constants';
import ProductSearch from '../ProductSearch';
import CartDisplay from '../CartDisplay';
import PaymentModal from '../PaymentModal';
import CustomerSelect from '../CustomerSelect';
import styles from './POSTerminal.module.css';

const POSTerminal = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const searchInputRef = useRef(null);
  
  const cart = useCart();
  const productSearch = useProductSearch();
  const createSale = useCreateSale();
  const processPayment = useProcessPayment();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F9' && !cart.isEmpty) {
        e.preventDefault();
        setIsPaymentModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsPaymentModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart.isEmpty]);

  const handleProductSelect = useCallback((product) => {
    if (product.stock > 0) {
      cart.addItem(product);
    }
  }, [cart]);

  const handleBarcodeScanned = useCallback(async (barcode) => {
    try {
      const product = await productSearch.searchByBarcode(barcode);
      if (product) {
        handleProductSelect(product);
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
    }
  }, [productSearch, handleProductSelect]);

  const handlePaymentComplete = useCallback(async (paymentData) => {
    try {
      // Create the sale
      const saleData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        customerId: cart.customer?.id,
        discount: cart.discount,
        subtotal: cart.subtotal,
        tax: cart.taxAmount,
        total: cart.total,
        paymentMethod: paymentData.method,
      };

      const sale = await createSale.mutateAsync(saleData);
      
      // Process payment
      await processPayment.mutateAsync({
        saleId: sale.id,
        amount: paymentData.amount,
        method: paymentData.method,
        reference: paymentData.reference,
      });

      // Clear cart and close modal
      cart.clearCart();
      setIsPaymentModalOpen(false);

      return sale;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }, [cart, createSale, processPayment]);

  const handleQuickAction = useCallback((actionId) => {
    switch (actionId) {
      case 'new_sale':
        cart.clearCart();
        searchInputRef.current?.focus();
        break;
      case 'search_product':
        searchInputRef.current?.focus();
        break;
      case 'void_sale':
        if (window.confirm('Are you sure you want to void this sale?')) {
          cart.clearCart();
        }
        break;
      default:
        console.log('Quick action:', actionId);
    }
  }, [cart]);

  return (
    <div className={styles.posTerminal}>
      {/* Header with Quick Actions */}
      <header className={styles.header}>
        <h1 className={styles.title}>Point of Sale</h1>
        <div className={styles.quickActions}>
          {QUICK_ACTIONS.slice(0, 4).map((action) => (
            <button
              key={action.id}
              className={styles.quickActionBtn}
              onClick={() => handleQuickAction(action.id)}
              title={`${action.label} (${action.shortcut})`}
            >
              <span className={styles.shortcut}>{action.shortcut}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Left Panel - Product Search & Selection */}
        <div className={styles.leftPanel}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'search' ? styles.active : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Search Products
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'categories' ? styles.active : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
          </div>

          <ProductSearch
            ref={searchInputRef}
            searchQuery={productSearch.searchQuery}
            onSearchChange={productSearch.setSearchQuery}
            products={productSearch.products}
            isLoading={productSearch.isLoading}
            onProductSelect={handleProductSelect}
            onBarcodeScanned={handleBarcodeScanned}
          />
        </div>

        {/* Right Panel - Cart */}
        <div className={styles.rightPanel}>
          <CustomerSelect
            selectedCustomer={cart.customer}
            onCustomerSelect={cart.setCustomer}
          />

          <CartDisplay
            items={cart.items}
            subtotal={cart.subtotal}
            discount={cart.discountAmount}
            tax={cart.taxAmount}
            total={cart.total}
            onQuantityChange={cart.updateQuantity}
            onRemoveItem={cart.removeItem}
            onApplyDiscount={cart.setDiscount}
          />

          <div className={styles.cartActions}>
            <button
              className={styles.clearBtn}
              onClick={() => cart.clearCart()}
              disabled={cart.isEmpty}
            >
              Clear Cart
            </button>
            <button
              className={styles.payBtn}
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={cart.isEmpty}
            >
              Pay (F9)
              <span className={styles.totalAmount}>
                Rs. {cart.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={cart.total}
        onPaymentComplete={handlePaymentComplete}
        isProcessing={createSale.isPending || processPayment.isPending}
      />
    </div>
  );
};

export default POSTerminal;
