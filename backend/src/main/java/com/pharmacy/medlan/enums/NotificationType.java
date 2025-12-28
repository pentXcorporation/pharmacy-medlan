package com.pharmacy.medlan.enums;

public enum NotificationType {
    // Inventory Alerts
    LOW_STOCK_ALERT("Low Stock Alert"),
    CRITICAL_STOCK_ALERT("Critical Stock Alert"),
    OUT_OF_STOCK_ALERT("Out of Stock Alert"),
    EXPIRY_ALERT("Expiry Alert"),
    EXPIRED_PRODUCT_ALERT("Expired Product Alert"),
    NEAR_EXPIRY_ALERT("Near Expiry Alert"),
    
    // Sales & POS
    SALE("Sale Notification"),
    SALE_RETURN("Sale Return"),
    SALE_VOID("Sale Void"),
    
    // Inventory Operations
    GRN("GRN Notification"),
    STOCK_TRANSFER("Stock Transfer"),
    STOCK_ADJUSTMENT("Stock Adjustment"),
    
    // Financial
    PAYMENT_DUE("Payment Due"),
    PAYMENT_RECEIVED("Payment Received"),
    INVOICE_GENERATED("Invoice Generated"),
    CREDIT_LIMIT_EXCEEDED("Credit Limit Exceeded"),
    
    // User & System
    USER_REGISTRATION("User Registration"),
    PASSWORD_RESET("Password Reset"),
    ROLE_CHANGED("Role Changed"),
    SYSTEM_ALERT("System Alert"),
    MAINTENANCE("System Maintenance"),
    
    // Reports
    REPORT_GENERATED("Report Generated"),
    SCHEDULED_REPORT("Scheduled Report"),
    
    // Legacy/General
    LOW_STOCK("Low Stock Alert"),
    RETURN("Return Notification"),
    SYSTEM("System Notification"),
    USER("User Notification");

    private final String displayName;

    NotificationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}
