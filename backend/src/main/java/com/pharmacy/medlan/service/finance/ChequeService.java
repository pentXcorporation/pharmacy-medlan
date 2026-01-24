package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.dto.request.finance.CreateChequeRequest;
import com.pharmacy.medlan.dto.response.finance.ChequeResponse;
import com.pharmacy.medlan.enums.ChequeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.Map;

public interface ChequeService {
    
    /**
     * Create a new cheque
     */
    ChequeResponse createCheque(CreateChequeRequest request);
    
    /**
     * Update an existing cheque
     */
    ChequeResponse updateCheque(Long id, CreateChequeRequest request);
    
    /**
     * Get cheque by ID
     */
    ChequeResponse getChequeById(Long id);
    
    /**
     * Get all cheques with pagination and filters
     */
    Page<ChequeResponse> getAllCheques(
        ChequeStatus status,
        Long bankId,
        Long customerId,
        Long supplierId,
        LocalDate startDate,
        LocalDate endDate,
        Pageable pageable
    );
    
    /**
     * Update cheque status
     */
    ChequeResponse updateChequeStatus(Long id, ChequeStatus status);
    
    /**
     * Mark cheque as deposited
     */
    ChequeResponse depositCheque(Long id, LocalDate depositDate);
    
    /**
     * Mark cheque as cleared and create bank transaction
     */
    ChequeResponse clearCheque(Long id, LocalDate clearanceDate);
    
    /**
     * Mark cheque as bounced
     */
    ChequeResponse bounceCheque(Long id, String reason, LocalDate bounceDate);
    
    /**
     * Cancel cheque
     */
    ChequeResponse cancelCheque(Long id, String reason);
    
    /**
     * Reconcile cheque with bank statement
     */
    ChequeResponse reconcileCheque(Long id);
    
    /**
     * Get cheque statistics
     */
    Map<String, Object> getChequeStatistics();
    
    /**
     * Get cheque statistics by date range
     */
    Map<String, Object> getChequeStatisticsByDateRange(LocalDate startDate, LocalDate endDate);
    
    /**
     * Delete cheque
     */
    void deleteCheque(Long id);
}

