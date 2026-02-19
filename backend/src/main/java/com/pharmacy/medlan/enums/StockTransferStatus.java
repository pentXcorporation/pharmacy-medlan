package com.pharmacy.medlan.enums;

public enum StockTransferStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    IN_TRANSIT("In Transit"),
    RECEIVED("Received"),
    COMPLETED("Completed"),
    REJECTED("Rejected"),
    CANCELLED("Cancelled");

    private final String displayName;

    StockTransferStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}