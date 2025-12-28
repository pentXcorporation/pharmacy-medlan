package com.pharmacy.medlan.enums;

/**
 * Context for barcode/QR scanning operations.
 * Different contexts require different data and validations.
 */
public enum ScanContext {
    
    /**
     * Point of Sale - quick product lookup for billing
     */
    POS("Point of Sale", "Quick lookup for billing, includes price and stock availability"),
    
    /**
     * Goods Receiving Note - receiving inventory from suppliers
     */
    GRN("Goods Receiving", "Product info with supplier and purchase history"),
    
    /**
     * Stock Taking / Physical Inventory
     */
    STOCK_TAKING("Stock Taking", "All batch details for inventory verification"),
    
    /**
     * Stock Transfer between branches
     */
    STOCK_TRANSFER("Stock Transfer", "Batch selection for inter-branch transfer"),
    
    /**
     * Return to Vendor
     */
    RETURN_VENDOR("Return to Vendor", "Batch details for supplier returns"),
    
    /**
     * Customer Return / Sale Return
     */
    SALE_RETURN("Sale Return", "Invoice lookup and return processing"),
    
    /**
     * Expiry Check
     */
    EXPIRY_CHECK("Expiry Check", "Batch expiry information and alerts"),
    
    /**
     * Price Check / Label Printing
     */
    PRICE_CHECK("Price Check", "Price information for customer or label printing"),
    
    /**
     * Prescription Dispensing
     */
    DISPENSING("Dispensing", "Drug schedule and prescription requirements"),
    
    /**
     * Product Verification / Authentication
     */
    VERIFICATION("Verification", "Authenticity verification via QR code");

    private final String displayName;
    private final String description;

    ScanContext(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
