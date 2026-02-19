package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.pos.CreateCustomerPrescriptionRequest;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.pos.CustomerPrescriptionResponse;
import com.pharmacy.medlan.service.pos.CustomerPrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-prescriptions")
@RequiredArgsConstructor
@Tag(name = "Customer Prescriptions", description = "Customer prescription management APIs")
public class CustomerPrescriptionController {

    private final CustomerPrescriptionService prescriptionService;

    @PostMapping
    @Operation(summary = "Create prescription", description = "Create a new customer prescription")
    public ResponseEntity<ApiResponse<CustomerPrescriptionResponse>> create(
            @Valid @RequestBody CreateCustomerPrescriptionRequest request) {
        CustomerPrescriptionResponse response = prescriptionService.createPrescription(request);
        return ResponseEntity.ok(ApiResponse.success("Prescription created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update prescription")
    public ResponseEntity<ApiResponse<CustomerPrescriptionResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateCustomerPrescriptionRequest request) {
        CustomerPrescriptionResponse response = prescriptionService.updatePrescription(id, request);
        return ResponseEntity.ok(ApiResponse.success("Prescription updated successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get prescription by ID")
    public ResponseEntity<ApiResponse<CustomerPrescriptionResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(prescriptionService.getById(id)));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get prescriptions by customer")
    public ResponseEntity<ApiResponse<List<CustomerPrescriptionResponse>>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(prescriptionService.getByCustomer(customerId)));
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get prescriptions by product")
    public ResponseEntity<ApiResponse<List<CustomerPrescriptionResponse>>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(prescriptionService.getByProduct(productId)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete prescription")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok(ApiResponse.success("Prescription deleted successfully"));
    }
}
