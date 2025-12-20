package com.pharmacy.medlan.enums;

public enum GRNStatus {
    DRAFT("Draft"),
    PENDING_APPROVAL("Pending Approval"),
    APPROVED("Approved"),
    RECEIVED("Received"),
    REJECTED("Rejected"),
    CANCELLED("Cancelled");

    private final String displayName;

    GRNStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}