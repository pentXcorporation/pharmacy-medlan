/**
 * Dosage Form - Matching backend DosageForm.java enum
 */
export const DOSAGE_FORM = {
  TABLET: "TABLET",
  CAPSULE: "CAPSULE",
  SYRUP: "SYRUP",
  SUSPENSION: "SUSPENSION",
  INJECTION: "INJECTION",
  CREAM: "CREAM",
  OINTMENT: "OINTMENT",
  GEL: "GEL",
  DROPS: "DROPS",
  INHALER: "INHALER",
  POWDER: "POWDER",
  SOLUTION: "SOLUTION",
  LOTION: "LOTION",
  SUPPOSITORY: "SUPPOSITORY",
  PATCH: "PATCH",
};

export const DOSAGE_FORM_LABELS = {
  [DOSAGE_FORM.TABLET]: "Tablet",
  [DOSAGE_FORM.CAPSULE]: "Capsule",
  [DOSAGE_FORM.SYRUP]: "Syrup",
  [DOSAGE_FORM.SUSPENSION]: "Suspension",
  [DOSAGE_FORM.INJECTION]: "Injection",
  [DOSAGE_FORM.CREAM]: "Cream",
  [DOSAGE_FORM.OINTMENT]: "Ointment",
  [DOSAGE_FORM.GEL]: "Gel",
  [DOSAGE_FORM.DROPS]: "Drops",
  [DOSAGE_FORM.INHALER]: "Inhaler",
  [DOSAGE_FORM.POWDER]: "Powder",
  [DOSAGE_FORM.SOLUTION]: "Solution",
  [DOSAGE_FORM.LOTION]: "Lotion",
  [DOSAGE_FORM.SUPPOSITORY]: "Suppository",
  [DOSAGE_FORM.PATCH]: "Patch",
};

export const DOSAGE_FORM_OPTIONS = Object.entries(DOSAGE_FORM_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
