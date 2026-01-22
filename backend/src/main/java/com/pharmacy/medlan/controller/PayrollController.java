package com.pharmacy.medlan.controller;

import com.pharmacy.medlan.dto.request.payroll.CreatePayrollRequest;
import com.pharmacy.medlan.dto.response.payroll.PayrollResponse;
import com.pharmacy.medlan.service.payroll.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping
    public ResponseEntity<PayrollResponse> create(@Valid @RequestBody CreatePayrollRequest request) {
        log.info("Creating new payroll entry");
        PayrollResponse response = payrollService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PayrollResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CreatePayrollRequest request) {
        log.info("Updating payroll entry with ID: {}", id);
        PayrollResponse response = payrollService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("Deleting payroll entry with ID: {}", id);
        payrollService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PayrollResponse> getById(@PathVariable Long id) {
        log.info("Fetching payroll entry with ID: {}", id);
        PayrollResponse response = payrollService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<PayrollResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "paymentDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        log.info("Fetching all payroll entries - page: {}, size: {}", page, size);
        
        Sort sort = sortDir.equalsIgnoreCase("DESC") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PayrollResponse> response = payrollService.getAll(pageable);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollResponse>> getByEmployeeId(@PathVariable Long employeeId) {
        log.info("Fetching payroll for employee ID: {}", employeeId);
        List<PayrollResponse> response = payrollService.getByEmployeeId(employeeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PayrollResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Fetching payroll between {} and {}", startDate, endDate);
        List<PayrollResponse> response = payrollService.getByDateRange(startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
