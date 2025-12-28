package com.pharmacy.medlan.service.barcode;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.pharmacy.medlan.dto.response.barcode.BarcodeResponse;
import com.pharmacy.medlan.dto.response.barcode.QRCodeResponse;
import com.pharmacy.medlan.enums.BarcodeFormat;
import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.pos.Invoice;
import com.pharmacy.medlan.model.product.InventoryBatch;
import com.pharmacy.medlan.model.product.Product;
import com.pharmacy.medlan.repository.product.InventoryBatchRepository;
import com.pharmacy.medlan.repository.pos.InvoiceRepository;
import com.pharmacy.medlan.repository.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@Slf4j
public class BarcodeServiceImpl implements BarcodeService {

    private final ProductRepository productRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final InvoiceRepository invoiceRepository;
    private final ObjectMapper objectMapper;

    private static final String MIME_TYPE_PNG = "image/png";
    private static final int DEFAULT_BARCODE_WIDTH = 300;
    private static final int DEFAULT_BARCODE_HEIGHT = 100;
    private static final int DEFAULT_QR_SIZE = 250;

    // Thread-safe counter for unique barcode generation
    private final AtomicLong barcodeCounter = new AtomicLong(System.currentTimeMillis() % 1000000000L);

    @Override
    public BarcodeResponse generateBarcode(String content, BarcodeFormat format, int width, int height) {
        log.debug("Generating barcode for content: {} with format: {}", content, format);

        try {
            // Validate content for fixed-length formats
            validateContentForFormat(content, format);

            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                    content,
                    format.toZxingFormat(),
                    width > 0 ? width : DEFAULT_BARCODE_WIDTH,
                    height > 0 ? height : DEFAULT_BARCODE_HEIGHT,
                    getEncodingHints()
            );

            String base64Image = matrixToBase64(bitMatrix);

            return BarcodeResponse.builder()
                    .content(content)
                    .imageBase64(base64Image)
                    .mimeType(MIME_TYPE_PNG)
                    .format(format)
                    .width(bitMatrix.getWidth())
                    .height(bitMatrix.getHeight())
                    .generatedAt(LocalDateTime.now())
                    .build();

        } catch (WriterException e) {
            log.error("Error generating barcode: {}", e.getMessage());
            throw new BusinessRuleViolationException("Failed to generate barcode: " + e.getMessage());
        }
    }

    @Override
    public QRCodeResponse generateQRCode(String data, int size) {
        log.debug("Generating QR code for data length: {}", data.length());

        try {
            int qrSize = size > 0 ? size : DEFAULT_QR_SIZE;

            Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 2);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(data, com.google.zxing.BarcodeFormat.QR_CODE, qrSize, qrSize, hints);

            String base64Image = matrixToBase64(bitMatrix);

            return QRCodeResponse.builder()
                    .content(data)
                    .imageBase64(base64Image)
                    .mimeType(MIME_TYPE_PNG)
                    .size(qrSize)
                    .errorCorrectionLevel("H")
                    .generatedAt(LocalDateTime.now())
                    .build();

        } catch (WriterException e) {
            log.error("Error generating QR code: {}", e.getMessage());
            throw new BusinessRuleViolationException("Failed to generate QR code: " + e.getMessage());
        }
    }

    @Override
    @Cacheable(value = "productQRCodes", key = "#productId + '_' + #includeBatchInfo + '_' + #size")
    public QRCodeResponse generateProductQRCode(Long productId, boolean includeBatchInfo, int size) {
        log.info("Generating product QR code for product ID: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        Map<String, Object> qrData = new LinkedHashMap<>();
        qrData.put("type", "PRODUCT");
        qrData.put("id", product.getId());
        qrData.put("code", product.getProductCode());
        qrData.put("name", product.getProductName());
        qrData.put("genericName", product.getGenericName());
        qrData.put("barcode", product.getBarcode());
        qrData.put("manufacturer", product.getManufacturer());
        qrData.put("mrp", product.getMrp());
        qrData.put("sellingPrice", product.getSellingPrice());

        if (product.getDrugSchedule() != null) {
            qrData.put("drugSchedule", product.getDrugSchedule().name());
        }
        if (product.getDosageForm() != null) {
            qrData.put("dosageForm", product.getDosageForm().name());
        }
        qrData.put("strength", product.getStrength());
        qrData.put("prescriptionRequired", product.getIsPrescriptionRequired());
        qrData.put("isNarcotic", product.getIsNarcotic());

        if (includeBatchInfo) {
            List<Map<String, Object>> batches = new ArrayList<>();
            product.getInventoryBatches().stream()
                    .filter(b -> b.getIsActive() && !b.getIsExpired() && b.getQuantityAvailable() > 0)
                    .limit(5) // Limit to keep QR size manageable
                    .forEach(batch -> {
                        Map<String, Object> batchData = new HashMap<>();
                        batchData.put("batchNo", batch.getBatchNumber());
                        batchData.put("expiry", batch.getExpiryDate().toString());
                        batchData.put("available", batch.getQuantityAvailable());
                        batches.add(batchData);
                    });
            qrData.put("batches", batches);
        }

        qrData.put("generatedAt", LocalDateTime.now().toString());

        try {
            String jsonData = objectMapper.writeValueAsString(qrData);
            QRCodeResponse response = generateQRCode(jsonData, size);
            response.setQrType("PRODUCT");
            response.setEntityId(productId);
            response.setEntityReference(product.getProductCode());
            response.setMetadata(qrData);
            return response;
        } catch (JsonProcessingException e) {
            throw new BusinessRuleViolationException("Failed to serialize product data for QR code");
        }
    }

    @Override
    @Cacheable(value = "batchQRCodes", key = "#batchId + '_' + #size")
    public QRCodeResponse generateBatchQRCode(Long batchId, int size) {
        log.info("Generating batch QR code for batch ID: {}", batchId);

        InventoryBatch batch = inventoryBatchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with ID: " + batchId));

        Map<String, Object> qrData = new LinkedHashMap<>();
        qrData.put("type", "BATCH");
        qrData.put("batchId", batch.getId());
        qrData.put("batchNumber", batch.getBatchNumber());
        qrData.put("productId", batch.getProduct().getId());
        qrData.put("productCode", batch.getProduct().getProductCode());
        qrData.put("productName", batch.getProduct().getProductName());
        qrData.put("branchId", batch.getBranch().getId());
        qrData.put("branchName", batch.getBranch().getBranchName());
        qrData.put("manufacturingDate", batch.getManufacturingDate().toString());
        qrData.put("expiryDate", batch.getExpiryDate().toString());
        qrData.put("quantityReceived", batch.getQuantityReceived());
        qrData.put("quantityAvailable", batch.getQuantityAvailable());
        qrData.put("quantitySold", batch.getQuantitySold());
        qrData.put("purchasePrice", batch.getPurchasePrice());
        qrData.put("mrp", batch.getMrp());
        qrData.put("sellingPrice", batch.getSellingPrice());
        qrData.put("rackLocation", batch.getRackLocation());
        qrData.put("isExpired", batch.getIsExpired());
        qrData.put("daysToExpiry", calculateDaysToExpiry(batch.getExpiryDate()));
        qrData.put("generatedAt", LocalDateTime.now().toString());

        try {
            String jsonData = objectMapper.writeValueAsString(qrData);
            QRCodeResponse response = generateQRCode(jsonData, size);
            response.setQrType("BATCH");
            response.setEntityId(batchId);
            response.setEntityReference(batch.getBatchNumber());
            response.setMetadata(qrData);
            return response;
        } catch (JsonProcessingException e) {
            throw new BusinessRuleViolationException("Failed to serialize batch data for QR code");
        }
    }

    @Override
    public BarcodeResponse generateShelfLabel(Long productId, BarcodeFormat format) {
        log.info("Generating shelf label for product ID: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        String barcodeContent = product.getBarcode() != null ? product.getBarcode() : product.getProductCode();

        BarcodeResponse response = generateBarcode(barcodeContent, format, 200, 80);
        response.setProductId(product.getId());
        response.setProductName(product.getProductName());
        response.setProductCode(product.getProductCode());

        if (product.getSellingPrice() != null) {
            response.setPrice("₹" + product.getSellingPrice().setScale(2).toPlainString());
        }
        if (product.getMrp() != null) {
            response.setMrp("MRP: ₹" + product.getMrp().setScale(2).toPlainString());
        }

        return response;
    }

    @Override
    public Map<Long, BarcodeResponse> generateBulkBarcodes(List<Long> productIds, BarcodeFormat format) {
        log.info("Generating bulk barcodes for {} products", productIds.size());

        Map<Long, BarcodeResponse> results = new ConcurrentHashMap<>();

        productIds.parallelStream().forEach(productId -> {
            try {
                BarcodeResponse response = generateShelfLabel(productId, format);
                results.put(productId, response);
            } catch (Exception e) {
                log.error("Failed to generate barcode for product {}: {}", productId, e.getMessage());
            }
        });

        return results;
    }

    @Override
    public String readBarcode(String base64Image) {
        log.debug("Reading barcode from image");

        try {
            BufferedImage image = decodeBase64ToImage(base64Image);
            LuminanceSource source = new BufferedImageLuminanceSource(image);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

            Result result = new MultiFormatReader().decode(bitmap);
            return result.getText();

        } catch (NotFoundException e) {
            log.error("No barcode found in image");
            throw new BusinessRuleViolationException("No barcode found in the provided image");
        }
    }

    @Override
    public String readQRCode(String base64Image) {
        log.debug("Reading QR code from image");

        try {
            BufferedImage image = decodeBase64ToImage(base64Image);
            LuminanceSource source = new BufferedImageLuminanceSource(image);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

            Map<DecodeHintType, Object> hints = new EnumMap<>(DecodeHintType.class);
            hints.put(DecodeHintType.POSSIBLE_FORMATS, Collections.singletonList(com.google.zxing.BarcodeFormat.QR_CODE));

            Result result = new MultiFormatReader().decode(bitmap, hints);
            return result.getText();

        } catch (NotFoundException e) {
            log.error("No QR code found in image");
            throw new BusinessRuleViolationException("No QR code found in the provided image");
        }
    }

    @Override
    public boolean validateBarcodeFormat(String barcode, BarcodeFormat format) {
        if (barcode == null || barcode.isEmpty()) {
            return false;
        }

        return switch (format) {
            case EAN_13 -> validateEAN13(barcode);
            case EAN_8 -> validateEAN8(barcode);
            case UPC_A -> validateUPCA(barcode);
            case CODE_128, CODE_39 -> barcode.length() > 0 && barcode.length() <= 80;
            case ITF_14 -> barcode.length() == 14 && barcode.matches("\\d+");
            default -> true;
        };
    }

    @Override
    public String generateUniqueBarcode(String prefix) {
        String basePrefix = (prefix != null && !prefix.isEmpty()) ? prefix : "MED";
        long counter = barcodeCounter.incrementAndGet();
        String timestamp = String.valueOf(System.currentTimeMillis() % 100000000L);

        // Format: PREFIX + Counter (padded to 6 digits)
        String base = basePrefix + String.format("%06d", counter % 1000000);

        // If needed, make it EAN-13 compatible
        if (base.length() < 12) {
            base = String.format("%-12s", base).replace(' ', '0');
        }

        return base.substring(0, 12);
    }

    @Override
    public String generateEAN13(String baseNumber) {
        if (baseNumber == null || baseNumber.length() != 12) {
            throw new BusinessRuleViolationException("EAN-13 base number must be exactly 12 digits");
        }

        if (!baseNumber.matches("\\d+")) {
            throw new BusinessRuleViolationException("EAN-13 base number must contain only digits");
        }

        int sum = 0;
        for (int i = 0; i < 12; i++) {
            int digit = Character.getNumericValue(baseNumber.charAt(i));
            sum += (i % 2 == 0) ? digit : digit * 3;
        }

        int checkDigit = (10 - (sum % 10)) % 10;
        return baseNumber + checkDigit;
    }

    @Override
    @Cacheable(value = "invoiceQRCodes", key = "#invoiceId")
    public QRCodeResponse generateInvoiceQRCode(Long invoiceId) {
        log.info("Generating invoice QR code for invoice ID: {}", invoiceId);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        // GST Invoice QR Code format (simplified for Indian GST compliance)
        Map<String, Object> qrData = new LinkedHashMap<>();
        qrData.put("type", "INVOICE");
        qrData.put("invoiceNo", invoice.getInvoiceNumber());
        qrData.put("invoiceDate", invoice.getInvoiceDate().toString());
        qrData.put("customerId", invoice.getCustomer() != null ? invoice.getCustomer().getId() : null);
        qrData.put("customerName", invoice.getCustomer() != null ? invoice.getCustomer().getCustomerName() : "Walk-in");
        qrData.put("branchId", invoice.getBranch().getId());
        qrData.put("branchName", invoice.getBranch().getBranchName());
        qrData.put("subtotal", invoice.getSubtotal());
        qrData.put("discount", invoice.getDiscount());
        qrData.put("totalAmount", invoice.getTotalAmount());
        qrData.put("paidAmount", invoice.getPaidAmount());
        qrData.put("balanceAmount", invoice.getBalanceAmount());
        qrData.put("status", invoice.getStatus().name());
        qrData.put("generatedAt", LocalDateTime.now().toString());

        try {
            String jsonData = objectMapper.writeValueAsString(qrData);
            QRCodeResponse response = generateQRCode(jsonData, DEFAULT_QR_SIZE);
            response.setQrType("INVOICE");
            response.setEntityId(invoiceId);
            response.setEntityReference(invoice.getInvoiceNumber());
            response.setMetadata(qrData);
            return response;
        } catch (JsonProcessingException e) {
            throw new BusinessRuleViolationException("Failed to serialize invoice data for QR code");
        }
    }

    @Override
    public QRCodeResponse generatePrescriptionQRCode(Long prescriptionId) {
        // Prescription QR code implementation
        Map<String, Object> qrData = new LinkedHashMap<>();
        qrData.put("type", "PRESCRIPTION");
        qrData.put("prescriptionId", prescriptionId);
        qrData.put("generatedAt", LocalDateTime.now().toString());

        try {
            String jsonData = objectMapper.writeValueAsString(qrData);
            QRCodeResponse response = generateQRCode(jsonData, DEFAULT_QR_SIZE);
            response.setQrType("PRESCRIPTION");
            response.setEntityId(prescriptionId);
            return response;
        } catch (JsonProcessingException e) {
            throw new BusinessRuleViolationException("Failed to serialize prescription data for QR code");
        }
    }

    // ==================== Private Helper Methods ====================

    private String matrixToBase64(BitMatrix bitMatrix) {
        try {
            BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", outputStream);
            return Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (IOException e) {
            throw new BusinessRuleViolationException("Failed to convert barcode to image");
        }
    }

    private BufferedImage decodeBase64ToImage(String base64Image) {
        try {
            // Remove data URL prefix if present
            String base64Data = base64Image;
            if (base64Image.contains(",")) {
                base64Data = base64Image.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Data);
            return ImageIO.read(new ByteArrayInputStream(imageBytes));
        } catch (IOException e) {
            throw new BusinessRuleViolationException("Failed to decode base64 image");
        }
    }

    private Map<EncodeHintType, Object> getEncodingHints() {
        Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1);
        return hints;
    }

    private void validateContentForFormat(String content, BarcodeFormat format) {
        if (format.isFixedLength() && content.length() != format.getFixedLength()) {
            // For EAN-13, allow 12 digits (we'll add check digit) or 13 digits
            if (format == BarcodeFormat.EAN_13 && (content.length() == 12 || content.length() == 13)) {
                return;
            }
            throw new BusinessRuleViolationException(
                    String.format("Content must be %d characters for %s format", format.getFixedLength(), format.getDisplayName())
            );
        }
    }

    private boolean validateEAN13(String barcode) {
        if (barcode.length() != 13 || !barcode.matches("\\d+")) {
            return false;
        }

        int sum = 0;
        for (int i = 0; i < 12; i++) {
            int digit = Character.getNumericValue(barcode.charAt(i));
            sum += (i % 2 == 0) ? digit : digit * 3;
        }

        int calculatedCheckDigit = (10 - (sum % 10)) % 10;
        int actualCheckDigit = Character.getNumericValue(barcode.charAt(12));

        return calculatedCheckDigit == actualCheckDigit;
    }

    private boolean validateEAN8(String barcode) {
        if (barcode.length() != 8 || !barcode.matches("\\d+")) {
            return false;
        }

        int sum = 0;
        for (int i = 0; i < 7; i++) {
            int digit = Character.getNumericValue(barcode.charAt(i));
            sum += (i % 2 == 0) ? digit * 3 : digit;
        }

        int calculatedCheckDigit = (10 - (sum % 10)) % 10;
        int actualCheckDigit = Character.getNumericValue(barcode.charAt(7));

        return calculatedCheckDigit == actualCheckDigit;
    }

    private boolean validateUPCA(String barcode) {
        if (barcode.length() != 12 || !barcode.matches("\\d+")) {
            return false;
        }

        int sum = 0;
        for (int i = 0; i < 11; i++) {
            int digit = Character.getNumericValue(barcode.charAt(i));
            sum += (i % 2 == 0) ? digit * 3 : digit;
        }

        int calculatedCheckDigit = (10 - (sum % 10)) % 10;
        int actualCheckDigit = Character.getNumericValue(barcode.charAt(11));

        return calculatedCheckDigit == actualCheckDigit;
    }

    private long calculateDaysToExpiry(LocalDate expiryDate) {
        return java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
    }
}
