package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.dto.finance.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface CashRegisterService {

    /**
     * Open a new cash register for a branch
     */
    CashRegisterResponse openRegister(OpenCashRegisterRequest request);

    /**
     * Close an open cash register
     */
    CashRegisterResponse closeRegister(Long registerId, CloseCashRegisterRequest request);

    /**
     * Record a cash in transaction
     */
    CashRegisterResponse recordCashIn(Long registerId, CashTransactionRequest request);

    /**
     * Record a cash out transaction
     */
    CashRegisterResponse recordCashOut(Long registerId, CashTransactionRequest request);

    /**
     * Deposit cash to bank
     */
    CashRegisterResponse depositToBank(Long registerId, BankDepositRequest request);

    /**
     * Get current open register for a branch
     */
    CashRegisterResponse getCurrentRegister(Long branchId);

    /**
     * Get cash register by ID
     */
    CashRegisterResponse getRegisterById(Long registerId);

    /**
     * Get all cash registers with pagination
     */
    Page<CashRegisterResponse> getAllRegisters(Pageable pageable);

    /**
     * Get cash registers by branch
     */
    Page<CashRegisterResponse> getRegistersByBranch(Long branchId, Pageable pageable);

    /**
     * Get cash registers by date range
     */
    List<CashRegisterResponse> getRegistersByDateRange(Long branchId, LocalDate startDate, LocalDate endDate);

    /**
     * Get all transactions for a register
     */
    List<CashRegisterTransactionResponse> getRegisterTransactions(Long registerId);

    /**
     * Get daily summary for a branch
     */
    CashRegisterSummaryResponse getDailySummary(Long branchId, LocalDate date);

    /**
     * Delete a cash register (soft delete)
     */
    void deleteRegister(Long registerId);
}
