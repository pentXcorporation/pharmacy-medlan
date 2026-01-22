/**
 * Services Barrel Export
 * Central API service layer for all features
 */
export * from "./authService";
export * from "./productService";
export * from "./categoryService";
export * from "./inventoryService";
export * from "./saleService";
export * from "./customerService";
export * from "./supplierService";
export * from "./purchaseOrderService";
export * from "./grnService";
export * from "./userService";
export * from "./branchService";
export * from "./reportService";
export * from "./dashboardService";
export * from "./systemConfigService";
export * from "./chequeService";
export * from "./barcodeService";
export * from "./inventoryTransactionService";

// Default exports
export { default as bankService } from "./bankService";
export { default as cashBookService } from "./cashBookService";
export { default as payrollService } from "./payrollService";

// Export invoiceService explicitly since it's in saleService.js
export { invoiceService } from "./saleService";
