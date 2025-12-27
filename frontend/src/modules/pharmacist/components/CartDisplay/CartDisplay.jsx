// Cart Display Component
import { useCallback } from 'react';
import styles from './CartDisplay.module.css';

const CartDisplay = ({
  items,
  subtotal,
  discount,
  tax,
  total,
  onQuantityChange,
  onRemoveItem,
  onApplyDiscount,
}) => {
  const handleQuantityChange = useCallback((productId, newQuantity) => {
    const quantity = Math.max(0, parseInt(newQuantity, 10) || 0);
    onQuantityChange(productId, quantity);
  }, [onQuantityChange]);

  return (
    <div className={styles.cartDisplay}>
      {/* Cart Header */}
      <div className={styles.cartHeader}>
        <h3 className={styles.cartTitle}>Shopping Cart</h3>
        <span className={styles.itemCount}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Cart Items */}
      <div className={styles.cartItems}>
        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>Cart is empty</p>
            <span>Search for products to add items</span>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.productId} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemPrice}>
                  Rs. {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} / {item.unit}
                </div>
              </div>
              
              <div className={styles.itemQuantity}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className={styles.qtyInput}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                  min="0"
                  max={item.maxStock}
                />
                <button
                  className={styles.qtyBtn}
                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.maxStock}
                >
                  +
                </button>
              </div>
              
              <div className={styles.itemTotal}>
                Rs. {(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              
              <button
                className={styles.removeBtn}
                onClick={() => onRemoveItem(item.productId)}
                title="Remove item"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary */}
      {items.length > 0 && (
        <div className={styles.cartSummary}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          {discount > 0 && (
            <div className={`${styles.summaryRow} ${styles.discount}`}>
              <span>Discount</span>
              <span>- Rs. {discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          
          <div className={styles.summaryRow}>
            <span>Tax (5%)</span>
            <span>Rs. {tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>Rs. {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDisplay;
