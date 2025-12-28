package com.pharmacy.medlan.validation.validator;

import com.pharmacy.medlan.validation.annotation.ValidEmail;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Enhanced email validator with additional security features.
 * 
 * Validates:
 * - RFC 5322 compliant email format
 * - Domain validation
 * - Disposable email blocking
 * - Length constraints
 */
public class EmailValidator implements ConstraintValidator<ValidEmail, String> {

    // RFC 5322 compliant email pattern (simplified but strict)
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );
    
    // Common disposable email domains (partial list - extend as needed)
    private static final Set<String> DISPOSABLE_DOMAINS = Set.of(
            "tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com",
            "10minutemail.com", "fakeinbox.com", "trashmail.com", "temp-mail.org",
            "dispostable.com", "yopmail.com", "sharklasers.com", "guerrillamail.info",
            "grr.la", "pokemail.net", "spam4.me", "anonymbox.net", "getairmail.com",
            "mailnesia.com", "tempr.email", "discard.email", "discardmail.com",
            "tempail.com", "tmails.net", "emailondeck.com", "getnada.com",
            "mohmal.com", "tempinbox.com", "mailcatch.com", "spamgourmet.com"
    );

    private boolean allowEmpty;
    private boolean blockDisposable;
    private int maxLength;
    private Set<String> allowedDomains;

    @Override
    public void initialize(ValidEmail constraintAnnotation) {
        this.allowEmpty = constraintAnnotation.allowEmpty();
        this.blockDisposable = constraintAnnotation.blockDisposable();
        this.maxLength = constraintAnnotation.maxLength();
        this.allowedDomains = new HashSet<>(Arrays.asList(constraintAnnotation.allowedDomains()));
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.trim().isEmpty()) {
            return allowEmpty;
        }

        String cleanedEmail = email.trim().toLowerCase();

        // Check length
        if (cleanedEmail.length() > maxLength) {
            customMessage(context, "Email must not exceed " + maxLength + " characters");
            return false;
        }

        // Check basic pattern
        if (!EMAIL_PATTERN.matcher(cleanedEmail).matches()) {
            customMessage(context, "Invalid email format");
            return false;
        }

        // Extract domain
        String domain = extractDomain(cleanedEmail);
        if (domain == null) {
            return false;
        }

        // Check domain whitelist if specified
        if (!allowedDomains.isEmpty() && !allowedDomains.contains(domain)) {
            customMessage(context, "Email domain not allowed");
            return false;
        }

        // Check disposable email
        if (blockDisposable && isDisposableDomain(domain)) {
            customMessage(context, "Disposable email addresses are not allowed");
            return false;
        }

        // Additional validation
        return validateEmailParts(cleanedEmail, context);
    }

    private String extractDomain(String email) {
        int atIndex = email.lastIndexOf('@');
        if (atIndex < 1 || atIndex >= email.length() - 1) {
            return null;
        }
        return email.substring(atIndex + 1);
    }

    private boolean isDisposableDomain(String domain) {
        // Check exact match
        if (DISPOSABLE_DOMAINS.contains(domain)) {
            return true;
        }
        
        // Check subdomain
        for (String disposable : DISPOSABLE_DOMAINS) {
            if (domain.endsWith("." + disposable)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean validateEmailParts(String email, ConstraintValidatorContext context) {
        int atIndex = email.lastIndexOf('@');
        String localPart = email.substring(0, atIndex);
        String domain = email.substring(atIndex + 1);

        // Local part validation
        if (localPart.length() > 64) {
            customMessage(context, "Local part of email must not exceed 64 characters");
            return false;
        }

        // No consecutive dots
        if (localPart.contains("..") || domain.contains("..")) {
            customMessage(context, "Email cannot contain consecutive dots");
            return false;
        }

        // Cannot start or end with dot
        if (localPart.startsWith(".") || localPart.endsWith(".")) {
            customMessage(context, "Email local part cannot start or end with a dot");
            return false;
        }

        // Domain must have at least one dot (TLD)
        if (!domain.contains(".")) {
            customMessage(context, "Email domain must include a TLD");
            return false;
        }

        // Domain labels validation
        String[] labels = domain.split("\\.");
        for (String label : labels) {
            if (label.isEmpty() || label.length() > 63) {
                customMessage(context, "Invalid domain label length");
                return false;
            }
            if (label.startsWith("-") || label.endsWith("-")) {
                customMessage(context, "Domain labels cannot start or end with hyphen");
                return false;
            }
        }

        // TLD must be at least 2 characters and only letters
        String tld = labels[labels.length - 1];
        if (tld.length() < 2 || !tld.matches("[a-zA-Z]+")) {
            customMessage(context, "Invalid top-level domain");
            return false;
        }

        return true;
    }

    private void customMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
    }

    /**
     * Utility method to normalize email (lowercase, trim)
     */
    public static String normalizeEmail(String email) {
        if (email == null) return null;
        return email.trim().toLowerCase();
    }

    /**
     * Utility method to mask email for display (privacy)
     * Example: john.doe@gmail.com -> jo***@gmail.com
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        
        int atIndex = email.indexOf('@');
        String localPart = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        
        if (localPart.length() <= 2) {
            return localPart.charAt(0) + "***" + domain;
        }
        
        return localPart.substring(0, 2) + "***" + domain;
    }
}
