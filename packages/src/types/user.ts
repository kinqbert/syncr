export const UserStatus = {
  Active: "active",
  Inactive: "inactive",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  status: UserStatus;
  weeklyLoadMinutes: number;
};
