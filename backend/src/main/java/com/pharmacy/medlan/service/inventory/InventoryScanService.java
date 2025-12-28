package com.pharmacy.medlan.service.inventory;

import com.pharmacy.medlan.dto.request.inventory.BarcodeScanRequest;
import com.pharmacy.medlan.dto.response.inventory.ScanResultResponse;
import com.pharmacy.medlan.enums.ScanContext;

import java.util.List;

/**
 * Service for handling barcode/QR code scanning operations in inventory management.
 * Provides context-aware scanning for different use cases like POS, receiving, stock-taking, etc.
 */
public interface InventoryScanService {

    /**
     * Process a barcode scan and return product/batch information
     * @param request The scan request containing barcode and context
     * @return Detailed scan result with product info
     */
    ScanResultResponse processScan(BarcodeScanRequest request);

    /**
     * Quick lookup by barcode for POS operations
     * @param barcode The scanned barcode
     * @param branchId The branch where scan is performed
     * @return Product details optimized for POS
     */
    ScanResultResponse quickLookupForPOS(String barcode, Long branchId);

    /**
     * Batch lookup for receiving goods (GRN)
     * @param barcode The scanned barcode
     * @param branchId The branch
     * @return Product with purchase history and supplier info
     */
    ScanResultResponse lookupForReceiving(String barcode, Long branchId);

    /**
     * Scan for stock-taking/audit
     * @param barcode The scanned barcode
     * @param branchId The branch
     * @return Product with all batch details for verification
     */
    ScanResultResponse lookupForStockTaking(String barcode, Long branchId);

    /**
     * Verify product authenticity via QR code
     * @param qrData The decoded QR code data
     * @return Verification result
     */
    ScanResultResponse verifyProduct(String qrData);

    /**
     * Process batch-level QR code scan
     * @param qrData Decoded QR data containing batch info
     * @param branchId Branch ID
     * @return Batch-specific information
     */
    ScanResultResponse processBatchQRScan(String qrData, Long branchId);

    /**
     * Bulk scan processing for inventory operations
     * @param barcodes List of barcodes to process
     * @param branchId Branch ID
     * @param context The scanning context
     * @return List of scan results
     */
    List<ScanResultResponse> processBulkScans(List<String> barcodes, Long branchId, ScanContext context);

    /**
     * Get scan history for audit trail
     * @param branchId Branch ID
     * @param userId User who performed scans
     * @param limit Number of records to retrieve
     * @return Recent scan history
     */
    List<ScanResultResponse> getScanHistory(Long branchId, Long userId, int limit);
}
