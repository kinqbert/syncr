import { Stack, Typography } from "@mui/material";

import { useAuthStore } from "@/store/useAuthStore";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Stack sx={{ width: "100%", alignItems: "center" }}>
      <Typography variant="h3">Welcome to dashboard!</Typography>
      <Typography>Logged in as {user?.email}</Typography>
    </Stack>
  );
};
