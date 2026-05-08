import { Stack, Typography } from "@mui/material";

export const SettingsPage = () => {
  return (
    <Stack width="100%" height="100%" p={3} gap={0.5}>
      <Typography variant="h4">Settings</Typography>
      <Typography color="text.secondary">
        Manage your account settings and preferences
      </Typography>
    </Stack>
  );
};
