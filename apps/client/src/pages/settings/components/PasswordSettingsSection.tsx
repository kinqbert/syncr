import { Alert, Button, Divider, Stack, TextField } from "@mui/material";
import { KeyRound } from "lucide-mui";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useUpdatePassword } from "@/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { SettingsSectionHeader } from "./SettingsSectionHeader";

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
};

export const PasswordSettingsSection = () => {
  const updatePassword = useUpdatePassword();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<PasswordFormState>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const handleSavePassword = async (formState: PasswordFormState) => {
    setError(null);
    setMessage(null);

    try {
      await updatePassword.mutateAsync({
        currentPassword: formState.currentPassword,
        newPassword: formState.newPassword,
      });
      reset();
      setMessage("Password updated.");
    } catch (error) {
      setError(getErrorMessage(error, "Could not update password."));
    }
  };

  return (
    <Stack
      border={1}
      borderColor="divider"
      borderRadius={2}
      component="form"
      divider={<Divider />}
      maxWidth={760}
      onSubmit={handleSubmit(handleSavePassword)}
    >
      <SettingsSectionHeader
        description="Change the password used to sign in to your account."
        icon={<KeyRound sx={{ color: "primary.main", fontSize: 20 }} />}
        title="Password"
      />

      <Stack gap={2} px={2.25} py={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}

        <TextField
          {...register("currentPassword", {
            required: "Current password is required.",
          })}
          autoComplete="current-password"
          disabled={updatePassword.isPending}
          error={Boolean(errors.currentPassword)}
          helperText={errors.currentPassword?.message}
          label="Current password"
          sx={{ maxWidth: { sm: 420 } }}
          type="password"
        />
        <TextField
          {...register("newPassword", {
            required: "New password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long.",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
              message:
                "Password requires uppercase, lowercase letters and a number.",
            },
          })}
          autoComplete="new-password"
          disabled={updatePassword.isPending}
          error={Boolean(errors.newPassword)}
          helperText={errors.newPassword?.message}
          label="New password"
          sx={{ maxWidth: { sm: 420 } }}
          type="password"
        />
        <TextField
          {...register("passwordConfirmation", {
            required: "Password confirmation is required.",
            validate: (value, formValues) =>
              value === formValues.newPassword || "Passwords do not match.",
          })}
          autoComplete="new-password"
          disabled={updatePassword.isPending}
          error={Boolean(errors.passwordConfirmation)}
          helperText={errors.passwordConfirmation?.message}
          label="Confirm new password"
          sx={{ maxWidth: { sm: 420 } }}
          type="password"
        />

        <Stack alignItems="flex-start">
          <Button
            disabled={updatePassword.isPending}
            startIcon={<KeyRound sx={{ fontSize: 16 }} />}
            type="submit"
            variant="contained"
          >
            Update password
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
