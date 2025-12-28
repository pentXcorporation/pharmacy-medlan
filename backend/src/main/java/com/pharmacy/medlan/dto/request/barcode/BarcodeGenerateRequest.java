package com.pharmacy.medlan.dto.request.barcode;

import com.pharmacy.medlan.enums.BarcodeFormat;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BarcodeGenerateRequest {

    @NotBlank(message = "Content is required for barcode generation")
    @Size(max = 100, message = "Content must not exceed 100 characters")
    private String content;

    private BarcodeFormat format;

    @Min(value = 50, message = "Width must be at least 50 pixels")
    @Max(value = 1000, message = "Width must not exceed 1000 pixels")
    private int width = 300;

    @Min(value = 30, message = "Height must be at least 30 pixels")
    @Max(value = 500, message = "Height must not exceed 500 pixels")
    private int height = 100;
}
