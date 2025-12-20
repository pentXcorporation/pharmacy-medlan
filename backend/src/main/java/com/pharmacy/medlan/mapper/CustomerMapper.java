package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.pos.CreateCustomerRequest;
import com.pharmacy.medlan.dto.response.pos.CustomerResponse;
import com.pharmacy.medlan.enums.CustomerStatus;
import com.pharmacy.medlan.model.pos.Customer;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CustomerMapper {

    public CustomerResponse toResponse(Customer customer) {
        if (customer == null) {
            return null;
        }

        return CustomerResponse.builder()
                .id(customer.getId())
                .customerCode(customer.getCustomerCode())
                .customerName(customer.getCustomerName())
                .phoneNumber(customer.getPhoneNumber())
                .email(customer.getEmail())
                .gender(customer.getGender())
                .dateOfBirth(customer.getDateOfBirth())
                .address(customer.getAddress())
                .city(customer.getCity())
                .state(customer.getState())
                .pincode(customer.getPincode())
                .fax(customer.getFax())
                .creditLimit(customer.getCreditLimit())
                .currentBalance(customer.getCurrentBalance())
                .status(customer.getStatus())
                .description(customer.getDescription())
                .medicalHistory(customer.getMedicalHistory())
                .allergies(customer.getAllergies())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    public Customer toEntity(CreateCustomerRequest request) {
        if (request == null) {
            return null;
        }

        return Customer.builder()
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .fax(request.getFax())
                .creditLimit(request.getCreditLimit() != null ? request.getCreditLimit() : BigDecimal.ZERO)
                .currentBalance(BigDecimal.ZERO)
                .status(CustomerStatus.ACTIVE)
                .description(request.getDescription())
                .medicalHistory(request.getMedicalHistory())
                .allergies(request.getAllergies())
                .build();
    }

    public void updateEntityFromRequest(CreateCustomerRequest request, Customer customer) {
        if (request == null || customer == null) {
            return;
        }

        if (request.getCustomerName() != null) {
            customer.setCustomerName(request.getCustomerName());
        }
        if (request.getPhoneNumber() != null) {
            customer.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getEmail() != null) {
            customer.setEmail(request.getEmail());
        }
        if (request.getGender() != null) {
            customer.setGender(request.getGender());
        }
        if (request.getDateOfBirth() != null) {
            customer.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getAddress() != null) {
            customer.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            customer.setCity(request.getCity());
        }
        if (request.getState() != null) {
            customer.setState(request.getState());
        }
        if (request.getPincode() != null) {
            customer.setPincode(request.getPincode());
        }
        if (request.getCreditLimit() != null) {
            customer.setCreditLimit(request.getCreditLimit());
        }
        if (request.getDescription() != null) {
            customer.setDescription(request.getDescription());
        }
        if (request.getMedicalHistory() != null) {
            customer.setMedicalHistory(request.getMedicalHistory());
        }
        if (request.getAllergies() != null) {
            customer.setAllergies(request.getAllergies());
        }
    }
}
