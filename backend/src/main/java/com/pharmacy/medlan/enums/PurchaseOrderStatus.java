package com.pharmacy.medlan.enums;

public enum PurchaseOrderStatus {
    DRAFT("Draft"),
    PENDING_APPROVAL("Pending Approval"),
    APPROVED("Approved"),
    SENT("Sent to Supplier"),
    PARTIALLY_RECEIVED("Partially Received"),
    FULLY_RECEIVED("Fully Received"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    CLOSED("Closed");

    private final String displayName;

    PurchaseOrderStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}