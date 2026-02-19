package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.supplier.CreateSupplierRequest;
import com.pharmacy.medlan.dto.response.supplier.SupplierResponse;
import com.pharmacy.medlan.model.supplier.Supplier;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SupplierMapper {

    public SupplierResponse toResponse(Supplier supplier) {
        if (supplier == null) {
            return null;
        }

        return SupplierResponse.builder()
                .id(supplier.getId())
                .supplierCode(supplier.getSupplierCode())
                .supplierName(supplier.getSupplierName())
                .contactPerson(supplier.getContactPerson())
                .phoneNumber(supplier.getPhoneNumber())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .city(supplier.getCity())
                .state(supplier.getState())
                .pincode(supplier.getPincode())
                .gstinNumber(supplier.getGstinNumber())
                .panNumber(supplier.getPanNumber())
                .drugLicenseNumber(supplier.getDrugLicenseNumber())
                .defaultDiscountPercent(supplier.getDefaultDiscountPercent())
                .paymentTermDays(supplier.getPaymentTermDays())
                .creditLimit(supplier.getCreditLimit())
                .currentBalance(supplier.getCurrentBalance())
                .isActive(supplier.getIsActive())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }

    public List<SupplierResponse> toResponseList(List<Supplier> suppliers) {
        if (suppliers == null) return Collections.emptyList();
        return suppliers.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Supplier toEntity(CreateSupplierRequest request) {
        if (request == null) {
            return null;
        }

        return Supplier.builder()
                .supplierName(request.getSupplierName())
                .contactPerson(request.getContactPerson())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .gstinNumber(request.getGstinNumber())
                .panNumber(request.getPanNumber())
                .drugLicenseNumber(request.getDrugLicenseNumber())
                .defaultDiscountPercent(request.getDefaultDiscountPercent() != null
                        ? request.getDefaultDiscountPercent() : BigDecimal.ZERO)
                .paymentTermDays(request.getPaymentTermDays() != null ? request.getPaymentTermDays() : 30)
                .creditLimit(request.getCreditLimit() != null ? request.getCreditLimit() : BigDecimal.ZERO)
                .currentBalance(BigDecimal.ZERO)
                .isActive(true)
                .build();
    }

    /** Applies only non-null fields — safe for PATCH-style partial updates. */
    public void updateEntityFromRequest(CreateSupplierRequest request, Supplier supplier) {
        if (request == null || supplier == null) return;

        if (request.getSupplierName() != null)          supplier.setSupplierName(request.getSupplierName());
        if (request.getContactPerson() != null)         supplier.setContactPerson(request.getContactPerson());
        if (request.getPhoneNumber() != null)           supplier.setPhoneNumber(request.getPhoneNumber());
        if (request.getEmail() != null)                 supplier.setEmail(request.getEmail());
        if (request.getAddress() != null)               supplier.setAddress(request.getAddress());
        if (request.getCity() != null)                  supplier.setCity(request.getCity());
        if (request.getState() != null)                 supplier.setState(request.getState());
        if (request.getPincode() != null)               supplier.setPincode(request.getPincode());
        if (request.getGstinNumber() != null)           supplier.setGstinNumber(request.getGstinNumber());
        if (request.getPanNumber() != null)             supplier.setPanNumber(request.getPanNumber());
        if (request.getDrugLicenseNumber() != null)     supplier.setDrugLicenseNumber(request.getDrugLicenseNumber());
        if (request.getDefaultDiscountPercent() != null) supplier.setDefaultDiscountPercent(request.getDefaultDiscountPercent());
        if (request.getPaymentTermDays() != null)       supplier.setPaymentTermDays(request.getPaymentTermDays());
        if (request.getCreditLimit() != null)           supplier.setCreditLimit(request.getCreditLimit());
    }
}