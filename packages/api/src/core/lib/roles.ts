export const UserType = {
  tourist: "tourist",
  agency: "agency",
  dentist: "dentist",
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];
