package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.dto.finance.*;
import com.pharmacy.medlan.enums.CashRegisterStatus;
import com.pharmacy.medlan.enums.CashRegisterTransactionType;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.exception.ValidationException;
import com.pharmacy.medlan.model.organization.Branch;
import com.pharmacy.medlan.model.finance.*;
import com.pharmacy.medlan.model.user.User;
import com.pharmacy.medlan.repository.organization.BranchRepository;
import com.pharmacy.medlan.repository.finance.*;
import com.pharmacy.medlan.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CashRegisterServiceImpl implements CashRegisterService {

    private final CashRegisterRepository cashRegisterRepository;
    private final CashRegisterTransactionRepository transactionRepository;
    private final BranchRepository branchRepository;
    private final BankRepository bankRepository;
    private final BankDataRepository bankDataRepository;
    private final CashBookRepository cashBookRepository;
    private final UserRepository userRepository;

    @Override
    public CashRegisterResponse openRegister(OpenCashRegisterRequest request) {
        log.info("Opening cash register for branch: {}", request.getBranchId());

        // Validate branch exists
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getBranchId()));

        // Check if there's already an open register for this branch
        cashRegisterRepository.findOpenRegisterByBranch(request.getBranchId())
                .ifPresent(register -> {
                    throw new ValidationException("There is already an open cash register for this branch");
                });

        // Get current user
        User currentUser = getCurrentUser();

        // Create new cash register
        CashRegister cashRegister = CashRegister.builder()
                .branch(branch)
                .registerDate(LocalDate.now())
                .openingBalance(request.getOpeningBalance())
                .expectedClosingBalance(request.getOpeningBalance())
                .cashInTotal(BigDecimal.ZERO)
                .cashOutTotal(BigDecimal.ZERO)
                .salesTotal(BigDecimal.ZERO)
                .status(CashRegisterStatus.OPEN)
                .openedBy(currentUser)
                .openedAt(LocalDateTime.now())
                .notes(request.getNotes())
                .build();

        CashRegister savedRegister = cashRegisterRepository.save(cashRegister);
        log.info("Cash register opened successfully with id: {}", savedRegister.getId());

        return mapToResponse(savedRegister);
    }

    @Override
    public CashRegisterResponse closeRegister(Long registerId, CloseCashRegisterRequest request) {
        log.info("Closing cash register: {}", registerId);

        CashRegister cashRegister = getCashRegisterById(registerId);

        // Validate register is open
        if (cashRegister.getStatus() != CashRegisterStatus.OPEN) {
            throw new ValidationException("Cash register is not open");
        }

        // Get current user
        User currentUser = getCurrentUser();

        // Update register
        cashRegister.setClosingBalance(request.getClosingBalance());
        cashRegister.setStatus(CashRegisterStatus.CLOSED);
        cashRegister.setClosedBy(currentUser);
        cashRegister.setClosedAt(LocalDateTime.now());
        if (request.getNotes() != null) {
            cashRegister.setNotes(cashRegister.getNotes() + "\n" + request.getNotes());
        }

        // Check if balanced
        BigDecimal discrepancy = cashRegister.getDiscrepancy();
        if (discrepancy.compareTo(BigDecimal.ZERO) == 0) {
            cashRegister.setStatus(CashRegisterStatus.BALANCED);
        }

        CashRegister savedRegister = cashRegisterRepository.save(cashRegister);
        log.info("Cash register closed successfully. Discrepancy: {}", discrepancy);

        return mapToResponse(savedRegister);
    }

    @Override
    public CashRegisterResponse recordCashIn(Long registerId, CashTransactionRequest request) {
        log.info("Recording cash in for register: {}", registerId);

        CashRegister cashRegister = getCashRegisterById(registerId);

        // Validate register is open
        if (cashRegister.getStatus() != CashRegisterStatus.OPEN) {
            throw new ValidationException("Cash register is not open");
        }

        // Get current user
        User currentUser = getCurrentUser();

        // Create transaction
        CashRegisterTransaction transaction = CashRegisterTransaction.builder()
                .cashRegister(cashRegister)
                .type(request.getType())
                .amount(request.getAmount())
                .description(request.getDescription())
                .category(request.getCategory())
                .timestamp(LocalDateTime.now())
                .user(currentUser)
                .build();

        transactionRepository.save(transaction);

        // Update cash register totals
        if (request.getType() == CashRegisterTransactionType.SALE) {
            cashRegister.setSalesTotal(cashRegister.getSalesTotal().add(request.getAmount()));
        } else {
            cashRegister.setCashInTotal(cashRegister.getCashInTotal().add(request.getAmount()));
        }
        cashRegister.setExpectedClosingBalance(
                cashRegister.getOpeningBalance()
                        .add(cashRegister.getCashInTotal())
                        .add(cashRegister.getSalesTotal())
                        .subtract(cashRegister.getCashOutTotal())
        );

        // Create cash book entry
        createCashBookEntry(cashRegister, transaction, request.getAmount(), BigDecimal.ZERO);

        CashRegister savedRegister = cashRegisterRepository.save(cashRegister);
        log.info("Cash in recorded successfully. Amount: {}", request.getAmount());

        return mapToResponse(savedRegister);
    }

    @Override
    public CashRegisterResponse recordCashOut(Long registerId, CashTransactionRequest request) {
        log.info("Recording cash out for register: {}", registerId);

        CashRegister cashRegister = getCashRegisterById(registerId);

        // Validate register is open
        if (cashRegister.getStatus() != CashRegisterStatus.OPEN) {
            throw new ValidationException("Cash register is not open");
        }

        // Get current user
        User currentUser = getCurrentUser();

        // Create transaction
        CashRegisterTransaction transaction = CashRegisterTransaction.builder()
                .cashRegister(cashRegister)
                .type(request.getType())
                .amount(request.getAmount())
                .description(request.getDescription())
                .category(request.getCategory())
                .timestamp(LocalDateTime.now())
                .user(currentUser)
                .build();

        transactionRepository.save(transaction);

        // Update cash register totals
        cashRegister.setCashOutTotal(cashRegister.getCashOutTotal().add(request.getAmount()));
        cashRegister.setExpectedClosingBalance(
                cashRegister.getOpeningBalance()
                        .add(cashRegister.getCashInTotal())
                        .add(cashRegister.getSalesTotal())
                        .subtract(cashRegister.getCashOutTotal())
        );

        // Create cash book entry
        createCashBookEntry(cashRegister, transaction, BigDecimal.ZERO, request.getAmount());

        CashRegister savedRegister = cashRegisterRepository.save(cashRegister);
        log.info("Cash out recorded successfully. Amount: {}", request.getAmount());

        return mapToResponse(savedRegister);
    }

    @Override
    public CashRegisterResponse depositToBank(Long registerId, BankDepositRequest request) {
        log.info("Depositing to bank for register: {}", registerId);

        CashRegister cashRegister = getCashRegisterById(registerId);

        // Validate register is closed
        if (cashRegister.getStatus() == CashRegisterStatus.OPEN) {
            throw new ValidationException("Cash register must be closed before depositing to bank");
        }

        // Validate bank exists
        Bank bank = bankRepository.findById(request.getBankId())
                .orElseThrow(() -> new ResourceNotFoundException("Bank not found with id: " + request.getBankId()));

        // Create bank data entry
        BankData bankData = BankData.builder()
                .bank(bank)
                .bankName(bank.getBankName())
                .transactionDate(LocalDate.now())
                .creditAmount(request.getAmount())
                .debitAmount(BigDecimal.ZERO)
                .description("Cash deposit from register #" + cashRegister.getId())
                .build();

        bankDataRepository.save(bankData);

        // Update bank balance
        bank.setCurrentBalance(bank.getCurrentBalance().add(request.getAmount()));
        bankRepository.save(bank);

        // Update cash register
        cashRegister.setBank(bank);
        cashRegister.setDepositedAmount(request.getAmount());
        cashRegister.setDepositedAt(LocalDateTime.now());
        cashRegister.setStatus(CashRegisterStatus.DEPOSITED);
        if (request.getNotes() != null) {
            cashRegister.setNotes(cashRegister.getNotes() + "\n" + request.getNotes());
        }

        CashRegister savedRegister = cashRegisterRepository.save(cashRegister);
        log.info("Cash deposited to bank successfully. Amount: {}", request.getAmount());

        return mapToResponse(savedRegister);
    }

    @Override
    @Transactional(readOnly = true)
    public CashRegisterResponse getCurrentRegister(Long branchId) {
        log.info("Getting current open register for branch: {}", branchId);

        CashRegister cashRegister = cashRegisterRepository.findOpenRegisterByBranch(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("No open cash register found for branch: " + branchId));

        return mapToResponse(cashRegister);
    }

    @Override
    @Transactional(readOnly = true)
    public CashRegisterResponse getRegisterById(Long registerId) {
        log.info("Getting cash register by id: {}", registerId);

        CashRegister cashRegister = getCashRegisterById(registerId);
        return mapToResponse(cashRegister);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CashRegisterResponse> getAllRegisters(Pageable pageable) {
        log.info("Getting all cash registers with pagination");

        return cashRegisterRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CashRegisterResponse> getRegistersByBranch(Long branchId, Pageable pageable) {
        log.info("Getting cash registers for branch: {}", branchId);

        return cashRegisterRepository.findAllByBranch(branchId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CashRegisterResponse> getRegistersByDateRange(Long branchId, LocalDate startDate, LocalDate endDate) {
        log.info("Getting cash registers for branch: {} between {} and {}", branchId, startDate, endDate);

        return cashRegisterRepository.findByBranchAndDateRange(branchId, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CashRegisterTransactionResponse> getRegisterTransactions(Long registerId) {
        log.info("Getting transactions for register: {}", registerId);

        // Verify register exists
        getCashRegisterById(registerId);

        return transactionRepository.findAllByRegisterId(registerId)
                .stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CashRegisterSummaryResponse getDailySummary(Long branchId, LocalDate date) {
        log.info("Getting daily summary for branch: {} on date: {}", branchId, date);

        // Get all registers for the date
        List<CashRegister> registers = cashRegisterRepository.findByBranchAndDateRange(branchId, date, date);

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));

        // Calculate totals
        BigDecimal totalOpeningBalance = registers.stream()
                .map(CashRegister::getOpeningBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalClosingBalance = registers.stream()
                .map(CashRegister::getClosingBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSales = registers.stream()
                .map(CashRegister::getSalesTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCashIn = registers.stream()
                .map(CashRegister::getCashInTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCashOut = registers.stream()
                .map(CashRegister::getCashOutTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDiscrepancies = registers.stream()
                .map(CashRegister::getDiscrepancy)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long openCount = registers.stream()
                .filter(r -> r.getStatus() == CashRegisterStatus.OPEN)
                .count();

        long closedCount = registers.stream()
                .filter(r -> r.getStatus() != CashRegisterStatus.OPEN)
                .count();

        return CashRegisterSummaryResponse.builder()
                .date(date)
                .branchId(branchId)
                .branchName(branch.getBranchName())
                .totalRegisters(registers.size())
                .openRegisters((int) openCount)
                .closedRegisters((int) closedCount)
                .totalOpeningBalance(totalOpeningBalance)
                .totalClosingBalance(totalClosingBalance)
                .totalSales(totalSales)
                .totalCashIn(totalCashIn)
                .totalCashOut(totalCashOut)
                .totalDiscrepancies(totalDiscrepancies)
                .build();
    }

    @Override
    public void deleteRegister(Long registerId) {
        log.info("Deleting cash register: {}", registerId);

        CashRegister cashRegister = getCashRegisterById(registerId);

        // Validate register can be deleted (not deposited)
        if (cashRegister.getStatus() == CashRegisterStatus.DEPOSITED) {
            throw new ValidationException("Cannot delete a deposited cash register");
        }

        cashRegisterRepository.delete(cashRegister);
        log.info("Cash register deleted successfully");
    }

    // Helper methods

    private CashRegister getCashRegisterById(Long registerId) {
        return cashRegisterRepository.findById(registerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cash register not found with id: " + registerId));
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private void createCashBookEntry(CashRegister cashRegister, CashRegisterTransaction transaction, 
                                     BigDecimal debitAmount, BigDecimal creditAmount) {
        // Get last balance for the branch
        List<BigDecimal> lastBalances = cashBookRepository.findLastBalanceByBranch(cashRegister.getBranch().getId());
        BigDecimal lastBalance = (lastBalances != null && !lastBalances.isEmpty()) ? lastBalances.get(0) : BigDecimal.ZERO;

        BigDecimal runningBalance = lastBalance.add(debitAmount).subtract(creditAmount);

        CashBook cashBook = CashBook.builder()
                .branch(cashRegister.getBranch())
                .transactionDate(LocalDate.now())
                .debitAmount(debitAmount)
                .creditAmount(creditAmount)
                .runningBalance(runningBalance)
                .description(transaction.getDescription())
                .category(transaction.getCategory())
                .user(transaction.getUser())
                .build();

        cashBookRepository.save(cashBook);

        // Link cash book entry to transaction
        transaction.setCashBookEntry(cashBook);
        transactionRepository.save(transaction);
    }

    private CashRegisterResponse mapToResponse(CashRegister cashRegister) {
        // Get transactions
        List<CashRegisterTransactionResponse> transactions = transactionRepository
                .findAllByRegisterId(cashRegister.getId())
                .stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());

        return CashRegisterResponse.builder()
                .id(cashRegister.getId())
                .registerDate(cashRegister.getRegisterDate())
                .status(cashRegister.getStatus())
                .branchId(cashRegister.getBranch().getId())
                .branchName(cashRegister.getBranch().getBranchName())
                .openingBalance(cashRegister.getOpeningBalance())
                .closingBalance(cashRegister.getClosingBalance())
                .expectedClosingBalance(cashRegister.getExpectedClosingBalance())
                .discrepancy(cashRegister.getDiscrepancy())
                .cashInTotal(cashRegister.getCashInTotal())
                .cashOutTotal(cashRegister.getCashOutTotal())
                .salesTotal(cashRegister.getSalesTotal())
                .depositedBankId(cashRegister.getBank() != null ? cashRegister.getBank().getId() : null)
                .depositedBankName(cashRegister.getBank() != null ? cashRegister.getBank().getBankName() : null)
                .depositedAt(cashRegister.getDepositedAt())
                .openedById(cashRegister.getOpenedBy().getId())
                .openedByName(cashRegister.getOpenedBy().getFullName())
                .openedAt(cashRegister.getOpenedAt())
                .closedById(cashRegister.getClosedBy() != null ? cashRegister.getClosedBy().getId() : null)
                .closedByName(cashRegister.getClosedBy() != null ? 
                        cashRegister.getClosedBy().getFullName() : null)
                .closedAt(cashRegister.getClosedAt())
                .notes(cashRegister.getNotes())
                .transactions(transactions)
                .createdAt(cashRegister.getCreatedAt())
                .updatedAt(cashRegister.getUpdatedAt())
                .build();
    }

    private CashRegisterTransactionResponse mapToTransactionResponse(CashRegisterTransaction transaction) {
        return CashRegisterTransactionResponse.builder()
                .id(transaction.getId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .category(transaction.getCategory())
                .timestamp(transaction.getTimestamp())
                .userId(transaction.getUser().getId())
                .userName(transaction.getUser().getFullName())
                .cashBookId(transaction.getCashBookEntry() != null ? transaction.getCashBookEntry().getId() : null)
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
