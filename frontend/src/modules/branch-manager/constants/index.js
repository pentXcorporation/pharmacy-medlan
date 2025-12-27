/**
 * Branch Manager Module Constants
 */

// Staff status options
export const STAFF_STATUS = {
  ACTIVE: { value: 'active', label: 'Active', color: 'success' },
  INACTIVE: { value: 'inactive', label: 'Inactive', color: 'secondary' },
  ON_LEAVE: { value: 'on_leave', label: 'On Leave', color: 'warning' },
  TERMINATED: { value: 'terminated', label: 'Terminated', color: 'error' },
};

// Shift types
export const SHIFT_TYPES = {
  MORNING: { value: 'morning', label: 'Morning', time: '06:00 - 14:00' },
  AFTERNOON: { value: 'afternoon', label: 'Afternoon', time: '14:00 - 22:00' },
  NIGHT: { value: 'night', label: 'Night', time: '22:00 - 06:00' },
  SPLIT: { value: 'split', label: 'Split Shift', time: 'Variable' },
};

// Schedule status
export const SCHEDULE_STATUS = {
  DRAFT: { value: 'draft', label: 'Draft', color: 'secondary' },
  PUBLISHED: { value: 'published', label: 'Published', color: 'primary' },
  ACTIVE: { value: 'active', label: 'Active', color: 'success' },
  COMPLETED: { value: 'completed', label: 'Completed', color: 'info' },
};

// Stock transfer status
export const TRANSFER_STATUS = {
  PENDING: { value: 'pending', label: 'Pending', color: 'warning' },
  APPROVED: { value: 'approved', label: 'Approved', color: 'success' },
  IN_TRANSIT: { value: 'in_transit', label: 'In Transit', color: 'info' },
  DELIVERED: { value: 'delivered', label: 'Delivered', color: 'success' },
  REJECTED: { value: 'rejected', label: 'Rejected', color: 'error' },
};

// Report types
export const REPORT_TYPES = {
  DAILY_SALES: { value: 'daily_sales', label: 'Daily Sales Report' },
  WEEKLY_SALES: { value: 'weekly_sales', label: 'Weekly Sales Report' },
  MONTHLY_SALES: { value: 'monthly_sales', label: 'Monthly Sales Report' },
  INVENTORY: { value: 'inventory', label: 'Inventory Report' },
  STAFF_PERFORMANCE: { value: 'staff_performance', label: 'Staff Performance' },
  ATTENDANCE: { value: 'attendance', label: 'Attendance Report' },
  EXPIRY: { value: 'expiry', label: 'Expiry Report' },
  LOW_STOCK: { value: 'low_stock', label: 'Low Stock Report' },
};

// Dashboard metrics
export const BRANCH_METRICS = {
  TODAY_SALES: { key: 'today_sales', label: "Today's Sales", icon: 'currency' },
  TRANSACTIONS: { key: 'transactions', label: 'Transactions', icon: 'receipt' },
  STAFF_PRESENT: { key: 'staff_present', label: 'Staff Present', icon: 'users' },
  LOW_STOCK: { key: 'low_stock', label: 'Low Stock Items', icon: 'warning' },
  EXPIRING_SOON: { key: 'expiring_soon', label: 'Expiring Soon', icon: 'calendar' },
  PENDING_TRANSFERS: { key: 'pending_transfers', label: 'Pending Transfers', icon: 'truck' },
};

// Quick actions for branch manager
export const MANAGER_QUICK_ACTIONS = [
  { key: 'view_reports', label: 'View Reports', icon: 'chart', path: '/branch/reports' },
  { key: 'manage_staff', label: 'Manage Staff', icon: 'users', path: '/branch/staff' },
  { key: 'stock_transfer', label: 'Stock Transfer', icon: 'truck', path: '/branch/inventory/transfer' },
  { key: 'approve_leave', label: 'Approve Leave', icon: 'calendar', path: '/branch/staff/leave' },
  { key: 'schedule', label: 'Staff Schedule', icon: 'clock', path: '/branch/schedule' },
  { key: 'inventory', label: 'Check Inventory', icon: 'box', path: '/branch/inventory' },
];

// Table columns for staff list
export const STAFF_TABLE_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'join_date', label: 'Join Date', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

// Table columns for inventory
export const INVENTORY_TABLE_COLUMNS = [
  { key: 'product_name', label: 'Product', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'current_stock', label: 'Stock', sortable: true },
  { key: 'reorder_level', label: 'Reorder Level', sortable: true },
  { key: 'expiry_date', label: 'Expiry', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
];

// Leave approval status for manager view
export const LEAVE_APPROVAL_STATUS = {
  PENDING: { value: 'pending', label: 'Pending Review', color: 'warning' },
  APPROVED: { value: 'approved', label: 'Approved', color: 'success' },
  REJECTED: { value: 'rejected', label: 'Rejected', color: 'error' },
};
