package com.pharmacy.medlan.dto.response.barcode;

import com.pharmacy.medlan.enums.BarcodeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeResponse {
    
    /**
     * The encoded content of the barcode
     */
    private String content;
    
    /**
     * Base64 encoded barcode image
     */
    private String imageBase64;
    
    /**
     * MIME type of the image (e.g., "image/png")
     */
    private String mimeType;
    
    /**
     * Barcode format used
     */
    private BarcodeFormat format;
    
    /**
     * Width of the generated image
     */
    private int width;
    
    /**
     * Height of the generated image
     */
    private int height;
    
    /**
     * Product ID if this barcode is for a product
     */
    private Long productId;
    
    /**
     * Product name for reference
     */
    private String productName;
    
    /**
     * Product code
     */
    private String productCode;
    
    /**
     * Selling price for shelf label
     */
    private String price;
    
    /**
     * MRP for shelf label
     */
    private String mrp;
    
    /**
     * Generation timestamp
     */
    private LocalDateTime generatedAt;
    
    /**
     * Data URL ready for direct HTML embedding
     */
    public String getDataUrl() {
        return "data:" + mimeType + ";base64," + imageBase64;
    }
}
