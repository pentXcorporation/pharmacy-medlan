package com.pharmacy.medlan.service.barcode;

import com.pharmacy.medlan.dto.response.barcode.BarcodeResponse;
import com.pharmacy.medlan.dto.response.barcode.QRCodeResponse;
import com.pharmacy.medlan.enums.BarcodeFormat;

import java.util.List;
import java.util.Map;

/**
 * Service for generating and reading barcodes and QR codes.
 * Supports multiple barcode formats for pharmacy inventory management.
 */
public interface BarcodeService {

    /**
     * Generate a barcode image for a product
     * @param productCode The product code to encode
     * @param format The barcode format (EAN-13, CODE-128, etc.)
     * @param width Width of the barcode image
     * @param height Height of the barcode image
     * @return BarcodeResponse containing the base64 encoded image
     */
    BarcodeResponse generateBarcode(String productCode, BarcodeFormat format, int width, int height);

    /**
     * Generate a QR code for a product with detailed information
     * @param data The data to encode (can be JSON with product details)
     * @param size The size of the QR code (width = height)
     * @return QRCodeResponse containing the base64 encoded image
     */
    QRCodeResponse generateQRCode(String data, int size);

    /**
     * Generate QR code for product with all details embedded
     * @param productId The product ID
     * @param includeBatchInfo Include batch information in QR
     * @param size Size of the QR code
     * @return QRCodeResponse
     */
    QRCodeResponse generateProductQRCode(Long productId, boolean includeBatchInfo, int size);

    /**
     * Generate QR code for inventory batch with traceability info
     * @param batchId The batch ID
     * @param size Size of the QR code
     * @return QRCodeResponse
     */
    QRCodeResponse generateBatchQRCode(Long batchId, int size);

    /**
     * Generate shelf label with barcode for printing
     * @param productId Product ID
     * @param format Barcode format
     * @return BarcodeResponse with print-ready image
     */
    BarcodeResponse generateShelfLabel(Long productId, BarcodeFormat format);

    /**
     * Bulk generate barcodes for multiple products
     * @param productIds List of product IDs
     * @param format Barcode format
     * @return Map of product ID to BarcodeResponse
     */
    Map<Long, BarcodeResponse> generateBulkBarcodes(List<Long> productIds, BarcodeFormat format);

    /**
     * Read/decode a barcode from base64 image
     * @param base64Image The base64 encoded barcode image
     * @return Decoded barcode content
     */
    String readBarcode(String base64Image);

    /**
     * Read/decode a QR code from base64 image
     * @param base64Image The base64 encoded QR code image
     * @return Decoded QR code content
     */
    String readQRCode(String base64Image);

    /**
     * Validate barcode format
     * @param barcode The barcode string to validate
     * @param format Expected barcode format
     * @return true if valid
     */
    boolean validateBarcodeFormat(String barcode, BarcodeFormat format);

    /**
     * Generate unique barcode for new product
     * @param prefix Optional prefix for the barcode
     * @return Generated unique barcode
     */
    String generateUniqueBarcode(String prefix);

    /**
     * Generate EAN-13 compliant barcode with check digit
     * @param baseNumber 12-digit base number
     * @return Complete EAN-13 barcode with check digit
     */
    String generateEAN13(String baseNumber);

    /**
     * Generate invoice QR code for GST compliance
     * @param invoiceId Invoice ID
     * @return QRCodeResponse for invoice
     */
    QRCodeResponse generateInvoiceQRCode(Long invoiceId);

    /**
     * Generate prescription QR code
     * @param prescriptionId Prescription ID
     * @return QRCodeResponse
     */
    QRCodeResponse generatePrescriptionQRCode(Long prescriptionId);
}
