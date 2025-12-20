package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.inventory.CreateRGRNRequest;
import com.pharmacy.medlan.dto.response.inventory.RGRNResponse;
import com.pharmacy.medlan.enums.PaymentStatus;
import com.pharmacy.medlan.service.inventory.RGRNService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rgrns")
@RequiredArgsConstructor
@Tag(name = "RGRN", description = "APIs for managing Return Goods Receipt Notes")
public class RGRNController {

    private final RGRNService rgrnService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Create RGRN", description = "Create a new Return Goods Receipt Note")
    public ResponseEntity<RGRNResponse> createRGRN(@Valid @RequestBody CreateRGRNRequest request) {
        return new ResponseEntity<>(rgrnService.createRGRN(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get RGRN by ID", description = "Retrieve an RGRN by its ID")
    public ResponseEntity<RGRNResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(rgrnService.getById(id));
    }

    @GetMapping("/number/{rgrnNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get RGRN by number", description = "Retrieve an RGRN by its number")
    public ResponseEntity<RGRNResponse> getByRgrnNumber(@PathVariable String rgrnNumber) {
        return ResponseEntity.ok(rgrnService.getByRgrnNumber(rgrnNumber));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get all RGRNs", description = "Retrieve all RGRNs with pagination")
    public ResponseEntity<Page<RGRNResponse>> getAllRGRNs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(rgrnService.getAllRGRNs(pageable));
    }

    @GetMapping("/supplier/{supplierId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get RGRNs by supplier", description = "Retrieve RGRNs for a supplier")
    public ResponseEntity<List<RGRNResponse>> getBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(rgrnService.getBySupplier(supplierId));
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get RGRNs by branch", description = "Retrieve RGRNs for a branch")
    public ResponseEntity<List<RGRNResponse>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(rgrnService.getByBranch(branchId));
    }

    @GetMapping("/grn/{grnId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get RGRNs by original GRN", description = "Retrieve RGRNs linked to a GRN")
    public ResponseEntity<List<RGRNResponse>> getByOriginalGrn(@PathVariable Long grnId) {
        return ResponseEntity.ok(rgrnService.getByOriginalGrn(grnId));
    }

    @GetMapping("/refund-status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get RGRNs by refund status", description = "Retrieve RGRNs by refund status")
    public ResponseEntity<List<RGRNResponse>> getByRefundStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(rgrnService.getByRefundStatus(status));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'PHARMACIST')")
    @Operation(summary = "Get RGRNs by date range", description = "Retrieve RGRNs within a date range")
    public ResponseEntity<List<RGRNResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(rgrnService.getByDateRange(startDate, endDate));
    }

    @PutMapping("/{id}/refund-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update refund status", description = "Update the refund status of an RGRN")
    public ResponseEntity<RGRNResponse> updateRefundStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus refundStatus) {
        return ResponseEntity.ok(rgrnService.updateRefundStatus(id, refundStatus));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete RGRN", description = "Delete an RGRN (admin only)")
    public ResponseEntity<Void> deleteRGRN(@PathVariable Long id) {
        rgrnService.deleteRGRN(id);
        return ResponseEntity.noContent().build();
    }
}
