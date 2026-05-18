import { Stack, Typography } from "@mui/material";

import {
  CalendarSettingsSection,
  CompanyWorkHoursSettingsSection,
  PasswordSettingsSection,
  ProfileSettingsSection,
} from "./components";

export const SettingsPage = () => {
  return (
    <Stack
      width="100%"
      minHeight="100%"
      minWidth={0}
      p={{ xs: 2, sm: 3 }}
      gap={{ xs: 2.5, sm: 3 }}
    >
      <Stack gap={0.5} minWidth={0}>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: 28, sm: 34 }, lineHeight: 1.2 }}
        >
          Settings
        </Typography>
        <Typography color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Stack>

      <ProfileSettingsSection />
      <CompanyWorkHoursSettingsSection />
      <PasswordSettingsSection />
      <CalendarSettingsSection />
    </Stack>
  );
};
