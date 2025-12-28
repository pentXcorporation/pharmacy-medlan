package com.pharmacy.medlan.enums;

/**
 * Supported barcode formats for pharmacy products
 */
public enum BarcodeFormat {
    
    /**
     * EAN-13: European Article Number (13 digits)
     * Most common format for retail products worldwide
     */
    EAN_13("EAN-13", 13, "European Article Number - 13 digits"),
    
    /**
     * EAN-8: Shortened version for small products
     */
    EAN_8("EAN-8", 8, "European Article Number - 8 digits"),
    
    /**
     * UPC-A: Universal Product Code (North America)
     */
    UPC_A("UPC-A", 12, "Universal Product Code - 12 digits"),
    
    /**
     * CODE-128: High-density alphanumeric barcode
     * Excellent for inventory management
     */
    CODE_128("Code 128", -1, "Alphanumeric - Variable length"),
    
    /**
     * CODE-39: Alphanumeric, self-checking
     * Common in healthcare and defense
     */
    CODE_39("Code 39", -1, "Alphanumeric - Variable length"),
    
    /**
     * QR_CODE: 2D barcode for complex data
     */
    QR_CODE("QR Code", -1, "2D Matrix - Large data capacity"),
    
    /**
     * DATA_MATRIX: 2D barcode for small items
     * Used for pharmaceutical unit-dose packaging
     */
    DATA_MATRIX("Data Matrix", -1, "2D Matrix - Small form factor"),
    
    /**
     * PDF_417: 2D stacked barcode
     * Used for complex pharmaceutical data
     */
    PDF_417("PDF 417", -1, "2D Stacked - High capacity"),
    
    /**
     * ITF-14: Used for outer packaging/cases
     */
    ITF_14("ITF-14", 14, "Interleaved 2 of 5 - Shipping containers"),
    
    /**
     * GS1_DATABAR: For pharmaceutical products
     * Can encode expiry dates and batch numbers
     */
    GS1_DATABAR("GS1 DataBar", -1, "GS1 DataBar - Pharmaceutical standard");

    private final String displayName;
    private final int fixedLength;
    private final String description;

    BarcodeFormat(String displayName, int fixedLength, String description) {
        this.displayName = displayName;
        this.fixedLength = fixedLength;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getFixedLength() {
        return fixedLength;
    }

    public String getDescription() {
        return description;
    }

    public boolean isFixedLength() {
        return fixedLength > 0;
    }

    /**
     * Get ZXing compatible format
     */
    public com.google.zxing.BarcodeFormat toZxingFormat() {
        return switch (this) {
            case EAN_13 -> com.google.zxing.BarcodeFormat.EAN_13;
            case EAN_8 -> com.google.zxing.BarcodeFormat.EAN_8;
            case UPC_A -> com.google.zxing.BarcodeFormat.UPC_A;
            case CODE_128 -> com.google.zxing.BarcodeFormat.CODE_128;
            case CODE_39 -> com.google.zxing.BarcodeFormat.CODE_39;
            case QR_CODE -> com.google.zxing.BarcodeFormat.QR_CODE;
            case DATA_MATRIX -> com.google.zxing.BarcodeFormat.DATA_MATRIX;
            case PDF_417 -> com.google.zxing.BarcodeFormat.PDF_417;
            case ITF_14 -> com.google.zxing.BarcodeFormat.ITF;
            case GS1_DATABAR -> com.google.zxing.BarcodeFormat.RSS_14;
        };
    }
}
