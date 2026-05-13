import { Stack, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

import type { RegisterSchemaType } from "../validation";

export const Step1 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterSchemaType>();

  return (
    <Stack gap={2}>
      <TextField
        autoFocus
        label="Email"
        placeholder="you@example.com"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
    </Stack>
  );
};
