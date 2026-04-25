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

export type MeResponse = Pick<User, "id" | "email" | "name" | "surname">;
