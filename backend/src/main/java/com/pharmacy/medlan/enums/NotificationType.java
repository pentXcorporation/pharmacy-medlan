package com.pharmacy.medlan.enums;

public enum NotificationType {
    LOW_STOCK("Low Stock Alert"),
    EXPIRY_ALERT("Expiry Alert"),
    SALE("Sale Notification"),
    RETURN("Return Notification"),
    GRN("GRN Notification"),
    PAYMENT_DUE("Payment Due"),
    SYSTEM("System Notification"),
    USER("User Notification");

    private final String displayName;

    NotificationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}
