package com.pharmacy.medlan.enums;

/**
 * Cash Register Status Enum
 */
public enum CashRegisterStatus {
    OPEN,       // Register is currently open for transactions
    CLOSED,     // Register is closed for the day
    BALANCED,   // Register is closed and balanced (no discrepancy)
    DEPOSITED   // Cash has been deposited to bank
}
