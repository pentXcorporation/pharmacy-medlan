package com.pharmacy.medlan.enums;

public enum DrugSchedule {
    OTC("Over The Counter - No Prescription Required", false),
    H("Schedule H - Prescription Required", true),
    H1("Schedule H1 - Prescription Required (Restricted)", true),
    X("Schedule X - Narcotic/Psychotropic (Strictly Controlled)", true),
    G("Schedule G - General Sale", false),
    C("Schedule C - Controlled Drug", true),
    C1("Schedule C1 - Controlled Drug (Restricted)", true);

    private final String description;
    private final boolean prescriptionRequired;

    DrugSchedule(String description, boolean prescriptionRequired) {
        this.description = description;
        this.prescriptionRequired = prescriptionRequired;
    }

    public String getDescription() { return description; }
    public boolean isPrescriptionRequired() { return prescriptionRequired; }
}