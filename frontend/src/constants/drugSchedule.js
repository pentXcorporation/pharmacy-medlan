/**
 * Drug Schedule - Matching backend DrugSchedule.java enum
 * Based on Indian pharmaceutical regulations
 */
export const DRUG_SCHEDULE = {
  H: "H",
  H1: "H1",
  X: "X",
  G: "G",
  C: "C",
  C1: "C1",
};

export const DRUG_SCHEDULE_LABELS = {
  [DRUG_SCHEDULE.H]: "Schedule H - Prescription Required",
  [DRUG_SCHEDULE.H1]: "Schedule H1 - Restricted Prescription",
  [DRUG_SCHEDULE.X]: "Schedule X - Narcotic/Psychotropic",
  [DRUG_SCHEDULE.G]: "Schedule G - General Sale (OTC)",
  [DRUG_SCHEDULE.C]: "Schedule C - Controlled Drug",
  [DRUG_SCHEDULE.C1]: "Schedule C1 - Controlled Drug (Restricted)",
};

export const DRUG_SCHEDULE_SHORT_LABELS = {
  [DRUG_SCHEDULE.H]: "Schedule H",
  [DRUG_SCHEDULE.H1]: "Schedule H1",
  [DRUG_SCHEDULE.X]: "Schedule X",
  [DRUG_SCHEDULE.G]: "Schedule G",
  [DRUG_SCHEDULE.C]: "Schedule C",
  [DRUG_SCHEDULE.C1]: "Schedule C1",
};

export const DRUG_SCHEDULE_COLORS = {
  [DRUG_SCHEDULE.H]: "bg-red-100 text-red-800",
  [DRUG_SCHEDULE.H1]: "bg-red-200 text-red-900",
  [DRUG_SCHEDULE.X]: "bg-purple-100 text-purple-800",
  [DRUG_SCHEDULE.G]: "bg-green-100 text-green-800",
  [DRUG_SCHEDULE.C]: "bg-orange-100 text-orange-800",
  [DRUG_SCHEDULE.C1]: "bg-orange-200 text-orange-900",
};

export const DRUG_SCHEDULE_OPTIONS = Object.entries(DRUG_SCHEDULE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);

// Schedules that require prescription
export const PRESCRIPTION_REQUIRED_SCHEDULES = [
  DRUG_SCHEDULE.H,
  DRUG_SCHEDULE.H1,
  DRUG_SCHEDULE.X,
  DRUG_SCHEDULE.C,
  DRUG_SCHEDULE.C1,
  DRUG_SCHEDULE.H1,
  DRUG_SCHEDULE.X,
];

export const requiresPrescription = (schedule) => {
  return PRESCRIPTION_REQUIRED_SCHEDULES.includes(schedule);
};
