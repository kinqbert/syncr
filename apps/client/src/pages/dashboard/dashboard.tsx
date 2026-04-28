import { useAuthStore } from "@/store/useAuthStore";
import { Stack, Typography } from "@mui/material";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Stack>
      <Typography variant="h3">Welcome to dashboard!</Typography>
      <Typography>Logged in as {user?.email}</Typography>
    </Stack>
  );
};
