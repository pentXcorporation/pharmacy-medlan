package com.pharmacy.medlan.enums;

public enum TransactionType {
    GRN_RECEIVED("GRN Received", true),
    SALE("Sale", false),
    SALE_RETURN("Sale Return", true),
    PURCHASE_RETURN("Purchase Return (RGRN)", false),
    STOCK_ADJUSTMENT("Stock Adjustment", null),
    STOCK_TRANSFER_OUT("Stock Transfer Out", false),
    STOCK_TRANSFER_IN("Stock Transfer In", true),
    EXPIRED_STOCK("Expired Stock Removal", false),
    DAMAGED_STOCK("Damaged Stock Removal", false);

    private final String displayName;
    private final Boolean isIncrease; // true = increase, false = decrease, null = adjustment

    TransactionType(String displayName, Boolean isIncrease) {
        this.displayName = displayName;
        this.isIncrease = isIncrease;
    }

    public String getDisplayName() { return displayName; }
    public Boolean getIsIncrease() { return isIncrease; }
}