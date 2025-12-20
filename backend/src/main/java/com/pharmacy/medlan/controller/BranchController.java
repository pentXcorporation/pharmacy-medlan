package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.branch.CreateBranchRequest;
import com.pharmacy.medlan.dto.response.branch.BranchResponse;
import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.mapper.BranchMapper;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.service.branch.BranchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
@Tag(name = "Branches", description = "Branch Management APIs")
public class BranchController {

    private final BranchService branchService;
    private final BranchMapper branchMapper;

    @PostMapping
    @Operation(summary = "Create a new branch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BranchResponse>> createBranch(
            @Valid @RequestBody CreateBranchRequest request) {
        Branch branch = branchMapper.toEntity(request);
        Branch createdBranch = branchService.createBranch(branch);
        return ResponseEntity.ok(ApiResponse.success("Branch created successfully", 
                branchMapper.toResponse(createdBranch)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get branch by ID")
    public ResponseEntity<ApiResponse<BranchResponse>> getBranchById(@PathVariable Long id) {
        return branchService.getBranchById(id)
                .map(branch -> ResponseEntity.ok(ApiResponse.success(branchMapper.toResponse(branch))))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{branchCode}")
    @Operation(summary = "Get branch by code")
    public ResponseEntity<ApiResponse<BranchResponse>> getBranchByCode(@PathVariable String branchCode) {
        Branch branch = branchService.getBranchByCode(branchCode);
        return ResponseEntity.ok(ApiResponse.success(branchMapper.toResponse(branch)));
    }

    @GetMapping
    @Operation(summary = "Get all branches with pagination")
    public ResponseEntity<ApiResponse<Page<BranchResponse>>> getAllBranches(Pageable pageable) {
        Page<BranchResponse> branches = branchService.getAllBranches(pageable)
                .map(branchMapper::toResponse);
        return ResponseEntity.ok(ApiResponse.success(branches));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all branches as list")
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getAllBranchesList() {
        List<BranchResponse> branches = branchMapper.toResponseList(branchService.getAllBranches());
        return ResponseEntity.ok(ApiResponse.success(branches));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active branches")
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getActiveBranches() {
        List<BranchResponse> branches = branchMapper.toResponseList(branchService.getActiveBranches());
        return ResponseEntity.ok(ApiResponse.success(branches));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a branch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BranchResponse>> updateBranch(
            @PathVariable Long id,
            @Valid @RequestBody CreateBranchRequest request) {
        Branch branch = branchMapper.toEntity(request);
        Branch updatedBranch = branchService.updateBranch(id, branch);
        return ResponseEntity.ok(ApiResponse.success("Branch updated successfully", 
                branchMapper.toResponse(updatedBranch)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a branch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBranch(@PathVariable Long id) {
        branchService.softDeleteBranch(id);
        return ResponseEntity.ok(ApiResponse.success("Branch deleted successfully", null));
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a branch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> activateBranch(@PathVariable Long id) {
        branchService.activateBranch(id);
        return ResponseEntity.ok(ApiResponse.success("Branch activated", null));
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a branch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivateBranch(@PathVariable Long id) {
        branchService.deactivateBranch(id);
        return ResponseEntity.ok(ApiResponse.success("Branch deactivated", null));
    }
}
