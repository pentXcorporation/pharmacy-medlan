package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.dto.response.finance.CashBookResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.finance.CashBook;
import com.pharmacy.medlan.repository.finance.CashBookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CashBookServiceImpl implements CashBookService {

    private final CashBookRepository cashBookRepository;

    @Override
    public List<CashBookResponse> getCashBookByBranch(Long branchId) {
        log.debug("Fetching cash book entries for branch: {}", branchId);
        List<CashBook> cashBooks = cashBookRepository.findLatestByBranch(branchId);
        return cashBooks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CashBookResponse> getCashBookByDateRange(LocalDate startDate, LocalDate endDate) {
        log.debug("Fetching cash book entries from {} to {}", startDate, endDate);
        List<CashBook> cashBooks = cashBookRepository.findByTransactionDateBetween(startDate, endDate);
        return cashBooks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CashBookResponse> getCashBookByBranchAndDateRange(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.debug("Fetching cash book entries for branch {} from {} to {}", branchId, startDate, endDate);
        List<CashBook> cashBooks = cashBookRepository.findByBranchIdAndTransactionDateBetween(branchId, startDate, endDate);
        return cashBooks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<CashBookResponse> getAllCashBook(Pageable pageable) {
        log.debug("Fetching all cash book entries with pagination");
        return cashBookRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public CashBookResponse getCashBookById(Long id) {
        log.debug("Fetching cash book entry with id: {}", id);
        CashBook cashBook = cashBookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cash book entry not found with id: " + id));
        return mapToResponse(cashBook);
    }

    @Override
    public Map<String, BigDecimal> getCashBookSummary(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.debug("Calculating cash book summary for branch {} from {} to {}", branchId, startDate, endDate);
        
        BigDecimal totalDebit = cashBookRepository.getTotalDebitByBranchAndDate(branchId, startDate, endDate);
        BigDecimal totalCredit = cashBookRepository.getTotalCreditByBranchAndDate(branchId, startDate, endDate);
        
        if (totalDebit == null) totalDebit = BigDecimal.ZERO;
        if (totalCredit == null) totalCredit = BigDecimal.ZERO;
        
        // Get opening balance (last balance before start date)
        List<CashBook> previousEntries = cashBookRepository.findByBranchIdAndTransactionDateBetween(
                branchId, 
                LocalDate.of(2000, 1, 1), 
                startDate.minusDays(1)
        );
        
        BigDecimal openingBalance = BigDecimal.ZERO;
        if (!previousEntries.isEmpty()) {
            openingBalance = previousEntries.get(previousEntries.size() - 1).getRunningBalance();
        }
        
        BigDecimal closingBalance = openingBalance.add(totalDebit).subtract(totalCredit);
        
        Map<String, BigDecimal> summary = new HashMap<>();
        summary.put("openingBalance", openingBalance);
        summary.put("totalReceipts", totalDebit);
        summary.put("totalPayments", totalCredit);
        summary.put("closingBalance", closingBalance);
        
        return summary;
    }

    private CashBookResponse mapToResponse(CashBook cashBook) {
        return CashBookResponse.builder()
                .id(cashBook.getId())
                .transactionDate(cashBook.getTransactionDate())
                .transactionType(cashBook.getTransactionType() != null ? 
                        cashBook.getTransactionType().getTypeName() : "N/A")
                .description(cashBook.getDescription())
                .debitAmount(cashBook.getDebitAmount())
                .creditAmount(cashBook.getCreditAmount())
                .runningBalance(cashBook.getRunningBalance())
                .referenceNumber(cashBook.getReferenceNumber())
                .paymentMethod(cashBook.getPaymentMethod() != null ? 
                        cashBook.getPaymentMethod().name() : null)
                .category(cashBook.getCategory())
                .branchId(cashBook.getBranch() != null ? cashBook.getBranch().getId() : null)
                .branchName(cashBook.getBranch() != null ? cashBook.getBranch().getBranchName() : null)
                .userId(cashBook.getUser() != null ? cashBook.getUser().getId() : null)
                .userName(cashBook.getUser() != null ? cashBook.getUser().getUsername() : null)
                .createdAt(cashBook.getCreatedAt())
                .build();
    }
}
