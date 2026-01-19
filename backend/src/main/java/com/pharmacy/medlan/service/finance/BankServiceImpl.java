package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.dto.response.finance.BankResponse;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.finance.Bank;
import com.pharmacy.medlan.repository.finance.BankRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BankServiceImpl implements BankService {

    private final BankRepository bankRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<BankResponse> getAllBanks(Pageable pageable) {
        return bankRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BankResponse> getAllActiveBanks() {
        return bankRepository.findByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BankResponse getBankById(Long id) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank not found with id: " + id));
        return toResponse(bank);
    }

    @Override
    @Transactional
    public BankResponse createBank(Bank bank) {
        if (bankRepository.existsByAccountNumber(bank.getAccountNumber())) {
            throw new IllegalArgumentException("Account number already exists: " + bank.getAccountNumber());
        }
        
        if (bank.getIsActive() == null) {
            bank.setIsActive(true);
        }
        
        // Always set currentBalance to openingBalance for new accounts
        BigDecimal openingBalance = bank.getOpeningBalance() != null ? 
            bank.getOpeningBalance() : BigDecimal.ZERO;
        bank.setCurrentBalance(openingBalance);
        
        Bank savedBank = bankRepository.save(bank);
        log.info("Bank created: {} - {} with balance: {}", 
            savedBank.getBankName(), savedBank.getAccountNumber(), savedBank.getCurrentBalance());
        return toResponse(savedBank);
    }

    @Override
    @Transactional
    public BankResponse updateBank(Long id, Bank bankDetails) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank not found with id: " + id));

        // Check if account number is being changed and if it already exists
        if (!bank.getAccountNumber().equals(bankDetails.getAccountNumber()) &&
            bankRepository.existsByAccountNumber(bankDetails.getAccountNumber())) {
            throw new IllegalArgumentException("Account number already exists: " + bankDetails.getAccountNumber());
        }

        bank.setBankName(bankDetails.getBankName());
        bank.setAccountNumber(bankDetails.getAccountNumber());
        bank.setIfscCode(bankDetails.getIfscCode());
        bank.setBranchName(bankDetails.getBranchName());
        bank.setAccountHolderName(bankDetails.getAccountHolderName());
        bank.setAccountType(bankDetails.getAccountType());
        bank.setOpeningBalance(bankDetails.getOpeningBalance());
        
        if (bankDetails.getIsActive() != null) {
            bank.setIsActive(bankDetails.getIsActive());
        }

        Bank updatedBank = bankRepository.save(bank);
        log.info("Bank updated: {}", updatedBank.getBankName());
        return toResponse(updatedBank);
    }

    @Override
    @Transactional
    public void deleteBank(Long id) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank not found with id: " + id));
        
        // Instead of deleting, deactivate the bank
        bank.setIsActive(false);
        bankRepository.save(bank);
        log.info("Bank deactivated: {}", bank.getBankName());
    }

    @Override
    @Transactional
    public void updateBalance(Long id, BigDecimal amount) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank not found with id: " + id));
        
        bank.setCurrentBalance(bank.getCurrentBalance().add(amount));
        bankRepository.save(bank);
        log.info("Bank balance updated: {} - New Balance: {}", bank.getBankName(), bank.getCurrentBalance());
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getTotalBalance() {
        return bankRepository.calculateTotalBalance();
    }

    private BankResponse toResponse(Bank bank) {
        return BankResponse.builder()
                .id(bank.getId())
                .bankName(bank.getBankName())
                .accountNumber(bank.getAccountNumber())
                .ifscCode(bank.getIfscCode())
                .branchName(bank.getBranchName())
                .accountHolderName(bank.getAccountHolderName())
                .accountType(bank.getAccountType())
                .currentBalance(bank.getCurrentBalance())
                .openingBalance(bank.getOpeningBalance())
                .isActive(bank.getIsActive())
                .createdAt(bank.getCreatedAt())
                .updatedAt(bank.getUpdatedAt())
                .build();
    }
}
