package com.pharmacy.medlan.exception;

public class InsufficientStockException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InsufficientStockException(String message) {
        super(message);
    }

    public InsufficientStockException(String message, Throwable cause) {
        super(message, cause);
    }

    /** Convenience factory for stock shortage scenarios. */
    public static InsufficientStockException of(String productName, int requested, int available) {
        return new InsufficientStockException(
                String.format("Insufficient stock for '%s': requested %d, available %d",
                        productName, requested, available));
    }
}