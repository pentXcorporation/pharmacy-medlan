package com.pharmacy.medlan.mapper;

import com.pharmacy.medlan.dto.request.finance.CreateBankRequest;
import com.pharmacy.medlan.dto.request.finance.CreateCashBookEntryRequest;
import com.pharmacy.medlan.dto.response.finance.BankResponse;
import com.pharmacy.medlan.dto.response.finance.CashBookResponse;
import com.pharmacy.medlan.dto.response.finance.ChequeResponse;
import com.pharmacy.medlan.model.finance.Bank;
import com.pharmacy.medlan.model.finance.CashBook;
import com.pharmacy.medlan.model.finance.IncomingCheque;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FinanceMapper {

    public BankResponse toBankResponse(Bank bank) {
        if (bank == null) return null;
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

    public List<BankResponse> toBankResponseList(List<Bank> banks) {
        return banks.stream().map(this::toBankResponse).collect(Collectors.toList());
    }

    public CashBookResponse toCashBookResponse(CashBook cashBook) {
        if (cashBook == null) return null;
        return CashBookResponse.builder()
                .id(cashBook.getId())
                .transactionDate(cashBook.getTransactionDate())
                .transactionType(cashBook.getTransactionType() != null
                        ? cashBook.getTransactionType().getTypeName() : null)
                .description(cashBook.getDescription())
                .debitAmount(cashBook.getDebitAmount())
                .creditAmount(cashBook.getCreditAmount())
                .runningBalance(cashBook.getRunningBalance())
                .referenceNumber(cashBook.getReferenceNumber())
                .paymentMethod(cashBook.getPaymentMethod() != null
                        ? cashBook.getPaymentMethod().name() : null)
                .category(cashBook.getCategory())
                .branchId(cashBook.getBranch() != null ? cashBook.getBranch().getId() : null)
                .branchName(cashBook.getBranch() != null ? cashBook.getBranch().getBranchName() : null)
                .userId(cashBook.getUser() != null ? cashBook.getUser().getId() : null)
                .userName(cashBook.getUser() != null ? cashBook.getUser().getUsername() : null)
                .createdAt(cashBook.getCreatedAt())
                .build();
    }

    public List<CashBookResponse> toCashBookResponseList(List<CashBook> cashBooks) {
        return cashBooks.stream().map(this::toCashBookResponse).collect(Collectors.toList());
    }

    public ChequeResponse toChequeResponse(IncomingCheque cheque) {
        if (cheque == null) return null;
        return ChequeResponse.builder()
                .id(cheque.getId())
                .chequeNumber(cheque.getChequeNumber())
                .amount(cheque.getAmount())
                .chequeDate(cheque.getChequeDate())
                .depositDate(cheque.getDepositDate())
                .clearanceDate(cheque.getClearanceDate())
                .bankId(cheque.getBank() != null ? cheque.getBank().getId() : null)
                .bankName(cheque.getBankName())
                .customerId(cheque.getCustomer() != null ? cheque.getCustomer().getId() : null)
                .customerName(cheque.getCustomer() != null ? cheque.getCustomer().getCustomerName() : null)
                .supplierId(cheque.getSupplier() != null ? cheque.getSupplier().getId() : null)
                .supplierName(cheque.getSupplier() != null ? cheque.getSupplier().getSupplierName() : null)
                .receivedFrom(cheque.getReceivedFrom())
                .status(cheque.getStatus())
                .build();
    }

    public List<ChequeResponse> toChequeResponseList(List<IncomingCheque> cheques) {
        return cheques.stream().map(this::toChequeResponse).collect(Collectors.toList());
    }
}