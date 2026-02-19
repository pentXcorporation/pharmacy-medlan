package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.model.user.BranchStaff;
import com.pharmacy.medlan.service.branch.BranchStaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branch-staff")
@RequiredArgsConstructor
@Tag(name = "Branch Staff", description = "Branch staff assignment management APIs")
public class BranchStaffController {

    private final BranchStaffService branchStaffService;

    @PostMapping
    @Operation(summary = "Assign staff to branch")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<BranchStaff>> assignStaff(
            @RequestParam Long userId,
            @RequestParam Long branchId,
            @RequestParam String designation,
            @RequestParam String employmentType) {
        BranchStaff staff = branchStaffService.assignStaffToBranch(userId, branchId, designation, employmentType);
        return ResponseEntity.ok(ApiResponse.success("Staff assigned successfully", staff));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update staff assignment")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<BranchStaff>> updateAssignment(
            @PathVariable Long id,
            @RequestParam(required = false) String designation,
            @RequestParam(required = false) Boolean isActive) {
        BranchStaff staff = branchStaffService.updateStaffAssignment(id, designation, isActive);
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", staff));
    }

    @DeleteMapping
    @Operation(summary = "Remove staff from branch")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> removeStaff(
            @RequestParam Long userId,
            @RequestParam Long branchId) {
        branchStaffService.removeStaffFromBranch(userId, branchId);
        return ResponseEntity.ok(ApiResponse.success("Staff removed from branch"));
    }

    @GetMapping("/branch/{branchId}")
    @Operation(summary = "Get staff by branch")
    public ResponseEntity<ApiResponse<List<BranchStaff>>> getStaffByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(branchStaffService.getStaffByBranch(branchId)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get branches for user")
    public ResponseEntity<ApiResponse<List<BranchStaff>>> getStaffByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(branchStaffService.getStaffByUser(userId)));
    }

    @GetMapping("/user/{userId}/primary")
    @Operation(summary = "Get primary branch for user")
    public ResponseEntity<ApiResponse<BranchStaff>> getPrimaryBranch(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(branchStaffService.getPrimaryBranch(userId)));
    }

    @PatchMapping("/user/{userId}/primary")
    @Operation(summary = "Set primary branch for user")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> setPrimaryBranch(
            @PathVariable Long userId,
            @RequestParam Long branchId) {
        branchStaffService.setPrimaryBranch(userId, branchId);
        return ResponseEntity.ok(ApiResponse.success("Primary branch set successfully"));
    }
}
