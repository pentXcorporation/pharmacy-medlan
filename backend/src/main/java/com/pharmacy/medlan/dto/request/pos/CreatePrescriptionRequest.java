package com.pharmacy.medlan.dto.request.pos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class CreatePrescriptionRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @Size(max = 200, message = "Doctor name must not exceed 200 characters")
    private String doctorName;

    @Size(max = 200, message = "Hospital/clinic name must not exceed 200 characters")
    private String hospitalName;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;

    @NotEmpty(message = "At least one prescription item is required")
    @Valid
    private List<CreateCustomerPrescriptionRequest> items;
}
