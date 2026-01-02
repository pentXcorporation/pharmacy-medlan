package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.supplier.CreateSupplierRequest;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.common.PageResponse;
import com.pharmacy.medlan.dto.response.supplier.SupplierResponse;
import com.pharmacy.medlan.service.supplier.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@Tag(name = "Supplier Management", description = "APIs for managing suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    @Operation(summary = "Create supplier", description = "Create a new supplier")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<SupplierResponse>> createSupplier(
            @Valid @RequestBody CreateSupplierRequest request) {
        SupplierResponse response = supplierService.createSupplier(request);
        return ResponseEntity.ok(ApiResponse.success("Supplier created successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update supplier", description = "Update an existing supplier")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<SupplierResponse>> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody CreateSupplierRequest request) {
        SupplierResponse response = supplierService.updateSupplier(id, request);
        return ResponseEntity.ok(ApiResponse.success("Supplier updated successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get supplier by ID", description = "Get supplier details by ID")
    public ResponseEntity<ApiResponse<SupplierResponse>> getSupplierById(@PathVariable Long id) {
        SupplierResponse response = supplierService.getSupplierById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/code/{supplierCode}")
    @Operation(summary = "Get supplier by code", description = "Get supplier details by supplier code")
    public ResponseEntity<ApiResponse<SupplierResponse>> getSupplierByCode(@PathVariable String supplierCode) {
        SupplierResponse response = supplierService.getSupplierByCode(supplierCode);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Get all suppliers", description = "Get all suppliers with pagination and filtering")
    public ResponseEntity<ApiResponse<PageResponse<SupplierResponse>>> getAllSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search) {
        
        // Parse sort parameter (format: "field,direction" or "field")
        String sortBy = "supplierName";
        String sortDir = "asc";
        if (sort != null && !sort.isEmpty()) {
            String[] sortParts = sort.split(",");
            sortBy = sortParts[0];
            if (sortParts.length > 1) {
                sortDir = sortParts[1];
            }
        }
        
        Sort sortObj = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sortObj);
        
        Page<SupplierResponse> suppliersPage = supplierService.getAllSuppliers(pageable, isActive, search);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(suppliersPage)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search suppliers", description = "Search suppliers by name or contact")
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> searchSuppliers(@RequestParam String query) {
        List<SupplierResponse> response = supplierService.searchSuppliers(query);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/active")
    @Operation(summary = "Get active suppliers", description = "Get all active suppliers")
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> getActiveSuppliers() {
        List<SupplierResponse> response = supplierService.getActiveSuppliers();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete supplier", description = "Soft delete a supplier")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public ResponseEntity<ApiResponse<Void>> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier deleted successfully"));
    }

    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate supplier", description = "Activate a supplier")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> activateSupplier(@PathVariable Long id) {
        supplierService.activateSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier activated successfully"));
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate supplier", description = "Deactivate a supplier")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deactivateSupplier(@PathVariable Long id) {
        supplierService.deactivateSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier deactivated successfully"));
    }
}
