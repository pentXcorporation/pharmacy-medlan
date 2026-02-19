package com.pharmacy.medlan.dto.response.pos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponse {

    private Long customerId;
    private String customerName;
    private String doctorName;
    private String hospitalName;
    private String notes;
    private List<CustomerPrescriptionResponse> items;
    private LocalDateTime createdAt;
}
