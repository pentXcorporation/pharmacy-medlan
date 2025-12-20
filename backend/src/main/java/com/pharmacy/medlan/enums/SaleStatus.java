package com.pharmacy.medlan.enums;

public enum SaleStatus {
    DRAFT("Draft"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    RETURNED("Returned");

    private final String displayName;

    SaleStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}