import { Stack, Typography } from "@mui/material";

import {
  CalendarSettingsSection,
  PasswordSettingsSection,
  ProfileSettingsSection,
} from "./components";

export const SettingsPage = () => {
  return (
    <Stack width="100%" minHeight="100%" p={3} gap={3}>
      <Stack gap={0.5}>
        <Typography variant="h4">Settings</Typography>
        <Typography color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Stack>

      <ProfileSettingsSection />
      <PasswordSettingsSection />
      <CalendarSettingsSection />
    </Stack>
  );
};
