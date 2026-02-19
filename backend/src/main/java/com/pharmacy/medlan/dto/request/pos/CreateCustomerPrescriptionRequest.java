package com.pharmacy.medlan.dto.request.pos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCustomerPrescriptionRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    private String productName;

    @Size(max = 500, message = "Direction must not exceed 500 characters")
    private String direction;

    @Size(max = 100, message = "Duration must not exceed 100 characters")
    private String duration;

    @Size(max = 100, message = "Dosage must not exceed 100 characters")
    private String dosage;

    @Size(max = 100, message = "Frequency must not exceed 100 characters")
    private String frequency;

    @Min(value = 1, message = "Quantity prescribed must be at least 1")
    private Integer quantityPrescribed;

    @Size(max = 2000, message = "Instructions must not exceed 2000 characters")
    private String instructions;
}
