import { Stack, Typography } from "@mui/material";

import { useAuthStore } from "@/store/useAuthStore";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Stack width="100%" height="100%" p={3} gap={0.5}>
      <Typography variant="h4">Welcome to dashboard!</Typography>
      <Typography color="text.secondary">Logged in as {user?.email}</Typography>
    </Stack>
  );
};
