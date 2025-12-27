// POS Hooks
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posService } from '../services';
import { POS_CONFIG } from '../constants';

// Query Keys
export const POS_QUERY_KEYS = {
  products: 'pos-products',
  todaySales: 'pos-today-sales',
  currentShift: 'pos-current-shift',
  paymentMethods: 'pos-payment-methods',
  promotions: 'pos-promotions',
};

// Cart Hook
export const useCart = () => {
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [discount, setDiscount] = useState({ type: null, value: 0, code: null });

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        unit: product.unit,
        maxStock: product.stock,
      }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCustomer(null);
    setDiscount({ type: null, value: 0, code: null });
  }, []);

  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (!discount.type) return 0;
    if (discount.type === POS_CONFIG.DISCOUNT_TYPES.PERCENTAGE) {
      return subtotal * (discount.value / 100);
    }
    return discount.value;
  }, [subtotal, discount]);

  const taxAmount = useMemo(() => 
    (subtotal - discountAmount) * POS_CONFIG.TAX_RATE,
    [subtotal, discountAmount]
  );

  const total = useMemo(() => 
    subtotal - discountAmount + taxAmount,
    [subtotal, discountAmount, taxAmount]
  );

  const itemCount = useMemo(() => 
    items.reduce((count, item) => count + item.quantity, 0),
    [items]
  );

  return {
    items,
    customer,
    discount,
    subtotal,
    discountAmount,
    taxAmount,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    setCustomer,
    setDiscount,
    clearCart,
    isEmpty: items.length === 0,
  };
};

// Product Search Hook
export const useProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: [POS_QUERY_KEYS.products, searchQuery],
    queryFn: () => posService.searchProducts(searchQuery),
    enabled: searchQuery.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });

  const searchByBarcode = useMutation({
    mutationFn: posService.getProductByBarcode,
  });

  return {
    searchQuery,
    setSearchQuery,
    products: data?.data || [],
    isLoading,
    error,
    searchByBarcode: searchByBarcode.mutateAsync,
    isSearchingBarcode: searchByBarcode.isPending,
  };
};

// Sale Creation Hook
export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: posService.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POS_QUERY_KEYS.todaySales] });
    },
  });
};

// Today's Sales Hook
export const useTodaySales = () => {
  return useQuery({
    queryKey: [POS_QUERY_KEYS.todaySales],
    queryFn: posService.getTodaySales,
    refetchInterval: 60 * 1000, // Refresh every minute
  });
};

// Current Shift Hook
export const useCurrentShift = () => {
  return useQuery({
    queryKey: [POS_QUERY_KEYS.currentShift],
    queryFn: posService.getCurrentShift,
  });
};

// Shift Management Hook
export const useShiftManagement = () => {
  const queryClient = useQueryClient();

  const startShift = useMutation({
    mutationFn: posService.startShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POS_QUERY_KEYS.currentShift] });
    },
  });

  const endShift = useMutation({
    mutationFn: ({ shiftId, closingData }) => posService.endShift(shiftId, closingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POS_QUERY_KEYS.currentShift] });
    },
  });

  return {
    startShift: startShift.mutateAsync,
    endShift: endShift.mutateAsync,
    isStarting: startShift.isPending,
    isEnding: endShift.isPending,
  };
};

// Payment Methods Hook
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: [POS_QUERY_KEYS.paymentMethods],
    queryFn: posService.getPaymentMethods,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Process Payment Hook
export const useProcessPayment = () => {
  return useMutation({
    mutationFn: posService.processPayment,
  });
};

// Receipt Generation Hook
export const useReceipt = () => {
  const generateReceipt = useMutation({
    mutationFn: ({ saleId, format }) => posService.generateReceipt(saleId, format),
  });

  const emailReceipt = useMutation({
    mutationFn: ({ saleId, email }) => posService.emailReceipt(saleId, email),
  });

  return {
    generateReceipt: generateReceipt.mutateAsync,
    emailReceipt: emailReceipt.mutateAsync,
    isGenerating: generateReceipt.isPending,
    isEmailing: emailReceipt.isPending,
  };
};

// Customer Search Hook
export const useCustomerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['pos-customers', searchQuery],
    queryFn: () => posService.searchCustomers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const createQuickCustomer = useMutation({
    mutationFn: posService.createQuickCustomer,
  });

  return {
    searchQuery,
    setSearchQuery,
    customers: data?.data || [],
    isLoading,
    error,
    createQuickCustomer: createQuickCustomer.mutateAsync,
    isCreating: createQuickCustomer.isPending,
  };
};

// Void Sale Hook
export const useVoidSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ saleId, reason }) => posService.voidSale(saleId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POS_QUERY_KEYS.todaySales] });
    },
  });
};

// Discount Validation Hook
export const useValidateDiscount = () => {
  return useMutation({
    mutationFn: posService.validateDiscount,
  });
};

// Active Promotions Hook
export const useActivePromotions = () => {
  return useQuery({
    queryKey: [POS_QUERY_KEYS.promotions],
    queryFn: posService.getActivePromotions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
