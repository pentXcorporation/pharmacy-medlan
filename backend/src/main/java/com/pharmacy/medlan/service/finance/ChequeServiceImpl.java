package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.dto.request.finance.CreateChequeRequest;
import com.pharmacy.medlan.dto.response.finance.ChequeResponse;
import com.pharmacy.medlan.enums.ChequeStatus;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.exception.ValidationException;
import com.pharmacy.medlan.model.finance.Bank;
import com.pharmacy.medlan.model.finance.BankData;
import com.pharmacy.medlan.model.finance.IncomingCheque;
import com.pharmacy.medlan.model.pos.Customer;
import com.pharmacy.medlan.model.supplier.Supplier;
import com.pharmacy.medlan.repository.finance.BankDataRepository;
import com.pharmacy.medlan.repository.finance.BankRepository;
import com.pharmacy.medlan.repository.finance.IncomingChequeRepository;
import com.pharmacy.medlan.repository.pos.CustomerRepository;
import com.pharmacy.medlan.repository.supplier.SupplierRepository;
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

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChequeServiceImpl implements ChequeService {

    private final IncomingChequeRepository chequeRepository;
    private final BankRepository bankRepository;
    private final BankDataRepository bankDataRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;

    @Override
    public ChequeResponse createCheque(CreateChequeRequest request) {
        log.info("Creating new cheque: {}", request.getChequeNumber());

        // Validate cheque number uniqueness
        if (chequeRepository.findByChequeNumber(request.getChequeNumber()).isPresent()) {
            throw new ValidationException("Cheque number already exists: " + request.getChequeNumber());
        }

        // Validate bank
        Bank bank = bankRepository.findById(request.getBankId())
            .orElseThrow(() -> new ResourceNotFoundException("Bank not found with id: " + request.getBankId()));

        IncomingCheque cheque = IncomingCheque.builder()
            .chequeNumber(request.getChequeNumber())
            .amount(request.getAmount())
            .chequeDate(request.getChequeDate())
            .depositDate(request.getDepositDate())
            .clearanceDate(request.getClearanceDate())
            .bank(bank)
            .bankName(request.getBankName() != null ? request.getBankName() : bank.getBankName())
            .status(request.getStatus() != null ? request.getStatus() : ChequeStatus.PENDING)
            .remarks(request.getRemarks())
            .referenceNumber(request.getReferenceNumber())
            .receivedFrom(request.getReceivedFrom())
            .company(request.getCompany())
            .isRecordedInBank(request.getIsRecordedInBank() != null ? request.getIsRecordedInBank() : false)
            .reconciled(false)
            .build();

        // Set customer if provided
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));
            cheque.setCustomer(customer);
        }

        // Set supplier if provided
        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));
            cheque.setSupplier(supplier);
        }

        cheque = chequeRepository.save(cheque);
        log.info("Cheque created successfully with id: {}", cheque.getId());

        return mapToResponse(cheque);
    }

    @Override
    public ChequeResponse updateCheque(Long id, CreateChequeRequest request) {
        log.info("Updating cheque with id: {}", id);

        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));

        // Validate cheque number uniqueness if changed
        if (!cheque.getChequeNumber().equals(request.getChequeNumber()) &&
            chequeRepository.findByChequeNumber(request.getChequeNumber()).isPresent()) {
            throw new ValidationException("Cheque number already exists: " + request.getChequeNumber());
        }

        // Update fields
        cheque.setChequeNumber(request.getChequeNumber());
        cheque.setAmount(request.getAmount());
        cheque.setChequeDate(request.getChequeDate());
        cheque.setDepositDate(request.getDepositDate());
        cheque.setClearanceDate(request.getClearanceDate());
        cheque.setRemarks(request.getRemarks());
        cheque.setReferenceNumber(request.getReferenceNumber());
        cheque.setReceivedFrom(request.getReceivedFrom());
        cheque.setCompany(request.getCompany());

        if (request.getStatus() != null) {
            cheque.setStatus(request.getStatus());
        }

        cheque = chequeRepository.save(cheque);
        log.info("Cheque updated successfully: {}", id);

        return mapToResponse(cheque);
    }

    @Override
    @Transactional(readOnly = true)
    public ChequeResponse getChequeById(Long id) {
        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));
        return mapToResponse(cheque);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChequeResponse> getAllCheques(
            ChequeStatus status,
            Long bankId,
            Long customerId,
            Long supplierId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {
        
        // TODO: Implement custom query with filters using Specification
        Page<IncomingCheque> cheques;
        
        if (status != null) {
            cheques = chequeRepository.findAll(pageable);
        } else if (bankId != null) {
            cheques = chequeRepository.findAll(pageable);
        } else {
            cheques = chequeRepository.findAll(pageable);
        }
        
        return cheques.map(this::mapToResponse);
    }

    @Override
    public ChequeResponse updateChequeStatus(Long id, ChequeStatus status) {
        log.info("Updating cheque status to {} for id: {}", status, id);

        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));

        cheque.setStatus(status);
        cheque = chequeRepository.save(cheque);

        return mapToResponse(cheque);
    }

    @Override
    public ChequeResponse depositCheque(Long id, LocalDate depositDate) {
        log.info("Marking cheque as deposited: {}", id);

        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));

        if (cheque.getStatus() != ChequeStatus.PENDING) {
            throw new ValidationException("Only pending cheques can be deposited");
        }

        cheque.setStatus(ChequeStatus.DEPOSITED);
        cheque.setDepositDate(depositDate);
        cheque = chequeRepository.save(cheque);

        log.info("Cheque deposited successfully: {}", id);
        return mapToResponse(cheque);
    }

    @Override
    public ChequeResponse clearCheque(Long id, LocalDate clearanceDate) {
        log.info("Clearing cheque: {}", id);

        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));

        if (cheque.getStatus() != ChequeStatus.DEPOSITED) {
            throw new ValidationException("Only deposited cheques can be cleared");
        }

        cheque.setStatus(ChequeStatus.CLEARED);
        cheque.setClearanceDate(clearanceDate);

        // Create bank transaction if not already recorded
        if (!cheque.getIsRecordedInBank()) {
            BankData bankTransaction = createBankTransaction(cheque, clearanceDate);
            cheque.setBankTransaction(bankTransaction);
            cheque.setIsRecordedInBank(true);
        }

        cheque = chequeRepository.save(cheque);

        log.info("Cheque cleared successfully: {}", id);
        return mapToResponse(cheque);
    }

    @Override
    public ChequeResponse bounceCheque(Long id, String reason, LocalDate bounceDate) {
        log.info("Marking cheque as bounced: {}", id);

        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));

        cheque.setStatus(ChequeStatus.BOUNCED);
        cheque.setBounceReason(reason);
        cheque.setBounceDate(bounceDate != null ? bounceDate : LocalDate.now());

        // Reverse bank transaction if it was recorded
        if (cheque.getIsRecordedInBank() && cheque.getBankTransaction() != null) {
            reverseBankTransaction(cheque);
        }

        cheque = chequeRepository.save(cheque);

        log.info("Cheque bounced: {}", id);
        return mapToResponse(cheque);
    }

    @Override
    public ChequeResponse cancelCheque(Long id, String reason) {
        log.info("Cancelling cheque: {}", id);

        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));

        cheque.setStatus(ChequeStatus.CANCELLED);
        cheque.setRemarks(cheque.getRemarks() != null ? 
            cheque.getRemarks() + "\nCancellation Reason: " + reason : 
            "Cancellation Reason: " + reason);

        cheque = chequeRepository.save(cheque);

        log.info("Cheque cancelled: {}", id);
        return mapToResponse(cheque);
    }

    @Override
    public ChequeResponse reconcileCheque(Long id) {
        log.info("Reconciling cheque: {}", id);

        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));

        if (cheque.getStatus() != ChequeStatus.CLEARED) {
            throw new ValidationException("Only cleared cheques can be reconciled");
        }

        cheque.setReconciled(true);
        cheque.setReconciliationDate(LocalDate.now());
        cheque = chequeRepository.save(cheque);

        log.info("Cheque reconciled: {}", id);
        return mapToResponse(cheque);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getChequeStatistics() {
        log.info("Fetching cheque statistics");

        List<IncomingCheque> allCheques = chequeRepository.findAll();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCheques", allCheques.size());
        
        BigDecimal totalAmount = allCheques.stream()
            .map(IncomingCheque::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalAmount", totalAmount);

        BigDecimal pendingAmount = allCheques.stream()
            .filter(c -> c.getStatus() == ChequeStatus.PENDING)
            .map(IncomingCheque::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("pendingAmount", pendingAmount);

        BigDecimal clearedAmount = allCheques.stream()
            .filter(c -> c.getStatus() == ChequeStatus.CLEARED)
            .map(IncomingCheque::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("clearedAmount", clearedAmount);

        long bouncedCount = allCheques.stream()
            .filter(c -> c.getStatus() == ChequeStatus.BOUNCED)
            .count();
        stats.put("bouncedCount", bouncedCount);

        BigDecimal bouncedAmount = allCheques.stream()
            .filter(c -> c.getStatus() == ChequeStatus.BOUNCED)
            .map(IncomingCheque::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("bouncedAmount", bouncedAmount);

        long depositedCount = allCheques.stream()
            .filter(c -> c.getStatus() == ChequeStatus.DEPOSITED)
            .count();
        stats.put("depositedCount", depositedCount);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getChequeStatisticsByDateRange(LocalDate startDate, LocalDate endDate) {
        List<IncomingCheque> cheques = chequeRepository.findByChequeDateBetween(startDate, endDate);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCheques", cheques.size());
        
        BigDecimal totalAmount = cheques.stream()
            .map(IncomingCheque::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalAmount", totalAmount);

        return stats;
    }

    @Override
    public void deleteCheque(Long id) {
        log.info("Deleting cheque: {}", id);

        IncomingCheque cheque = chequeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cheque not found with id: " + id));

        if (cheque.getStatus() == ChequeStatus.CLEARED) {
            throw new ValidationException("Cannot delete cleared cheques");
        }

        chequeRepository.delete(cheque);
        log.info("Cheque deleted: {}", id);
    }

    private BankData createBankTransaction(IncomingCheque cheque, LocalDate transactionDate) {
        BankData bankData = BankData.builder()
            .bank(cheque.getBank())
            .bankName(cheque.getBankName())
            .creditAmount(cheque.getAmount())
            .debitAmount(BigDecimal.ZERO)
            .chequeNumber(cheque.getChequeNumber())
            .transactionDate(transactionDate)
            .actualDate(LocalDate.now())
            .description("Cheque cleared: " + cheque.getChequeNumber() + 
                        (cheque.getReceivedFrom() != null ? " from " + cheque.getReceivedFrom() : ""))
            .build();

        bankData = bankDataRepository.save(bankData);

        // Update bank balance
        Bank bank = cheque.getBank();
        bank.setCurrentBalance(bank.getCurrentBalance().add(cheque.getAmount()));
        bankRepository.save(bank);

        return bankData;
    }

    private void reverseBankTransaction(IncomingCheque cheque) {
        if (cheque.getBankTransaction() != null) {
            BankData transaction = cheque.getBankTransaction();
            
            // Create reversal entry
            BankData reversal = BankData.builder()
                .bank(transaction.getBank())
                .bankName(transaction.getBankName())
                .debitAmount(transaction.getCreditAmount())
                .creditAmount(BigDecimal.ZERO)
                .chequeNumber(cheque.getChequeNumber())
                .transactionDate(LocalDate.now())
                .actualDate(LocalDate.now())
                .description("Cheque bounced - reversal: " + cheque.getChequeNumber())
                .build();

            bankDataRepository.save(reversal);

            // Update bank balance
            Bank bank = cheque.getBank();
            bank.setCurrentBalance(bank.getCurrentBalance().subtract(cheque.getAmount()));
            bankRepository.save(bank);

            cheque.setIsRecordedInBank(false);
            cheque.setBankTransaction(null);
        }
    }

    private ChequeResponse mapToResponse(IncomingCheque cheque) {
        return ChequeResponse.builder()
            .id(cheque.getId())
            .chequeNumber(cheque.getChequeNumber())
            .amount(cheque.getAmount())
            .chequeDate(cheque.getChequeDate())
            .depositDate(cheque.getDepositDate())
            .clearanceDate(cheque.getClearanceDate())
            .bankId(cheque.getBank().getId())
            .bankName(cheque.getBankName())
            .accountNumber(cheque.getBank().getAccountNumber())
            .ifscCode(cheque.getBank().getIfscCode())
            .customerId(cheque.getCustomer() != null ? cheque.getCustomer().getId() : null)
            .customerName(cheque.getCustomer() != null ? cheque.getCustomer().getCustomerName() : null)
            .supplierId(cheque.getSupplier() != null ? cheque.getSupplier().getId() : null)
            .supplierName(cheque.getSupplier() != null ? cheque.getSupplier().getSupplierName() : null)
            .receivedFrom(cheque.getReceivedFrom())
            .company(cheque.getCompany())
            .status(cheque.getStatus())
            .remarks(cheque.getRemarks())
            .referenceNumber(cheque.getReferenceNumber())
            .isRecordedInBank(cheque.getIsRecordedInBank())
            .reconciled(cheque.getReconciled())
            .reconciliationDate(cheque.getReconciliationDate())
            .bankTransactionId(cheque.getBankTransaction() != null ? cheque.getBankTransaction().getId() : null)
            .bounceReason(cheque.getBounceReason())
            .bounceDate(cheque.getBounceDate())
            .bounceCharges(cheque.getBounceCharges())
            .createdAt(cheque.getCreatedAt())
            .updatedAt(cheque.getUpdatedAt())
            .createdBy(cheque.getCreatedBy())
            .updatedBy(cheque.getLastModifiedBy()) // Fix: use getLastModifiedBy() not getUpdatedBy()
            .build();
    }
}

