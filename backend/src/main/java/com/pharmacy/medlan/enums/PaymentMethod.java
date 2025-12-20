package com.pharmacy.medlan.enums;

public enum PaymentMethod {
    CASH("Cash"),
    CARD("Debit/Credit Card"),
    UPI("UPI Payment"),
    CHEQUE("Cheque"),
    BANK_TRANSFER("Bank Transfer"),
    CREDIT("Credit Sale");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}