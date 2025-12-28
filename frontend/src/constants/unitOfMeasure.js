/**
 * Unit of Measure - Matching backend UnitOfMeasure.java enum
 */
export const UNIT_OF_MEASURE = {
  PIECE: "PIECE",
  TABLET: "TABLET",
  CAPSULE: "CAPSULE",
  STRIP: "STRIP",
  BOX: "BOX",
  BOTTLE: "BOTTLE",
  VIAL: "VIAL",
  AMPOULE: "AMPOULE",
  TUBE: "TUBE",
  SACHET: "SACHET",
  ML: "ML",
  LITER: "LITER",
  GRAM: "GRAM",
  KG: "KG",
  MG: "MG",
};

export const UNIT_OF_MEASURE_LABELS = {
  [UNIT_OF_MEASURE.PIECE]: "Piece",
  [UNIT_OF_MEASURE.TABLET]: "Tablet",
  [UNIT_OF_MEASURE.CAPSULE]: "Capsule",
  [UNIT_OF_MEASURE.STRIP]: "Strip",
  [UNIT_OF_MEASURE.BOX]: "Box",
  [UNIT_OF_MEASURE.BOTTLE]: "Bottle",
  [UNIT_OF_MEASURE.VIAL]: "Vial",
  [UNIT_OF_MEASURE.AMPOULE]: "Ampoule",
  [UNIT_OF_MEASURE.TUBE]: "Tube",
  [UNIT_OF_MEASURE.SACHET]: "Sachet",
  [UNIT_OF_MEASURE.ML]: "ml",
  [UNIT_OF_MEASURE.LITER]: "Liter",
  [UNIT_OF_MEASURE.GRAM]: "Gram",
  [UNIT_OF_MEASURE.KG]: "Kg",
  [UNIT_OF_MEASURE.MG]: "mg",
};

export const UNIT_OF_MEASURE_ABBREVIATIONS = {
  [UNIT_OF_MEASURE.PIECE]: "pc",
  [UNIT_OF_MEASURE.TABLET]: "tab",
  [UNIT_OF_MEASURE.CAPSULE]: "cap",
  [UNIT_OF_MEASURE.STRIP]: "strip",
  [UNIT_OF_MEASURE.BOX]: "box",
  [UNIT_OF_MEASURE.BOTTLE]: "btl",
  [UNIT_OF_MEASURE.VIAL]: "vial",
  [UNIT_OF_MEASURE.AMPOULE]: "amp",
  [UNIT_OF_MEASURE.TUBE]: "tube",
  [UNIT_OF_MEASURE.SACHET]: "sach",
  [UNIT_OF_MEASURE.ML]: "ml",
  [UNIT_OF_MEASURE.LITER]: "L",
  [UNIT_OF_MEASURE.GRAM]: "g",
  [UNIT_OF_MEASURE.KG]: "kg",
  [UNIT_OF_MEASURE.MG]: "mg",
};

export const UNIT_OF_MEASURE_OPTIONS = Object.entries(
  UNIT_OF_MEASURE_LABELS
).map(([value, label]) => ({
  value,
  label,
}));
