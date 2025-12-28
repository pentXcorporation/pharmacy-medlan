package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.barcode.BarcodeGenerateRequest;
import com.pharmacy.medlan.dto.request.barcode.BulkBarcodeRequest;
import com.pharmacy.medlan.dto.request.barcode.DecodeRequest;
import com.pharmacy.medlan.dto.response.barcode.BarcodeResponse;
import com.pharmacy.medlan.dto.response.barcode.QRCodeResponse;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.enums.BarcodeFormat;
import com.pharmacy.medlan.service.barcode.BarcodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/barcodes")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Barcode & QR Code Management", description = "APIs for generating and reading barcodes and QR codes")
public class BarcodeController {

    private final BarcodeService barcodeService;

    // ==================== Barcode Generation ====================

    @PostMapping("/generate")
    @Operation(summary = "Generate barcode", description = "Generate a barcode for given content")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<BarcodeResponse>> generateBarcode(
            @Valid @RequestBody BarcodeGenerateRequest request) {
        log.info("Generating barcode for content: {}", request.getContent());
        BarcodeResponse response = barcodeService.generateBarcode(
                request.getContent(),
                request.getFormat() != null ? request.getFormat() : BarcodeFormat.CODE_128,
                request.getWidth(),
                request.getHeight()
        );
        return ResponseEntity.ok(ApiResponse.success("Barcode generated successfully", response));
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Generate product barcode", description = "Generate a barcode for a product")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'CASHIER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<BarcodeResponse>> generateProductBarcode(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "CODE_128") BarcodeFormat format) {
        log.info("Generating barcode for product ID: {}", productId);
        BarcodeResponse response = barcodeService.generateShelfLabel(productId, format);
        return ResponseEntity.ok(ApiResponse.success("Product barcode generated", response));
    }

    @PostMapping("/bulk")
    @Operation(summary = "Generate bulk barcodes", description = "Generate barcodes for multiple products")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<Map<Long, BarcodeResponse>>> generateBulkBarcodes(
            @Valid @RequestBody BulkBarcodeRequest request) {
        log.info("Generating bulk barcodes for {} products", request.getProductIds().size());
        Map<Long, BarcodeResponse> responses = barcodeService.generateBulkBarcodes(
                request.getProductIds(),
                request.getFormat() != null ? request.getFormat() : BarcodeFormat.CODE_128
        );
        return ResponseEntity.ok(ApiResponse.success("Bulk barcodes generated", responses));
    }

