package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.exception.BusinessRuleViolationException;
import com.pharmacy.medlan.exception.ResourceNotFoundException;
import com.pharmacy.medlan.model.finance.TransactionType;
import com.pharmacy.medlan.repository.finance.TransactionTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionTypeServiceImpl implements TransactionTypeService {

    private final TransactionTypeRepository transactionTypeRepository;

    @Override
    @Transactional
    public TransactionType createTransactionType(String typeName, String description, Boolean isIncome) {
        log.info("Creating transaction type: {}", typeName);

        transactionTypeRepository.findByTypeName(typeName)
                .ifPresent(existing -> {
                    throw new BusinessRuleViolationException("Transaction type already exists: " + typeName);
                });

        TransactionType type = TransactionType.builder()
                .typeName(typeName)
                .description(description)
                .isIncome(isIncome)
                .isActive(true)
                .build();

        return transactionTypeRepository.save(type);
    }

    @Override
    @Transactional
    public TransactionType updateTransactionType(Long id, String typeName, String description, Boolean isIncome) {
        TransactionType type = transactionTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction type not found with id: " + id));

        if (typeName != null) type.setTypeName(typeName);
        if (description != null) type.setDescription(description);
        if (isIncome != null) type.setIsIncome(isIncome);

        return transactionTypeRepository.save(type);
    }

    @Override
    public TransactionType getById(Long id) {
        return transactionTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction type not found with id: " + id));
    }

    @Override
    public TransactionType getByTypeName(String typeName) {
        return transactionTypeRepository.findByTypeName(typeName)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction type not found: " + typeName));
    }

    @Override
    public List<TransactionType> getAllTransactionTypes() {
        return transactionTypeRepository.findAll();
    }

    @Override
    public List<TransactionType> getActiveTransactionTypes() {
        return transactionTypeRepository.findByIsActiveTrue();
    }

    @Override
    public List<TransactionType> getByIncomeType(Boolean isIncome) {
        return transactionTypeRepository.findByIsIncome(isIncome);
    }

    @Override
    @Transactional
    public void deactivateTransactionType(Long id) {
        TransactionType type = transactionTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction type not found with id: " + id));
        type.setIsActive(false);
        transactionTypeRepository.save(type);
    }

    @Override
    @Transactional
    public void activateTransactionType(Long id) {
        TransactionType type = transactionTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction type not found with id: " + id));
        type.setIsActive(true);
        transactionTypeRepository.save(type);
    }
}
