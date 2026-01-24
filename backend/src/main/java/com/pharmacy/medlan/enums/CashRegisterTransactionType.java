package com.pharmacy.medlan.enums;

/**
 * Cash Register Transaction Type Enum
 */
public enum CashRegisterTransactionType {
    CASH_IN,      // Cash received (other than sales)
    CASH_OUT,     // Cash paid out
    SALE,         // Sale transaction
    REFUND,       // Refund given
    EXPENSE,      // Direct expense payment
    COLLECTION,   // Collection from debtor
    ADVANCE       // Advance payment
}
