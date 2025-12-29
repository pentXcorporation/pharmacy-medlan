/**
 * POS Cart Store
 * Zustand store for managing POS cart state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePOSStore = create(
  persist(
    (set, get) => ({
      // Cart items
      items: [],

      // Selected customer
      customer: null,

      // Discount (percentage or fixed)
      discount: { type: "percentage", value: 0 },

      // Payment info
      payment: {
        method: "CASH",
        amountTendered: 0,
        cardNumber: "",
        reference: "",
      },

      // Held sales (for quick switch)
      heldSales: [],

      // Add item to cart
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) =>
            item.productId === product.id && item.batchId === product.batchId
        );

        if (existingIndex >= 0) {
          // Update quantity if already in cart
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
        } else {
          // Add new item
          set({
            items: [
              ...items,
              {
                productId: product.id,
                batchId: product.batchId,
                productName: product.name,
                sku: product.sku,
                barcode: product.barcode,
                unitPrice: product.sellingPrice || product.unitPrice,
                costPrice: product.costPrice,
                quantity,
                maxQuantity: product.stockQuantity || 999,
                discount: 0,
                taxRate: product.taxRate || 0,
              },
            ],
          });
        }
      },

      // Update item quantity
      updateItemQuantity: (index, quantity) => {
        const items = get().items;
        if (quantity <= 0) {
          set({ items: items.filter((_, i) => i !== index) });
        } else {
          const updated = [...items];
          updated[index].quantity = Math.min(
            quantity,
            updated[index].maxQuantity
          );
          set({ items: updated });
        }
      },

      // Update item discount
      updateItemDiscount: (index, discount) => {
        const items = get().items;
        const updated = [...items];
        updated[index].discount = Math.min(Math.max(0, discount), 100);
        set({ items: updated });
      },

      // Remove item from cart
      removeItem: (index) => {
        set({ items: get().items.filter((_, i) => i !== index) });
      },

      // Clear cart
      clearCart: () => {
        set({
          items: [],
          customer: null,
          discount: { type: "percentage", value: 0 },
        });
      },

      // Set customer
      setCustomer: (customer) => set({ customer }),

      // Clear customer
      clearCustomer: () => set({ customer: null }),

      // Set cart discount
      setDiscount: (discount) => set({ discount }),

      // Set payment info
      setPayment: (payment) =>
        set({ payment: { ...get().payment, ...payment } }),

      // Hold current sale
      holdSale: (name) => {
        const { items, customer, discount } = get();
        if (items.length === 0) return;

        const heldSale = {
          id: Date.now(),
          name: name || `Sale ${get().heldSales.length + 1}`,
          items,
          customer,
          discount,
          timestamp: new Date().toISOString(),
        };

        set({
          heldSales: [...get().heldSales, heldSale],
          items: [],
          customer: null,
          discount: { type: "percentage", value: 0 },
        });
      },

      // Recall held sale
      recallSale: (id) => {
        const held = get().heldSales.find((s) => s.id === id);
        if (held) {
          // If current cart has items, hold them first
          if (get().items.length > 0) {
            get().holdSale("Auto-saved");
          }

          set({
            items: held.items,
            customer: held.customer,
            discount: held.discount,
            heldSales: get().heldSales.filter((s) => s.id !== id),
          });
        }
      },

      // Remove held sale
      removeHeldSale: (id) => {
        set({ heldSales: get().heldSales.filter((s) => s.id !== id) });
      },

      // Calculate subtotal
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        );
      },

      // Calculate item discount total
      getItemDiscountTotal: () => {
        return get().items.reduce((sum, item) => {
          const itemTotal = item.unitPrice * item.quantity;
          return sum + (itemTotal * item.discount) / 100;
        }, 0);
      },

      // Calculate cart discount
      getCartDiscount: () => {
        const { discount } = get();
        const afterItemDiscount =
          get().getSubtotal() - get().getItemDiscountTotal();

        if (discount.type === "percentage") {
          return (afterItemDiscount * discount.value) / 100;
        }
        return Math.min(discount.value, afterItemDiscount);
      },

      // Calculate tax total
      getTaxTotal: () => {
        return get().items.reduce((sum, item) => {
          const itemTotal = item.unitPrice * item.quantity;
          const afterDiscount = itemTotal - (itemTotal * item.discount) / 100;
          return sum + (afterDiscount * item.taxRate) / 100;
        }, 0);
      },

      // Calculate grand total
      getGrandTotal: () => {
        return (
          get().getSubtotal() -
          get().getItemDiscountTotal() -
          get().getCartDiscount() +
          get().getTaxTotal()
        );
      },

      // Get change due
      getChangeDue: () => {
        return Math.max(
          0,
          get().payment.amountTendered - get().getGrandTotal()
        );
      },
    }),
    {
      name: "pos-cart",
      partialize: (state) => ({
        items: state.items,
        customer: state.customer,
        discount: state.discount,
        heldSales: state.heldSales,
      }),
    }
  )
);

export default usePOSStore;
