/**
 * Employment Type - Matching backend EmploymentType.java enum
 */
export const EMPLOYMENT_TYPE = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACT",
  TEMPORARY: "TEMPORARY",
  INTERN: "INTERN",
  CONSULTANT: "CONSULTANT",
};

export const EMPLOYMENT_TYPE_LABELS = {
  [EMPLOYMENT_TYPE.FULL_TIME]: "Full Time",
  [EMPLOYMENT_TYPE.PART_TIME]: "Part Time",
  [EMPLOYMENT_TYPE.CONTRACT]: "Contract",
  [EMPLOYMENT_TYPE.TEMPORARY]: "Temporary",
  [EMPLOYMENT_TYPE.INTERN]: "Intern",
  [EMPLOYMENT_TYPE.CONSULTANT]: "Consultant",
};

export const EMPLOYMENT_TYPE_OPTIONS = Object.entries(
  EMPLOYMENT_TYPE_LABELS
).map(([value, label]) => ({
  value,
  label,
}));
