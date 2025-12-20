package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.inventory.CreateGRNRequest;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.dto.response.inventory.GRNResponse;
import com.pharmacy.medlan.enums.GRNStatus;
import com.pharmacy.medlan.service.inventory.GRNService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/grn")
@RequiredArgsConstructor
@Tag(name = "GRN", description = "Goods Receipt Note Management APIs")
public class GRNController {

    private final GRNService grnService;

    @PostMapping
    @Operation(summary = "Create a new GRN")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<GRNResponse>> createGRN(
            @Valid @RequestBody CreateGRNRequest request) {
        GRNResponse grn = grnService.createGRN(request);
        return ResponseEntity.ok(ApiResponse.success("GRN created successfully", grn));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get GRN by ID")
    public ResponseEntity<ApiResponse<GRNResponse>> getGRNById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(grnService.getGRNById(id)));
    }

    @GetMapping("/number/{grnNumber}")
    @Operation(summary = "Get GRN by number")
    public ResponseEntity<ApiResponse<GRNResponse>> getGRNByNumber(@PathVariable String grnNumber) {
        return ResponseEntity.ok(ApiResponse.success(grnService.getGRNByNumber(grnNumber)));
    }

    @GetMapping
    @Operation(summary = "Get all GRNs with pagination")
    public ResponseEntity<ApiResponse<Page<GRNResponse>>> getAllGRNs(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(grnService.getAllGRNs(pageable)));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get GRNs by branch")
    public ResponseEntity<ApiResponse<Page<GRNResponse>>> getGRNsByBranch(
            @PathVariable Long branchId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(grnService.getGRNsByBranch(branchId, pageable)));
    }

    @GetMapping("/supplier/{supplierId}")
    @Operation(summary = "Get GRNs by supplier")
    public ResponseEntity<ApiResponse<Page<GRNResponse>>> getGRNsBySupplier(
            @PathVariable Long supplierId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(grnService.getGRNsBySupplier(supplierId, pageable)));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get GRNs by date range")
    public ResponseEntity<ApiResponse<List<GRNResponse>>> getGRNsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(grnService.getGRNsByDateRange(startDate, endDate)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get GRNs by status")
    public ResponseEntity<ApiResponse<Page<GRNResponse>>> getGRNsByStatus(
            @PathVariable GRNStatus status, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(grnService.getGRNsByStatus(status, pageable)));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve a GRN")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<GRNResponse>> approveGRN(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("GRN approved", grnService.approveGRN(id)));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject a GRN")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<GRNResponse>> rejectGRN(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(ApiResponse.success("GRN rejected", grnService.rejectGRN(id, reason)));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a GRN")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<GRNResponse>> cancelGRN(
            @PathVariable Long id,
            @RequestParam String reason) {
        return ResponseEntity.ok(ApiResponse.success("GRN cancelled", grnService.cancelGRN(id, reason)));
    }
}
