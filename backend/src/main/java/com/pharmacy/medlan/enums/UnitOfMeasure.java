package com.pharmacy.medlan.enums;

public enum UnitOfMeasure {
    PIECE("Piece", "pc"),
    TABLET("Tablet", "tab"),
    CAPSULE("Capsule", "cap"),
    BOTTLE("Bottle", "btl"),
    BOX("Box", "box"),
    STRIP("Strip", "strip"),
    VIAL("Vial", "vial"),
    AMPOULE("Ampoule", "amp"),
    TUBE("Tube", "tube"),
    SACHET("Sachet", "sac"),
    ML("Milliliter", "ml"),
    LITER("Liter", "L"),
    GRAM("Gram", "g"),
    KILOGRAM("Kilogram", "kg"),
    MICROGRAM("Microgram", "mcg"),
    MILLIGRAM("Milligram", "mg");

    private final String displayName;
    private final String abbreviation;

    UnitOfMeasure(String displayName, String abbreviation) {
        this.displayName = displayName;
        this.abbreviation = abbreviation;
    }

    public String getDisplayName() { return displayName; }
    public String getAbbreviation() { return abbreviation; }
}