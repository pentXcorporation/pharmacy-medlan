package com.pharmacy.medlan.enums;

public enum AlertLevel {
    INFO("Information"),
    LOW("Low Priority"),
    WARNING("Warning"),
    URGENT("Urgent"),
    CRITICAL("Critical"),
    OUT_OF_STOCK("Out of Stock"),
    EXPIRED("Expired");

    private final String displayName;

    AlertLevel(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}