package com.pharmacy.medlan.dto.response.barcode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QRCodeResponse {
    
    /**
     * The encoded content of the QR code
     */
    private String content;
    
    /**
     * Base64 encoded QR code image
     */
    private String imageBase64;
    
    /**
     * MIME type of the image
     */
    private String mimeType;
    
    /**
     * Size of the QR code (width = height)
     */
    private int size;
    
    /**
     * Error correction level used
     */
    private String errorCorrectionLevel;
    
    /**
     * Type of QR code (PRODUCT, BATCH, INVOICE, PRESCRIPTION)
     */
    private String qrType;
    
    /**
     * Associated entity ID
     */
    private Long entityId;
    
    /**
     * Entity reference number
     */
    private String entityReference;
    
    /**
     * Additional metadata embedded in QR
     */
    private Map<String, Object> metadata;
    
    /**
     * Generation timestamp
     */
    private LocalDateTime generatedAt;
    
    /**
     * Expiry time for time-limited QR codes
     */
    private LocalDateTime expiresAt;
    
    /**
     * Data URL ready for direct HTML embedding
     */
    public String getDataUrl() {
        return "data:" + mimeType + ";base64," + imageBase64;
    }
}
