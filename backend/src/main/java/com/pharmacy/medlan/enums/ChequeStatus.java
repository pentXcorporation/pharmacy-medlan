package com.pharmacy.medlan.enums;

public enum ChequeStatus {
    PENDING("Pending"),
    DEPOSITED("Deposited"),
    CLEARED("Cleared"),
    BOUNCED("Bounced"),
    CANCELLED("Cancelled"),
    REPLACED("Replaced");

    private final String displayName;

    ChequeStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}