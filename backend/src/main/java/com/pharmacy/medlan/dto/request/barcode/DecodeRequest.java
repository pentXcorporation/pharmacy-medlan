package com.pharmacy.medlan.dto.request.barcode;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DecodeRequest {

    @NotBlank(message = "Base64 image is required for decoding")
    private String base64Image;
}
