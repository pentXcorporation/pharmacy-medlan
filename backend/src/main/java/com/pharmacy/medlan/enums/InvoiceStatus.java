package com.pharmacy.medlan.enums;

public enum InvoiceStatus {
    DRAFT("Draft"),
    ISSUED("Issued"),
    PAID("Paid"),
    PARTIALLY_PAID("Partially Paid"),
    OVERDUE("Overdue"),
    CANCELLED("Cancelled"),
    VOID("Void");

    private final String displayName;

    InvoiceStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}