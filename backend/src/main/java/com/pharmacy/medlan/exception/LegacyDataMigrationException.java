package com.pharmacy.medlan.exception;

public class LegacyDataMigrationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public LegacyDataMigrationException(String message) {
        super(message);
    }

    public LegacyDataMigrationException(String message, Throwable cause) {
        super(message, cause);
    }
}