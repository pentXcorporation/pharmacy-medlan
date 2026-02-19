package com.pharmacy.medlan.dto.response.pos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPrescriptionResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private Long productId;
    private String productName;
    private String direction;
    private String duration;
    private String dosage;
    private String frequency;
    private Integer quantityPrescribed;
    private String instructions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
