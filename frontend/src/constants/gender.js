/**
 * Gender - Matching backend Gender.java enum
 */
export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

export const GENDER_LABELS = {
  [GENDER.MALE]: "Male",
  [GENDER.FEMALE]: "Female",
  [GENDER.OTHER]: "Other",
};

export const GENDER_OPTIONS = Object.entries(GENDER_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
