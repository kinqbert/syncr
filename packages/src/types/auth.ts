import { type User } from "./user";

export type RegisterBody = {
  email: string;
  password: string;
  name: string;
  surname: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type MeResponse = Pick<
  User,
  "id" | "email" | "name" | "surname" | "birthday" | "weeklyLoadMinutes"
>;

export type UpdateProfileBody = {
  name: string;
  surname: string;
  birthday: string | null;
  weeklyLoadMinutes: number;
};

export type UpdatePasswordBody = {
  currentPassword: string;
  newPassword: string;
};
