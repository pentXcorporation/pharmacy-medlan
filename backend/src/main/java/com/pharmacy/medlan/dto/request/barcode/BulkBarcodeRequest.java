package com.pharmacy.medlan.dto.request.barcode;

import com.pharmacy.medlan.enums.BarcodeFormat;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkBarcodeRequest {

    @NotEmpty(message = "At least one product ID is required")
    @Size(max = 100, message = "Cannot generate more than 100 barcodes at once")
    private List<Long> productIds;

    private BarcodeFormat format;
}
