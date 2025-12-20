package com.pharmacy.medlan.dto.request.supplier;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSupplierRequest {

    @NotBlank(message = "Supplier name is required")
    @Size(max = 200, message = "Supplier name must not exceed 200 characters")
    private String supplierName;

    private String contactPerson;

    private String phoneNumber;

    private String email;

    private String address;

    private String city;

    private String state;

    private String pincode;

    private String gstinNumber;

    private String panNumber;

    private String drugLicenseNumber;

    private BigDecimal defaultDiscountPercent;

    private Integer paymentTermDays;

    private BigDecimal creditLimit;
}
