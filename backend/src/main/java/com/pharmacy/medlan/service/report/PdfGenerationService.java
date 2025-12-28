package com.pharmacy.medlan.service.report;

import com.pharmacy.medlan.dto.response.report.ExportResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * Service for generating PDF reports and documents.
 */
public interface PdfGenerationService {

    /**
     * Generate PDF invoice with barcode
     */
    ExportResponse generateInvoicePdf(Long invoiceId);

    /**
     * Generate PDF invoice with QR code
     */
    ExportResponse generateInvoiceWithQR(Long invoiceId);

    /**
     * Generate daily sales report PDF
     */
    ExportResponse generateDailySalesReport(Long branchId, LocalDate date);

    /**
     * Generate stock report PDF
     */
    ExportResponse generateStockReport(Long branchId);

    /**
     * Generate expiry report PDF
     */
    ExportResponse generateExpiryReport(Long branchId, int daysThreshold);

    /**
     * Generate low stock report PDF
     */
    ExportResponse generateLowStockReport(Long branchId);

    /**
     * Generate product catalog PDF
     */
    ExportResponse generateProductCatalog(Long categoryId);

    /**
     * Generate barcode labels PDF for printing
     */
    ExportResponse generateBarcodeLabels(List<Long> productIds, String labelFormat);

    /**
     * Generate GRN document PDF
     */
    ExportResponse generateGRNDocument(Long grnId);

    /**
     * Generate Purchase Order PDF
     */
    ExportResponse generatePurchaseOrderPdf(Long poId);

    /**
     * Generate stock transfer document
     */
    ExportResponse generateStockTransferDocument(Long transferId);

    /**
     * Generate prescription label
     */
    ExportResponse generatePrescriptionLabel(Long saleItemId);
}
