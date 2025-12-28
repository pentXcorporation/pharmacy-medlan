package com.pharmacy.medlan.dto.request.inventory;

import com.pharmacy.medlan.enums.ScanContext;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeScanRequest {

    @NotBlank(message = "Barcode/QR data is required")
    private String scanData;

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    private ScanContext context = ScanContext.POS;

    /**
     * Quantity (for contexts that need quantity input)
     */
    private Integer quantity;

    /**
     * Whether this is a QR code scan (vs barcode)
     */
    private boolean qrCode = false;

    /**
     * Session ID for tracking related scans
     */
    private String sessionId;

    /**
     * Additional context-specific data
     */
    private String additionalData;
}
