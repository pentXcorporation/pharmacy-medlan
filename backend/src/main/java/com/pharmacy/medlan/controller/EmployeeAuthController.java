package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.response.common.ApiResponse;
import com.pharmacy.medlan.enums.AuthorizationStatus;
import com.pharmacy.medlan.model.user.EmployeeAuthorization;
import com.pharmacy.medlan.service.user.EmployeeAuthorizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/employee-authorizations")
@RequiredArgsConstructor
@Tag(name = "Employee Authorization", description = "Employee authorization management APIs")
public class EmployeeAuthController {

    private final EmployeeAuthorizationService authorizationService;

    @PostMapping("/request")
    @Operation(summary = "Request authorization")
    public ResponseEntity<ApiResponse<EmployeeAuthorization>> requestAuth(
            @RequestParam Long employeeId,
            @RequestParam Long branchId,
            @RequestParam String transactionType,
            @RequestParam(required = false) Long transactionReferenceId,
            @RequestParam BigDecimal amount,
            @RequestParam String reason) {
        EmployeeAuthorization auth = authorizationService.requestAuthorization(
                employeeId, branchId, transactionType, transactionReferenceId, amount, reason);
        return ResponseEntity.ok(ApiResponse.success("Authorization requested", auth));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve authorization")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeAuthorization>> approve(
            @PathVariable Long id,
            @RequestParam Long authorizedByUserId,
            @RequestParam(required = false) String remarks) {
        EmployeeAuthorization auth = authorizationService.approveAuthorization(id, authorizedByUserId, remarks);
        return ResponseEntity.ok(ApiResponse.success("Authorization approved", auth));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject authorization")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeAuthorization>> reject(
            @PathVariable Long id,
            @RequestParam Long authorizedByUserId,
            @RequestParam(required = false) String remarks) {
        EmployeeAuthorization auth = authorizationService.rejectAuthorization(id, authorizedByUserId, remarks);
        return ResponseEntity.ok(ApiResponse.success("Authorization rejected", auth));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get authorization by ID")
    public ResponseEntity<ApiResponse<EmployeeAuthorization>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(authorizationService.getById(id)));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get by authorization code")
    public ResponseEntity<ApiResponse<EmployeeAuthorization>> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success(authorizationService.getByAuthorizationCode(code)));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get authorizations by employee")
    public ResponseEntity<ApiResponse<List<EmployeeAuthorization>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(authorizationService.getByEmployee(employeeId)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get authorizations by status")
    public ResponseEntity<ApiResponse<List<EmployeeAuthorization>>> getByStatus(@PathVariable AuthorizationStatus status) {
        return ResponseEntity.ok(ApiResponse.success(authorizationService.getByStatus(status)));
    }

    @GetMapping("/branch/{branchId}/pending")
    @Operation(summary = "Get pending authorizations by branch")
    public ResponseEntity<ApiResponse<List<EmployeeAuthorization>>> getPendingByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(ApiResponse.success(authorizationService.getPendingByBranch(branchId)));
    }

    @GetMapping("/validate/{code}")
    @Operation(summary = "Validate authorization code")
    public ResponseEntity<ApiResponse<Boolean>> validate(@PathVariable String code) {
        boolean valid = authorizationService.validateAuthorizationCode(code);
        return ResponseEntity.ok(ApiResponse.success(valid));
    }
}
