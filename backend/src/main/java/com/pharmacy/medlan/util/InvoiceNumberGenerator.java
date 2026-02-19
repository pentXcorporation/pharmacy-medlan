package com.pharmacy.medlan.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class InvoiceNumberGenerator {

    private final AtomicLong sequence = new AtomicLong(0);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    /**
     * Generate a unique invoice number with format: INV-YYYYMMDD-XXXXX
     */
    public String generateInvoiceNumber() {
        return generateNumber("INV");
    }

    /**
     * Generate a unique payment number with format: PAY-YYYYMMDD-XXXXX
     */
    public String generatePaymentNumber() {
        return generateNumber("PAY");
    }

    /**
     * Generate a unique GRN number with format: GRN-YYYYMMDD-XXXXX
     */
    public String generateGRNNumber() {
        return generateNumber("GRN");
    }

    /**
     * Generate a unique purchase order number with format: PO-YYYYMMDD-XXXXX
     */
    public String generatePurchaseOrderNumber() {
        return generateNumber("PO");
    }

    /**
     * Generate a unique return number with format: RET-YYYYMMDD-XXXXX
     */
    public String generateReturnNumber() {
        return generateNumber("RET");
    }

    /**
     * Generate a number with custom prefix
     */
    public String generateNumber(String prefix) {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        long seq = sequence.incrementAndGet();
        return String.format("%s-%s-%05d", prefix, datePart, seq);
    }

    /**
     * Generate a number with prefix and branch code
     */
    public String generateNumber(String prefix, String branchCode) {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        long seq = sequence.incrementAndGet();
        return String.format("%s-%s-%s-%05d", prefix, branchCode, datePart, seq);
    }
}
