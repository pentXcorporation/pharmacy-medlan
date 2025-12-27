// Payment Modal Component
import { useState, useCallback, useMemo } from 'react';
import { POS_CONFIG } from '../../constants';
import styles from './PaymentModal.module.css';

const PaymentModal = ({
  isOpen,
  onClose,
  total,
  onPaymentComplete,
  isProcessing,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(POS_CONFIG.PAYMENT_METHODS.CASH);
  const [amountReceived, setAmountReceived] = useState('');
  const [reference, setReference] = useState('');

  const changeAmount = useMemo(() => {
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - total);
  }, [amountReceived, total]);

  const isPaymentValid = useMemo(() => {
    const received = parseFloat(amountReceived) || 0;
    if (paymentMethod === POS_CONFIG.PAYMENT_METHODS.CASH) {
      return received >= total;
    }
    return true; // Card/Mobile payments don't require exact amount
  }, [paymentMethod, amountReceived, total]);

  const handlePaymentMethodChange = useCallback((method) => {
    setPaymentMethod(method);
    setAmountReceived('');
    setReference('');
  }, []);

  const handleQuickAmount = useCallback((amount) => {
    setAmountReceived(amount.toString());
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      await onPaymentComplete({
        method: paymentMethod,
        amount: parseFloat(amountReceived) || total,
        reference: reference || null,
        change: changeAmount,
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  }, [paymentMethod, amountReceived, reference, total, changeAmount, onPaymentComplete]);

  const handleClose = useCallback(() => {
    setPaymentMethod(POS_CONFIG.PAYMENT_METHODS.CASH);
    setAmountReceived('');
    setReference('');
    onClose();
  }, [onClose]);

  // Quick amount suggestions for cash
  const quickAmounts = useMemo(() => {
    const rounded = Math.ceil(total / 100) * 100;
    return [rounded, rounded + 500, rounded + 1000, rounded + 2000].filter(
      (amount) => amount >= total
    );
  }, [total]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Process Payment</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.totalDisplay}>
          <span className={styles.totalLabel}>Total Amount</span>
          <span className={styles.totalAmount}>
            Rs. {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <div className={styles.paymentMethods}>
            {Object.entries(POS_CONFIG.PAYMENT_METHODS).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className={`${styles.methodBtn} ${paymentMethod === value ? styles.active : ''}`}
                onClick={() => handlePaymentMethodChange(value)}
              >
                <span className={styles.methodIcon}>
                  {value === 'cash' && '💵'}
                  {value === 'card' && '💳'}
                  {value === 'mobile' && '📱'}
                  {value === 'credit' && '📝'}
                </span>
                <span className={styles.methodName}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </span>
              </button>
            ))}
          </div>

          {/* Cash Payment */}
          {paymentMethod === POS_CONFIG.PAYMENT_METHODS.CASH && (
            <>
              <div className={styles.quickAmounts}>
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={styles.quickAmountBtn}
                    onClick={() => handleQuickAmount(amount)}
                  >
                    Rs. {amount.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Amount Received</label>
                <input
                  type="number"
                  className={styles.input}
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="Enter amount received"
                  min={0}
                  step="0.01"
                  autoFocus
                />
              </div>

              {changeAmount > 0 && (
                <div className={styles.changeDisplay}>
                  <span className={styles.changeLabel}>Change to Return</span>
                  <span className={styles.changeAmount}>
                    Rs. {changeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Card Payment */}
          {paymentMethod === POS_CONFIG.PAYMENT_METHODS.CARD && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Card Reference / Last 4 Digits</label>
              <input
                type="text"
                className={styles.input}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter card reference"
                maxLength={20}
              />
            </div>
          )}

          {/* Mobile Payment */}
          {paymentMethod === POS_CONFIG.PAYMENT_METHODS.MOBILE && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Transaction Reference</label>
              <input
                type="text"
                className={styles.input}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          {/* Credit Payment */}
          {paymentMethod === POS_CONFIG.PAYMENT_METHODS.CREDIT && (
            <div className={styles.creditNotice}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p>Credit payment will be recorded against the customer account.</p>
            </div>
          )}

          {/* Submit Button */}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={
                !isPaymentValid || 
                isProcessing || 
                (paymentMethod === POS_CONFIG.PAYMENT_METHODS.CASH && !amountReceived)
              }
            >
              {isProcessing ? (
                <>
                  <span className={styles.spinner}></span>
                  Processing...
                </>
              ) : (
                `Complete Payment`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
