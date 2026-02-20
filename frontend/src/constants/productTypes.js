/**
 * Product Type Constants
 * Defines all supported product types, their labels, barcode prefixes,
 * default GST rates, and descriptions.
 */

export const PRODUCT_TYPE = {
  MEDICAL: "MEDICAL",
  SUPPLEMENT: "SUPPLEMENT",
  FOOD: "FOOD",
  BABY_CARE: "BABY_CARE",
  COSMETIC: "COSMETIC",
  MEDICAL_EQUIPMENT: "MEDICAL_EQUIPMENT",
  SURGICAL: "SURGICAL",
  AYURVEDIC: "AYURVEDIC",
  HOMEOPATHIC: "HOMEOPATHIC",
  GENERAL: "GENERAL",
};

export const PRODUCT_TYPE_LABELS = {
  MEDICAL: "Medical / Pharmaceutical",
  SUPPLEMENT: "Supplements & Vitamins",
  FOOD: "Food & Beverages",
  BABY_CARE: "Baby Care",
  COSMETIC: "Cosmetics & Personal Care",
  MEDICAL_EQUIPMENT: "Medical Equipment",
  SURGICAL: "Surgical & First Aid",
  AYURVEDIC: "Ayurvedic & Herbal",
  HOMEOPATHIC: "Homeopathic Medicine",
  GENERAL: "General Items",
};

export const PRODUCT_TYPE_PREFIXES = {
  MEDICAL: "MED",
  SUPPLEMENT: "SUP",
  FOOD: "FOOD",
  BABY_CARE: "BABY",
  COSMETIC: "COSM",
  MEDICAL_EQUIPMENT: "EQUIP",
  SURGICAL: "SURG",
  AYURVEDIC: "AYU",
  HOMEOPATHIC: "HOMO",
  GENERAL: "GEN",
};

export const PRODUCT_TYPE_DEFAULT_GST = {
  MEDICAL: 12,
  SUPPLEMENT: 18,
  FOOD: 12,
  BABY_CARE: 18,
  COSMETIC: 18,
  MEDICAL_EQUIPMENT: 12,
  SURGICAL: 12,
  AYURVEDIC: 12,
  HOMEOPATHIC: 12,
  GENERAL: 12,
};

export const PRODUCT_TYPE_DESCRIPTIONS = {
  MEDICAL: "Prescription drugs, OTC medicines, analgesics",
  SUPPLEMENT: "Vitamins, minerals, proteins, herbal supplements",
  FOOD: "Beverages, snacks, health foods, dairy products",
  BABY_CARE: "Diapers, wipes, lotions, baby foods",
  COSMETIC: "Skincare, haircare, makeup, fragrances",
  MEDICAL_EQUIPMENT: "Diagnostic devices, BP monitors, mobility aids",
  SURGICAL: "Gloves, dressings, syringes, surgical instruments",
  AYURVEDIC: "Ayurvedic medicines, herbal formulations, churnas",
  HOMEOPATHIC: "Homeopathic remedies, mother tinctures, dilutions",
  GENERAL: "Miscellaneous items, household goods",
};

/** Product type badge variant mapping for shadcn Badge component */
export const PRODUCT_TYPE_BADGE_VARIANT = {
  MEDICAL: "default",
  SUPPLEMENT: "secondary",
  FOOD: "success",
  BABY_CARE: "outline",
  COSMETIC: "warning",
  MEDICAL_EQUIPMENT: "secondary",
  SURGICAL: "secondary",
  AYURVEDIC: "success",
  HOMEOPATHIC: "outline",
  GENERAL: "secondary",
};

/** Custom tailwind class per type for colored badges */
export const PRODUCT_TYPE_BADGE_CLASS = {
  MEDICAL: "bg-blue-100 text-blue-800 border-blue-200",
  SUPPLEMENT: "bg-purple-100 text-purple-800 border-purple-200",
  FOOD: "bg-green-100 text-green-800 border-green-200",
  BABY_CARE: "bg-pink-100 text-pink-800 border-pink-200",
  COSMETIC: "bg-rose-100 text-rose-800 border-rose-200",
  MEDICAL_EQUIPMENT: "bg-slate-100 text-slate-800 border-slate-200",
  SURGICAL: "bg-orange-100 text-orange-800 border-orange-200",
  AYURVEDIC: "bg-lime-100 text-lime-800 border-lime-200",
  HOMEOPATHIC: "bg-cyan-100 text-cyan-800 border-cyan-200",
  GENERAL: "bg-gray-100 text-gray-800 border-gray-200",
};

/** All fully supported product types */
export const ACTIVE_PRODUCT_TYPES = [
  "MEDICAL",
  "SUPPLEMENT",
  "FOOD",
  "BABY_CARE",
  "COSMETIC",
  "MEDICAL_EQUIPMENT",
  "SURGICAL",
  "AYURVEDIC",
  "HOMEOPATHIC",
  "GENERAL",
];

/** @deprecated All types are now active — kept for backward compatibility */
export const COMING_SOON_PRODUCT_TYPES = [];

export const ALL_PRODUCT_TYPES = [...ACTIVE_PRODUCT_TYPES];

// ── Supplement sub-type options ──────────────────────────────────────────────
export const SUPPLEMENT_TYPE_OPTIONS = [
  { value: "VITAMIN", label: "Vitamin" },
  { value: "MINERAL", label: "Mineral" },
  { value: "PROTEIN", label: "Protein / Amino Acid" },
  { value: "HERBAL", label: "Herbal Extract" },
  { value: "PROBIOTIC", label: "Probiotic" },
  { value: "OMEGA", label: "Omega / Fish Oil" },
  { value: "OTHER", label: "Other" },
];

