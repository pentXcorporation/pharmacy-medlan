/**
 * Cart Store - Zustand store for POS cart state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  items: [],
  customer: null,
  paymentMethod: 'CASH',
  discount: 0,
  discountType: 'percentage', // 'percentage' | 'fixed'
  notes: '',
  holdId: null,
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Add item to cart
      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.batchId === item.batchId
        );

        if (existingIndex >= 0) {
          // Update quantity if item exists
          const updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + item.quantity,
          };
          set({ items: updatedItems });
        } else {
          // Add new item
          set({ items: [...items, { ...item, id: Date.now() }] });
        }
      },

      // Remove item from cart
      removeItem: (itemId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.id !== itemId) });
      },

      // Update item quantity
      updateItemQuantity: (itemId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          set({ items: items.filter((i) => i.id !== itemId) });
        } else {
          set({
            items: items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
          });
        }
      },

      // Update item discount
      updateItemDiscount: (itemId, discount) => {
        const { items } = get();
        set({
          items: items.map((i) =>
            i.id === itemId ? { ...i, discount } : i
          ),
        });
      },

      // Set customer
      setCustomer: (customer) => {
        set({ customer });
      },

      // Set payment method
      setPaymentMethod: (paymentMethod) => {
        set({ paymentMethod });
      },

      // Set overall discount
      setDiscount: (discount, discountType = 'percentage') => {
        set({ discount, discountType });
      },

      // Set notes
      setNotes: (notes) => {
        set({ notes });
      },

      // Calculate subtotal (before discount)
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const itemTotal = item.unitPrice * item.quantity;
          const itemDiscount = item.discount || 0;
          return total + (itemTotal - itemDiscount);
        }, 0);
      },

      // Calculate total discount amount
      getDiscountAmount: () => {
        const { discount, discountType } = get();
        const subtotal = get().getSubtotal();
        
        if (discountType === 'percentage') {
          return (subtotal * discount) / 100;
        }
        return discount;
      },

      // Calculate total
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = get().getDiscountAmount();
        return Math.max(0, subtotal - discountAmount);
      },

      // Get item count
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      // Clear cart
      clearCart: () => {
        set(initialState);
      },

      // Hold current sale
      holdSale: (holdId) => {
        const state = get();
        const heldSales = JSON.parse(localStorage.getItem('heldSales') || '[]');
        heldSales.push({
          id: holdId || Date.now(),
          ...state,
          heldAt: new Date().toISOString(),
        });
        localStorage.setItem('heldSales', JSON.stringify(heldSales));
        set(initialState);
      },

      // Get held sales
      getHeldSales: () => {
        return JSON.parse(localStorage.getItem('heldSales') || '[]');
      },

      // Recall held sale
      recallSale: (holdId) => {
        const heldSales = get().getHeldSales();
        const sale = heldSales.find((s) => s.id === holdId);
        if (sale) {
          const { id, heldAt, ...saleData } = sale;
          set({ ...saleData, holdId: id });
          // Remove from held sales
          const updatedHeldSales = heldSales.filter((s) => s.id !== holdId);
          localStorage.setItem('heldSales', JSON.stringify(updatedHeldSales));
        }
      },

      // Delete held sale
      deleteHeldSale: (holdId) => {
        const heldSales = get().getHeldSales();
        const updatedHeldSales = heldSales.filter((s) => s.id !== holdId);
        localStorage.setItem('heldSales', JSON.stringify(updatedHeldSales));
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        customer: state.customer,
        paymentMethod: state.paymentMethod,
        discount: state.discount,
        discountType: state.discountType,
        notes: state.notes,
      }),
    }
  )
);
