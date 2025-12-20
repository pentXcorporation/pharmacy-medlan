package com.pharmacy.medlan.enums;

public enum DosageForm {
    TABLET("Tablet"),
    CAPSULE("Capsule"),
    SYRUP("Syrup"),
    INJECTION("Injection"),
    DROPS("Drops"),
    CREAM("Cream"),
    OINTMENT("Ointment"),
    INHALER("Inhaler"),
    POWDER("Powder"),
    SUSPENSION("Suspension"),
    GEL("Gel"),
    LOTION("Lotion"),
    SPRAY("Spray"),
    PATCH("Patch"),
    SUPPOSITORY("Suppository");

    private final String displayName;

    DosageForm(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() { return displayName; }
}