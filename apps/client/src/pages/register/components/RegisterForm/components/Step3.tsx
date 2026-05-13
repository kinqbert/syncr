import { Stack, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

import type { RegisterSchemaType } from "../validation";

export const Step3 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterSchemaType>();

  return (
    <Stack gap={2}>
      <TextField
        autoFocus
        label="First Name"
        placeholder="Enter first name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Surname"
        placeholder="Enter surname"
        {...register("surname")}
        error={!!errors.surname}
        helperText={errors.surname?.message}
      />
    </Stack>
  );
};
