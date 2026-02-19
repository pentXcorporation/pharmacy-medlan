package com.pharmacy.medlan.service.finance;

import com.pharmacy.medlan.model.finance.TransactionType;

import java.util.List;

public interface TransactionTypeService {

    TransactionType createTransactionType(String typeName, String description, Boolean isIncome);

    TransactionType updateTransactionType(Long id, String typeName, String description, Boolean isIncome);

    TransactionType getById(Long id);

    TransactionType getByTypeName(String typeName);

    List<TransactionType> getAllTransactionTypes();

    List<TransactionType> getActiveTransactionTypes();

    List<TransactionType> getByIncomeType(Boolean isIncome);

    void deactivateTransactionType(Long id);

    void activateTransactionType(Long id);
}
