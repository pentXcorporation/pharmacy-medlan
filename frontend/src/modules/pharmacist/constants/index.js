// Pharmacist Module Constants

export const POS_CONFIG = {
  MAX_CART_ITEMS: 100,
  TAX_RATE: 0.05,
  DISCOUNT_TYPES: {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed',
  },
  PAYMENT_METHODS: {
    CASH: 'cash',
    CARD: 'card',
    MOBILE: 'mobile',
    CREDIT: 'credit',
  },
  RECEIPT_FORMATS: {
    THERMAL: 'thermal',
    A4: 'a4',
    A5: 'a5',
  },
};

export const PRESCRIPTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  DISPENSED: 'dispensed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
};

export const PRESCRIPTION_STATUS_LABELS = {
  [PRESCRIPTION_STATUS.PENDING]: 'Pending',
  [PRESCRIPTION_STATUS.PROCESSING]: 'Processing',
  [PRESCRIPTION_STATUS.READY]: 'Ready for Pickup',
  [PRESCRIPTION_STATUS.DISPENSED]: 'Dispensed',
  [PRESCRIPTION_STATUS.CANCELLED]: 'Cancelled',
  [PRESCRIPTION_STATUS.ON_HOLD]: 'On Hold',
};

export const PRESCRIPTION_STATUS_COLORS = {
  [PRESCRIPTION_STATUS.PENDING]: 'warning',
  [PRESCRIPTION_STATUS.PROCESSING]: 'info',
  [PRESCRIPTION_STATUS.READY]: 'success',
  [PRESCRIPTION_STATUS.DISPENSED]: 'default',
  [PRESCRIPTION_STATUS.CANCELLED]: 'error',
  [PRESCRIPTION_STATUS.ON_HOLD]: 'secondary',
};

export const DRUG_SCHEDULE = {
  OTC: 'otc',
  SCHEDULE_I: 'schedule_1',
  SCHEDULE_II: 'schedule_2',
  SCHEDULE_III: 'schedule_3',
  SCHEDULE_IV: 'schedule_4',
  SCHEDULE_V: 'schedule_5',
};

export const DRUG_SCHEDULE_LABELS = {
  [DRUG_SCHEDULE.OTC]: 'Over The Counter',
  [DRUG_SCHEDULE.SCHEDULE_I]: 'Schedule I',
  [DRUG_SCHEDULE.SCHEDULE_II]: 'Schedule II',
  [DRUG_SCHEDULE.SCHEDULE_III]: 'Schedule III',
  [DRUG_SCHEDULE.SCHEDULE_IV]: 'Schedule IV',
  [DRUG_SCHEDULE.SCHEDULE_V]: 'Schedule V',
};

export const INVENTORY_ALERTS = {
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  EXPIRING_SOON: 'expiring_soon',
  EXPIRED: 'expired',
};

export const INVENTORY_ALERT_LABELS = {
  [INVENTORY_ALERTS.LOW_STOCK]: 'Low Stock',
  [INVENTORY_ALERTS.OUT_OF_STOCK]: 'Out of Stock',
  [INVENTORY_ALERTS.EXPIRING_SOON]: 'Expiring Soon',
  [INVENTORY_ALERTS.EXPIRED]: 'Expired',
};

export const QUICK_ACTIONS = [
  { id: 'new_sale', label: 'New Sale', icon: 'ShoppingCart', shortcut: 'F1' },
  { id: 'search_product', label: 'Search Product', icon: 'Search', shortcut: 'F2' },
  { id: 'add_prescription', label: 'New Prescription', icon: 'FileText', shortcut: 'F3' },
  { id: 'check_stock', label: 'Check Stock', icon: 'Package', shortcut: 'F4' },
  { id: 'customer_lookup', label: 'Customer Lookup', icon: 'Users', shortcut: 'F5' },
  { id: 'void_sale', label: 'Void Sale', icon: 'XCircle', shortcut: 'F8' },
  { id: 'print_receipt', label: 'Print Receipt', icon: 'Printer', shortcut: 'F9' },
  { id: 'end_shift', label: 'End Shift', icon: 'LogOut', shortcut: 'F12' },
];

export const TABLE_COLUMNS = {
  CART: [
    { key: 'product', label: 'Product', sortable: false },
    { key: 'quantity', label: 'Qty', sortable: false },
    { key: 'price', label: 'Price', sortable: false },
    { key: 'total', label: 'Total', sortable: false },
    { key: 'actions', label: '', sortable: false },
  ],
  PRESCRIPTIONS: [
    { key: 'prescriptionNo', label: 'Rx No.', sortable: true },
    { key: 'patientName', label: 'Patient', sortable: true },
    { key: 'doctor', label: 'Doctor', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ],
  INVENTORY: [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'unit', label: 'Unit', sortable: false },
    { key: 'expiry', label: 'Expiry', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ],
};

export default {
  POS_CONFIG,
  PRESCRIPTION_STATUS,
  PRESCRIPTION_STATUS_LABELS,
  PRESCRIPTION_STATUS_COLORS,
  DRUG_SCHEDULE,
  DRUG_SCHEDULE_LABELS,
  INVENTORY_ALERTS,
  INVENTORY_ALERT_LABELS,
  QUICK_ACTIONS,
  TABLE_COLUMNS,
};
