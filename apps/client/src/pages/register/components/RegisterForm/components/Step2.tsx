import { IconButton, Stack, TextField } from "@mui/material";
import { Eye, EyeOff } from "lucide-mui";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { RegisterSchemaType } from "../validation";

export const Step2 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterSchemaType>();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  const fieldType = passwordVisible ? "text" : "password";

  return (
    <Stack gap={2}>
      <TextField
        sx={{ flex: 1 }}
        label="Password"
        placeholder="Enter password"
        type={fieldType}
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                edge="end"
                onClick={togglePasswordVisible}
                sx={{ color: "primary.main" }}
              >
                {passwordVisible ? <EyeOff /> : <Eye />}
              </IconButton>
            ),
          },
        }}
      />
      <TextField
        label="Password confirm"
        placeholder="Confirm password"
        type={fieldType}
        {...register("passwordConfirmation")}
        error={!!errors.passwordConfirmation}
        helperText={errors.passwordConfirmation?.message}
      />
    </Stack>
  );
};
