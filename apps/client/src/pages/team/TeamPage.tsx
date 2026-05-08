import { Stack, Typography } from "@mui/material";

// import { useGetTeam } from "@/api/team";

export const TeamPage = () => {
  // const { data } = useGetTeam();

  return (
    <Stack width="100%" height="100%" p={3} gap={0.5}>
      <Typography variant="h4">Team Management</Typography>
      <Typography color="text.secondary">
        Manage team members and their workload
      </Typography>
    </Stack>
  );
};
