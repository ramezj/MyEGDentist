export const UserRole = {
  tourist: "tourist",
  agency: "agency",
  dentist: "dentist",
  superadmin: "superadmin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
