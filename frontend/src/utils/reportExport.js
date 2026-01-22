/**
 * Report Export Utilities
 * Handle exporting reports to various formats (CSV, Excel, PDF)
 */

import { format } from "date-fns";
import { formatCurrency } from "./formatters";

/**
 * Generate CSV content from data
 */
const generateCSV = (headers, rows) => {
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.map(h => `"${h}"`).join(','));
  
  // Add data rows
  rows.forEach(row => {
    const values = row.map(value => {
      // Escape quotes and wrap in quotes
      const escaped = String(value || '').replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

/**
 * Download file
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export Sales Report to CSV
 */
export const exportSalesReportCSV = (report, filters) => {
  const { summary, topProducts, dailySales } = report;
  const lines = [];
  
  // Report Header
  lines.push('SALES REPORT');
  lines.push(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
  lines.push(`Period: ${filters.startDate} to ${filters.endDate}`);
  if (filters.branchName) {
    lines.push(`Branch: ${filters.branchName}`);
  }
  lines.push('');
  
  // Summary Section
  lines.push('SUMMARY');
  lines.push(`Total Sales,${formatCurrency(summary.totalSales || 0)}`);
  lines.push(`Sales Count,${summary.salesCount || 0}`);
  lines.push(`Average Sale,${formatCurrency(summary.averageSale || 0)}`);
  lines.push(`Unique Customers,${summary.uniqueCustomers || 0}`);
  lines.push(`Items Sold,${summary.itemsSold || 0}`);
  lines.push('');
  
  // Top Products Section
  if (topProducts && topProducts.length > 0) {
    lines.push('TOP SELLING PRODUCTS');
    const headers = ['Rank', 'Product Name', 'Quantity Sold', 'Revenue'];
    lines.push(headers.join(','));
    
    topProducts.forEach((product, index) => {
      lines.push([
        index + 1,
        `"${product.productName || ''}"`,
        product.quantitySold || 0,
        product.revenue || 0
      ].join(','));
    });
    lines.push('');
  }
  
  // Daily Sales Section
  if (dailySales && dailySales.length > 0) {
    lines.push('DAILY SALES');
    const headers = ['Date', 'Transactions', 'Items Sold', 'Revenue'];
    lines.push(headers.join(','));
    
    dailySales.forEach(day => {
      lines.push([
        day.date,
        day.transactionCount || 0,
        day.itemsSold || 0,
        day.revenue || 0
      ].join(','));
    });
  }
  
  const content = lines.join('\n');
  const filename = `sales_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  downloadFile(content, filename, 'text/csv;charset=utf-8;');
};

/**
 * Export Inventory Report to CSV
 */
export const exportInventoryReportCSV = (report, filters) => {
  const { summary, stockLevels, lowStockItems, expiringItems } = report;
  const lines = [];
  
  // Report Header
  lines.push('INVENTORY REPORT');
  lines.push(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
  if (filters.branchName) {
    lines.push(`Branch: ${filters.branchName}`);
  }
  lines.push('');
  
  // Summary Section
  lines.push('SUMMARY');
  lines.push(`Total Stock Value,${formatCurrency(summary.totalStockValue || 0)}`);
  lines.push(`Total Products,${summary.totalProducts || 0}`);
  lines.push(`Low Stock Count,${summary.lowStockCount || 0}`);
  lines.push(`Out of Stock Count,${summary.outOfStockCount || 0}`);
  lines.push(`Expiring Count,${summary.expiringCount || 0}`);
  lines.push('');
  
  // Low Stock Items
  if (lowStockItems && lowStockItems.length > 0) {
    lines.push('LOW STOCK ITEMS');
    const headers = ['Product Name', 'SKU', 'Current Stock', 'Reorder Level', 'Status'];
    lines.push(headers.join(','));
    
    lowStockItems.forEach(item => {
      const status = item.currentStock === 0 ? 'Out of Stock' : 'Low Stock';
      lines.push([
        `"${item.productName || ''}"`,
        `"${item.sku || ''}"`,
        item.currentStock || 0,
        item.reorderLevel || 0,
        status
      ].join(','));
    });
    lines.push('');
  }
  
  // Expiring Items
  if (expiringItems && expiringItems.length > 0) {
    lines.push('EXPIRING SOON');
    const headers = ['Product Name', 'Batch Number', 'Quantity', 'Expiry Date', 'Days Left'];
    lines.push(headers.join(','));
    
    expiringItems.forEach(item => {
      lines.push([
        `"${item.productName || ''}"`,
        `"${item.batchNumber || ''}"`,
        item.quantity || 0,
        item.expiryDate || '',
        item.daysLeft || 0
      ].join(','));
    });
    lines.push('');
  }
  
  // Stock by Category
  if (stockLevels && stockLevels.length > 0) {
    lines.push('STOCK BY CATEGORY');
    const headers = ['Category', 'Products', 'Total Quantity', 'Stock Value'];
    lines.push(headers.join(','));
    
    stockLevels.forEach(category => {
      lines.push([
        `"${category.categoryName || ''}"`,
        category.productCount || 0,
        category.totalQuantity || 0,
        category.stockValue || 0
      ].join(','));
    });
  }
  
  const content = lines.join('\n');
  const filename = `inventory_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  downloadFile(content, filename, 'text/csv;charset=utf-8;');
};

/**
 * Export Financial Report to CSV
 */
export const exportFinancialReportCSV = (report, filters) => {
  const { summary, revenue, expenses, profitLoss } = report;
  const lines = [];
  
  // Report Header
  lines.push('FINANCIAL REPORT');
  lines.push(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
  lines.push(`Period: ${filters.startDate} to ${filters.endDate}`);
  if (filters.branchName) {
    lines.push(`Branch: ${filters.branchName}`);
  }
  lines.push('');
  
  // Summary Section
  lines.push('SUMMARY');
  lines.push(`Total Revenue,${formatCurrency(summary.totalRevenue || 0)}`);
  lines.push(`Total Expenses,${formatCurrency(summary.totalExpenses || 0)}`);
  lines.push(`Net Profit,${formatCurrency(summary.netProfit || 0)}`);
  lines.push(`Profit Margin,${summary.profitMargin || 0}%`);
  lines.push('');
  
  // Revenue Breakdown
  if (revenue && revenue.length > 0) {
    lines.push('REVENUE BREAKDOWN');
    const headers = ['Category', 'Amount', 'Percentage'];
    lines.push(headers.join(','));
    
    revenue.forEach(item => {
      lines.push([
        `"${item.category || ''}"`,
        item.amount || 0,
        `${item.percentage || 0}%`
      ].join(','));
    });
    lines.push('');
  }
  
  // Expenses Breakdown
  if (expenses && expenses.length > 0) {
    lines.push('EXPENSES BREAKDOWN');
    const headers = ['Category', 'Amount', 'Percentage'];
    lines.push(headers.join(','));
    
    expenses.forEach(item => {
      lines.push([
        `"${item.category || ''}"`,
        item.amount || 0,
        `${item.percentage || 0}%`
      ].join(','));
    });
    lines.push('');
  }
  
  // Profit/Loss by Period
  if (profitLoss && profitLoss.length > 0) {
    lines.push('PROFIT & LOSS BY PERIOD');
    const headers = ['Period', 'Revenue', 'Expenses', 'Profit', 'Margin %'];
    lines.push(headers.join(','));
    
    profitLoss.forEach(item => {
      lines.push([
        item.period || '',
        item.revenue || 0,
        item.expenses || 0,
        item.profit || 0,
        `${item.margin || 0}%`
      ].join(','));
    });
  }
  
  const content = lines.join('\n');
  const filename = `financial_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  downloadFile(content, filename, 'text/csv;charset=utf-8;');
};

/**
 * Export Employee Report to CSV
 */
export const exportEmployeeReportCSV = (report, filters) => {
  const { summary, attendance, performance, payroll } = report;
  const lines = [];
  
  // Report Header
  lines.push('EMPLOYEE REPORT');
  lines.push(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
  lines.push(`Period: ${filters.startDate} to ${filters.endDate}`);
  if (filters.branchName) {
    lines.push(`Branch: ${filters.branchName}`);
  }
  lines.push('');
  
  // Summary Section
  lines.push('SUMMARY');
  lines.push(`Total Employees,${summary.totalEmployees || 0}`);
  lines.push(`Active Employees,${summary.activeEmployees || 0}`);
  lines.push(`Average Attendance,${summary.averageAttendance || 0}%`);
  lines.push(`Total Payroll,${formatCurrency(summary.totalPayroll || 0)}`);
  lines.push('');
  
  // Attendance
  if (attendance && attendance.length > 0) {
    lines.push('ATTENDANCE SUMMARY');
    const headers = ['Employee', 'Present Days', 'Absent Days', 'Late Days', 'Attendance %'];
    lines.push(headers.join(','));
    
    attendance.forEach(item => {
      lines.push([
        `"${item.employeeName || ''}"`,
        item.presentDays || 0,
        item.absentDays || 0,
        item.lateDays || 0,
        `${item.attendanceRate || 0}%`
      ].join(','));
    });
    lines.push('');
  }
  
  // Payroll
  if (payroll && payroll.length > 0) {
    lines.push('PAYROLL SUMMARY');
    const headers = ['Employee', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary'];
    lines.push(headers.join(','));
    
    payroll.forEach(item => {
      lines.push([
        `"${item.employeeName || ''}"`,
        item.basicSalary || 0,
        item.allowances || 0,
        item.deductions || 0,
        item.netSalary || 0
      ].join(','));
    });
  }
  
  const content = lines.join('\n');
  const filename = `employee_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  downloadFile(content, filename, 'text/csv;charset=utf-8;');
};

/**
 * Export generic table data to CSV
 */
export const exportTableToCSV = (headers, data, filename) => {
  const content = generateCSV(headers, data);
  const fullFilename = `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
  downloadFile(content, fullFilename, 'text/csv;charset=utf-8;');
};

/**
 * Print report (opens print dialog)
 */
export const printReport = () => {
  window.print();
};

export default {
  exportSalesReportCSV,
  exportInventoryReportCSV,
  exportFinancialReportCSV,
  exportEmployeeReportCSV,
  exportTableToCSV,
  printReport,
};
