import z from "zod";

export const registerStep1Schema = z.object({
  email: z.string().email("Invalid email"),
});

const registerStep2BaseSchema = z.object({
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password requires uppercase, lowercase letters and a number",
    ),
  passwordConfirmation: z.string().nonempty("Password confirm is required"),
});

const passwordsMatch = (data: {
  password: string;
  passwordConfirmation: string;
}) => data.password === data.passwordConfirmation;

export const registerStep2Schema = registerStep2BaseSchema.refine(
  passwordsMatch,
  {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  },
);

export const registerStep3Schema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
});

export const registerStepSchemas = [
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
] as const;

export const registerSchema = registerStep1Schema
  .merge(registerStep2BaseSchema)
  .merge(registerStep3Schema)
  .refine(passwordsMatch, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type RegisterSchemaTypeKeys = keyof RegisterSchemaType;