    @GetMapping("/shelf-label/{productId}")
    @Operation(summary = "Generate shelf label", description = "Generate a shelf label with barcode for a product")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<BarcodeResponse>> generateShelfLabel(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "EAN_13") BarcodeFormat format) {
        log.info("Generating shelf label for product ID: {}", productId);
        BarcodeResponse response = barcodeService.generateShelfLabel(productId, format);
        return ResponseEntity.ok(ApiResponse.success("Shelf label generated", response));
    }

    // ==================== QR Code Generation ====================

    @PostMapping("/qr/generate")
    @Operation(summary = "Generate QR code", description = "Generate a QR code for given data")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<QRCodeResponse>> generateQRCode(
            @RequestParam String data,
            @RequestParam(defaultValue = "250") int size) {
        log.info("Generating QR code for data length: {}", data.length());
        QRCodeResponse response = barcodeService.generateQRCode(data, size);
        return ResponseEntity.ok(ApiResponse.success("QR code generated", response));
    }

    @GetMapping("/qr/product/{productId}")
    @Operation(summary = "Generate product QR code", description = "Generate a QR code with product details")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'CASHIER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<QRCodeResponse>> generateProductQRCode(
            @PathVariable Long productId,
            @Parameter(description = "Include batch information in QR") @RequestParam(defaultValue = "false") boolean includeBatchInfo,
            @RequestParam(defaultValue = "250") int size) {
        log.info("Generating product QR code for product ID: {}", productId);
        QRCodeResponse response = barcodeService.generateProductQRCode(productId, includeBatchInfo, size);
        return ResponseEntity.ok(ApiResponse.success("Product QR code generated", response));
    }

    @GetMapping("/qr/batch/{batchId}")
    @Operation(summary = "Generate batch QR code", description = "Generate a QR code with batch traceability info")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<QRCodeResponse>> generateBatchQRCode(
            @PathVariable Long batchId,
            @RequestParam(defaultValue = "250") int size) {
        log.info("Generating batch QR code for batch ID: {}", batchId);
        QRCodeResponse response = barcodeService.generateBatchQRCode(batchId, size);
        return ResponseEntity.ok(ApiResponse.success("Batch QR code generated", response));
    }

    @GetMapping("/qr/invoice/{invoiceId}")
    @Operation(summary = "Generate invoice QR code", description = "Generate a QR code for invoice (GST compliance)")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'CASHIER', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<QRCodeResponse>> generateInvoiceQRCode(@PathVariable Long invoiceId) {
        log.info("Generating invoice QR code for invoice ID: {}", invoiceId);
        QRCodeResponse response = barcodeService.generateInvoiceQRCode(invoiceId);
        return ResponseEntity.ok(ApiResponse.success("Invoice QR code generated", response));
    }

    @GetMapping("/qr/prescription/{prescriptionId}")
    @Operation(summary = "Generate prescription QR code", description = "Generate a QR code for prescription")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<QRCodeResponse>> generatePrescriptionQRCode(@PathVariable Long prescriptionId) {
        log.info("Generating prescription QR code for prescription ID: {}", prescriptionId);
        QRCodeResponse response = barcodeService.generatePrescriptionQRCode(prescriptionId);
        return ResponseEntity.ok(ApiResponse.success("Prescription QR code generated", response));
    }

    // ==================== Barcode/QR Code Reading ====================

    @PostMapping("/decode/barcode")
    @Operation(summary = "Decode barcode", description = "Read and decode a barcode from image")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'CASHIER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<String>> decodeBarcode(@Valid @RequestBody DecodeRequest request) {
        log.info("Decoding barcode from image");
        String content = barcodeService.readBarcode(request.getBase64Image());
        return ResponseEntity.ok(ApiResponse.success("Barcode decoded successfully", content));
    }

    @PostMapping("/decode/qr")
    @Operation(summary = "Decode QR code", description = "Read and decode a QR code from image")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'PHARMACIST', 'CASHIER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<String>> decodeQRCode(@Valid @RequestBody DecodeRequest request) {
        log.info("Decoding QR code from image");
        String content = barcodeService.readQRCode(request.getBase64Image());
        return ResponseEntity.ok(ApiResponse.success("QR code decoded successfully", content));
    }

    // ==================== Utility Endpoints ====================

    @GetMapping("/validate")
    @Operation(summary = "Validate barcode format", description = "Validate if a barcode matches expected format")
    public ResponseEntity<ApiResponse<Boolean>> validateBarcode(
            @RequestParam String barcode,
            @RequestParam BarcodeFormat format) {
        log.info("Validating barcode: {} for format: {}", barcode, format);
        boolean isValid = barcodeService.validateBarcodeFormat(barcode, format);
        return ResponseEntity.ok(ApiResponse.success(isValid ? "Barcode is valid" : "Barcode is invalid", isValid));
    }

    @GetMapping("/generate-unique")
    @Operation(summary = "Generate unique barcode", description = "Generate a unique barcode for new products")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<String>> generateUniqueBarcode(
            @RequestParam(required = false, defaultValue = "MED") String prefix) {
        log.info("Generating unique barcode with prefix: {}", prefix);
        String barcode = barcodeService.generateUniqueBarcode(prefix);
        return ResponseEntity.ok(ApiResponse.success("Unique barcode generated", barcode));
    }

    @GetMapping("/generate-ean13")
    @Operation(summary = "Generate EAN-13 barcode", description = "Generate EAN-13 barcode with check digit")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<String>> generateEAN13(
            @Parameter(description = "12-digit base number") @RequestParam String baseNumber) {
        log.info("Generating EAN-13 barcode for base: {}", baseNumber);
        String ean13 = barcodeService.generateEAN13(baseNumber);
        return ResponseEntity.ok(ApiResponse.success("EAN-13 barcode generated", ean13));
    }

    @GetMapping("/formats")
    @Operation(summary = "Get supported formats", description = "Get list of all supported barcode formats")
    public ResponseEntity<ApiResponse<BarcodeFormat[]>> getSupportedFormats() {
        return ResponseEntity.ok(ApiResponse.success("Supported barcode formats", BarcodeFormat.values()));
    }
}