// ── Food category options ────────────────────────────────────────────────────
export const FOOD_CATEGORY_OPTIONS = [
  { value: "BEVERAGE", label: "Beverage" },
  { value: "SNACK", label: "Snack / Confectionery" },
  { value: "HEALTH_FOOD", label: "Health Food" },
  { value: "DAIRY", label: "Dairy Product" },
  { value: "BAKERY", label: "Bakery / Cereal" },
  { value: "CONDIMENT", label: "Condiment / Sauce" },
  { value: "OTHER", label: "Other" },
];

// ── Baby care sub-type options ───────────────────────────────────────────────
export const BABY_CARE_SUBTYPE_OPTIONS = [
  { value: "DIAPER", label: "Diaper / Nappy" },
  { value: "WIPE", label: "Baby Wipe" },
  { value: "LOTION", label: "Lotion / Cream" },
  { value: "SHAMPOO", label: "Shampoo / Wash" },
  { value: "POWDER", label: "Powder" },
  { value: "FOOD", label: "Baby Food" },
  { value: "TOY", label: "Toy / Accessory" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "OTHER", label: "Other" },
];

// ── Cosmetic category options ────────────────────────────────────────────────
export const COSMETIC_CATEGORY_OPTIONS = [
  { value: "SKINCARE", label: "Skincare" },
  { value: "HAIRCARE", label: "Haircare" },
  { value: "MAKEUP", label: "Makeup / Colour Cosmetics" },
  { value: "FRAGRANCE", label: "Fragrance / Perfume" },
  { value: "BATH_BODY", label: "Bath & Body" },
  { value: "ORAL_CARE", label: "Oral Care" },
  { value: "OTHER", label: "Other" },
];

// ── Cosmetic skin type options ────────────────────────────────────────────────
export const SKIN_TYPE_OPTIONS = [
  { value: "OILY", label: "Oily" },
  { value: "DRY", label: "Dry" },
  { value: "COMBINATION", label: "Combination" },
  { value: "SENSITIVE", label: "Sensitive" },
  { value: "NORMAL", label: "Normal" },
  { value: "ALL_TYPES", label: "All Skin Types" },
];

// ── Medical Equipment type options ───────────────────────────────────────────
export const EQUIPMENT_TYPE_OPTIONS = [
  { value: "DIAGNOSTIC", label: "Diagnostic Device" },
  { value: "MONITORING", label: "Monitoring Device (BP, Glucose, etc.)" },
  { value: "MOBILITY", label: "Mobility Aid" },
  { value: "THERAPEUTIC", label: "Therapeutic Device" },
  { value: "LABORATORY", label: "Laboratory Equipment" },
  { value: "IMAGING", label: "Imaging Equipment" },
  { value: "OTHER", label: "Other" },
];

// ── Power source options (Medical Equipment) ─────────────────────────────────
export const POWER_SOURCE_OPTIONS = [
  { value: "BATTERY", label: "Battery" },
  { value: "AC_POWER", label: "AC Power" },
  { value: "RECHARGEABLE", label: "Rechargeable" },
  { value: "MANUAL", label: "Manual / No Power" },
  { value: "SOLAR", label: "Solar" },
];

// ── Surgical category options ─────────────────────────────────────────────────
export const SURGICAL_CATEGORY_OPTIONS = [
  { value: "GLOVES", label: "Gloves & Protective Wear" },
  { value: "DRESSINGS", label: "Dressings & Bandages" },
  { value: "SYRINGES", label: "Syringes & Needles" },
  { value: "INSTRUMENTS", label: "Surgical Instruments" },
  { value: "SUTURES", label: "Sutures & Staples" },
  { value: "CATHETERS", label: "Catheters & Tubes" },
  { value: "FIRST_AID", label: "First Aid Supplies" },
  { value: "OTHER", label: "Other" },
];

// ── Sterilization method options ─────────────────────────────────────────────
export const STERILIZATION_METHOD_OPTIONS = [
  { value: "ETO", label: "Ethylene Oxide (ETO)" },
  { value: "GAMMA", label: "Gamma Radiation" },
  { value: "STEAM", label: "Steam / Autoclave" },
  { value: "DRY_HEAT", label: "Dry Heat" },
  { value: "CHEMICAL", label: "Chemical" },
  { value: "NOT_STERILIZED", label: "Not Sterilized" },
];

// ── Ayurvedic type options ────────────────────────────────────────────────────
export const AYURVEDIC_TYPE_OPTIONS = [
  { value: "CHURNA", label: "Churna (Powder)" },
  { value: "VATI", label: "Vati / Tablet" },
  { value: "KWATH", label: "Kwath / Decoction" },
  { value: "ASAVA_ARISHTA", label: "Asava / Arishta" },
  { value: "GHRITA", label: "Ghrita (Medicated Ghee)" },
  { value: "TAIL", label: "Tail (Medicated Oil)" },
  { value: "LEHA", label: "Leha / Avaleha (Linctus)" },
  { value: "BHASMA", label: "Bhasma (Calx)" },
  { value: "OTHER", label: "Other" },
];

// ── Homeopathic form options ──────────────────────────────────────────────────
export const HOMEOPATHIC_FORM_OPTIONS = [
  { value: "PILLS", label: "Pills / Globules" },
  { value: "LIQUID", label: "Liquid Dilution" },
  { value: "TINCTURE", label: "Mother Tincture" },
  { value: "TRITURATION", label: "Trituration (Powder)" },
  { value: "CREAM", label: "Cream / Ointment" },
  { value: "DROPS", label: "Drops" },
];
