package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.model.product.Unit;
import com.pharmacy.medlan.service.product.UnitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
@Tag(name = "Units", description = "Product unit management APIs")
public class UnitController {

    private final UnitService unitService;

    @PostMapping
    @Operation(summary = "Create unit")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<Unit>> create(
            @RequestParam String unitName,
            @RequestParam String unitCode) {
        Unit created = unitService.createUnit(unitName, unitCode);
        return ResponseEntity.ok(ApiResponse.success("Unit created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update unit")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<ApiResponse<Unit>> update(
            @PathVariable Long id,
            @RequestParam String unitName) {
        Unit updated = unitService.updateUnit(id, unitName);
        return ResponseEntity.ok(ApiResponse.success("Unit updated successfully", updated));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get unit by ID")
    public ResponseEntity<ApiResponse<Unit>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(unitService.getUnitById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all units")
    public ResponseEntity<ApiResponse<List<Unit>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(unitService.getAllUnits()));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active units")
    public ResponseEntity<ApiResponse<List<Unit>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(unitService.getActiveUnits()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete unit")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        unitService.deleteUnit(id);
        return ResponseEntity.ok(ApiResponse.success("Unit deleted successfully"));
    }
}
