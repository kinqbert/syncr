import { useFormContext } from "react-hook-form";
import type { RegisterSchemaType } from "../validation";
import { IconButton, Stack, TextField } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

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
        type={fieldType}
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton onClick={togglePasswordVisible}>
                {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            ),
          },
        }}
      />
      <TextField
        label="Password confirm"
        type={fieldType}
        {...register("passwordConfirmation")}
        error={!!errors.passwordConfirmation}
        helperText={errors.passwordConfirmation?.message}
      />
    </Stack>
  );
};
