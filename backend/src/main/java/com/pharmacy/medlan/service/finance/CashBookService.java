package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.dto.response.finance.CashBookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface CashBookService {
    List<CashBookResponse> getCashBookByBranch(Long branchId);
    List<CashBookResponse> getCashBookByDateRange(LocalDate startDate, LocalDate endDate);
    List<CashBookResponse> getCashBookByBranchAndDateRange(Long branchId, LocalDate startDate, LocalDate endDate);
    Page<CashBookResponse> getAllCashBook(Pageable pageable);
    CashBookResponse getCashBookById(Long id);
    Map<String, BigDecimal> getCashBookSummary(Long branchId, LocalDate startDate, LocalDate endDate);
}
