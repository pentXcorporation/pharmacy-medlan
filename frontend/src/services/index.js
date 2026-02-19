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
export { default as cashRegisterService } from "./cashRegisterService";
export { default as payrollService } from "./payrollService";
export { default as notificationService } from "./notificationService";
export { default as subCategoryService } from "./subCategoryService";
export { default as unitService } from "./unitService";
export { default as supplierPaymentService } from "./supplierPaymentService";
export { default as transactionTypeService } from "./transactionTypeService";
export { default as binCardService } from "./binCardService";
export { default as scanService } from "./scanService";
export { default as prescriptionService } from "./prescriptionService";
export { default as customerPrescriptionService } from "./customerPrescriptionService";
export { default as employeeAuthService } from "./employeeAuthService";
export { default as employeeService } from "./employeeService";
export { default as branchStaffService } from "./branchStaffService";
export { default as syncService } from "./syncService";
export { default as inventoryMaintenanceService } from "./inventoryMaintenanceService";
export { default as attendanceService } from "./attendanceService";
export { default as superAdminDashboardService } from "./superAdminDashboardService";

// Export invoiceService explicitly since it's in saleService.js
export { invoiceService } from "./saleService";
