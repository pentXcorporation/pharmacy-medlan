package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.finance.CreateChequeRequest;
import com.pharmacy.medlan.dto.response.finance.ChequeResponse;
import com.pharmacy.medlan.enums.ChequeStatus;
import com.pharmacy.medlan.service.finance.ChequeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/cheques")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChequeController {

    private final ChequeService chequeService;

    /**
     * Get all cheques with pagination and filters
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<Page<ChequeResponse>> getAllCheques(
            @RequestParam(required = false) ChequeStatus status,
            @RequestParam(required = false) Long bankId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(size = 10, sort = "chequeDate", direction = Sort.Direction.DESC) Pageable pageable) {
        
        log.info("Fetching cheques - Status: {}, BankId: {}, CustomerId: {}, SupplierId: {}", 
                 status, bankId, customerId, supplierId);
        
        Page<ChequeResponse> cheques = chequeService.getAllCheques(
            status, bankId, customerId, supplierId, startDate, endDate, pageable);
        
        return ResponseEntity.ok(cheques);
    }

    /**
     * Get cheque by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> getChequeById(@PathVariable Long id) {
        log.info("Fetching cheque with id: {}", id);
        ChequeResponse cheque = chequeService.getChequeById(id);
        return ResponseEntity.ok(cheque);
    }

    /**
     * Create new cheque
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> createCheque(@Valid @RequestBody CreateChequeRequest request) {
        log.info("Creating new cheque: {}", request.getChequeNumber());
        ChequeResponse cheque = chequeService.createCheque(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(cheque);
    }

    /**
     * Update cheque
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> updateCheque(
            @PathVariable Long id,
            @Valid @RequestBody CreateChequeRequest request) {
        log.info("Updating cheque with id: {}", id);
        ChequeResponse cheque = chequeService.updateCheque(id, request);
        return ResponseEntity.ok(cheque);
    }

    /**
     * Update cheque status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> updateChequeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("Updating cheque status for id: {} to {}", id, request.get("status"));
        ChequeStatus status = ChequeStatus.valueOf(request.get("status"));
        ChequeResponse cheque = chequeService.updateChequeStatus(id, status);
        return ResponseEntity.ok(cheque);
    }

    /**
     * Deposit cheque
     */
    @PostMapping("/{id}/deposit")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> depositCheque(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> request) {
        log.info("Depositing cheque with id: {}", id);
        LocalDate depositDate = request != null && request.containsKey("depositDate")
            ? LocalDate.parse(request.get("depositDate"))
            : LocalDate.now();
        ChequeResponse cheque = chequeService.depositCheque(id, depositDate);
        return ResponseEntity.ok(cheque);
    }

    /**
     * Clear cheque
     */
    @PostMapping("/{id}/clear")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> clearCheque(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> request) {
        log.info("Clearing cheque with id: {}", id);
        LocalDate clearanceDate = request != null && request.containsKey("clearanceDate")
            ? LocalDate.parse(request.get("clearanceDate"))
            : LocalDate.now();
        ChequeResponse cheque = chequeService.clearCheque(id, clearanceDate);
        return ResponseEntity.ok(cheque);
    }

    /**
     * Bounce cheque
     */
    @PostMapping("/{id}/bounce")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> bounceCheque(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("Bouncing cheque with id: {}", id);
        String reason = request.get("reason");
        LocalDate bounceDate = request.containsKey("bounceDate")
            ? LocalDate.parse(request.get("bounceDate"))
            : LocalDate.now();
        ChequeResponse cheque = chequeService.bounceCheque(id, reason, bounceDate);
        return ResponseEntity.ok(cheque);
    }

    /**
     * Cancel cheque
     */
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> cancelCheque(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("Cancelling cheque with id: {}", id);
        String reason = request.get("reason");
        ChequeResponse cheque = chequeService.cancelCheque(id, reason);
        return ResponseEntity.ok(cheque);
    }

    /**
     * Reconcile cheque
     */
    @PostMapping("/{id}/reconcile")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<ChequeResponse> reconcileCheque(@PathVariable Long id) {
        log.info("Reconciling cheque with id: {}", id);
        ChequeResponse cheque = chequeService.reconcileCheque(id);
        return ResponseEntity.ok(cheque);
    }

    /**
     * Get cheque statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<Map<String, Object>> getChequeStatistics() {
        log.info("Fetching cheque statistics");
        Map<String, Object> stats = chequeService.getChequeStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get cheque statistics by date range
     */
    @GetMapping("/stats/date-range")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER', 'ACCOUNTANT')")
    public ResponseEntity<Map<String, Object>> getChequeStatisticsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Fetching cheque statistics for date range: {} to {}", startDate, endDate);
        Map<String, Object> stats = chequeService.getChequeStatisticsByDateRange(startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * Delete cheque
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OWNER')")
    public ResponseEntity<Void> deleteCheque(@PathVariable Long id) {
        log.info("Deleting cheque with id: {}", id);
        chequeService.deleteCheque(id);
        return ResponseEntity.noContent().build();
    }
}

