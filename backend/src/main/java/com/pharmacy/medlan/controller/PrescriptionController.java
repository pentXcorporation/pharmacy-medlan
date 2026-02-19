package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.pos.CreatePrescriptionRequest;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.pos.CustomerPrescriptionResponse;
import com.pharmacy.medlan.dto.response.pos.PrescriptionResponse;
import com.pharmacy.medlan.service.pos.PrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
@Tag(name = "Prescriptions", description = "Prescription management APIs")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    @Operation(summary = "Create prescription", description = "Create a new prescription with multiple items")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> create(
            @Valid @RequestBody CreatePrescriptionRequest request) {
        PrescriptionResponse response = prescriptionService.createPrescription(request);
        return ResponseEntity.ok(ApiResponse.success("Prescription created successfully", response));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get prescriptions by customer")
    public ResponseEntity<ApiResponse<List<CustomerPrescriptionResponse>>> getByCustomer(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(prescriptionService.getPrescriptionsByCustomer(customerId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get prescription by ID")
    public ResponseEntity<ApiResponse<CustomerPrescriptionResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(prescriptionService.getPrescriptionById(id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete prescription")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok(ApiResponse.success("Prescription deleted successfully"));
    }
}
