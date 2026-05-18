import { Alert, Box, Button, Divider, Stack, TextField } from "@mui/material";
import { Save, UserRound } from "lucide-mui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useMe, useUpdateProfile } from "@/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { SettingsSectionHeader } from "./SettingsSectionHeader";

type ProfileFormState = {
  name: string;
  surname: string;
  birthday: string;
};

export const ProfileSettingsSection = () => {
  const { data: user } = useMe();
  const updateProfile = useUpdateProfile();
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProfileFormState>({
    defaultValues: {
      name: "",
      surname: "",
      birthday: "",
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      name: user.name,
      surname: user.surname,
      birthday: user.birthday ?? "",
    });
  }, [reset, user]);

  const handleSaveProfile = async (formState: ProfileFormState) => {
    setError(null);

    try {
      await updateProfile.mutateAsync({
        name: formState.name.trim(),
        surname: formState.surname.trim(),
        birthday: formState.birthday || null,
        weeklyLoadMinutes: user?.weeklyLoadMinutes ?? 40 * 60,
      });
      toast.success("Profile updated.");
    } catch (error) {
      setError(getErrorMessage(error, "Could not update profile."));
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
      onSubmit={handleSubmit(handleSaveProfile)}
      width="100%"
    >
      <SettingsSectionHeader
        description="Update your personal details."
        icon={<UserRound sx={{ color: "primary.main", fontSize: 20 }} />}
        title="Profile"
      />

      <Stack gap={2} px={{ xs: 2, sm: 2.25 }} py={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
          }}
        >
          <TextField
            {...register("name", {
              required: "Name is required.",
              validate: (value) =>
                value.trim().length > 0 || "Name is required.",
            })}
            disabled={updateProfile.isPending}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            label="Name"
          />
          <TextField
            {...register("surname", {
              required: "Surname is required.",
              validate: (value) =>
                value.trim().length > 0 || "Surname is required.",
            })}
            disabled={updateProfile.isPending}
            error={Boolean(errors.surname)}
            helperText={errors.surname?.message}
            label="Surname"
          />
          <TextField
            {...register("birthday")}
            disabled={updateProfile.isPending}
            helperText="Shown on the dashboard birthday list."
            InputLabelProps={{ shrink: true }}
            label="Birthday"
            type="date"
          />
        </Box>

        <Stack alignItems={{ xs: "stretch", sm: "flex-start" }}>
          <Button
            disabled={updateProfile.isPending}
            startIcon={<Save sx={{ fontSize: 16 }} />}
            type="submit"
            variant="contained"
          >
            Save profile
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
