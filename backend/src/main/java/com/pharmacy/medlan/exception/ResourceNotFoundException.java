package com.pharmacy.medlan.exception;

public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    /** Convenience factory: "Product not found with id: 42" */
    public static ResourceNotFoundException of(String resourceName, String fieldName, Object fieldValue) {
        return new ResourceNotFoundException(
                String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }
}