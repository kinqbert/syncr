import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { CircleCheck, Clock, Folders, Users } from "lucide-mui";

import { useGetDashboard } from "@/api/dashboard";

import {
  BirthdaysPanel,
  RecentActivity,
  SummaryCard,
  TasksCompletedChart,
} from "./components";

export const DashboardPage = () => {
  const { data, isError, isLoading } = useGetDashboard();

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        component="main"
        minHeight="100%"
        py={8}
        width="100%"
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <Stack component="main" p={{ xs: 2, sm: 3 }} width="100%">
        <Paper
          elevation={0}
          sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 3 }}
        >
          <Typography fontWeight={700}>Could not load dashboard.</Typography>
          <Typography color="text.secondary" fontSize={14}>
            Refresh the page or try again later.
          </Typography>
        </Paper>
      </Stack>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100%",
        minWidth: 0,
        p: { xs: 2, sm: 3 },
        width: "100%",
      }}
    >
      <Stack gap={{ xs: 2.5, sm: 3 }} minWidth={0}>
        <Stack gap={0.5}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: 28, sm: 34 }, lineHeight: 1.2 }}
          >
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            Welcome back. Here's what's happening with your projects.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, sm: 2.5 },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          <SummaryCard
            color="#e9ebff"
            icon={<Folders />}
            label="Active Projects"
            value={data.summary.activeProjects}
          />
          <SummaryCard
            color="#e9ebff"
            icon={<CircleCheck />}
            label="Tasks Completed"
            value={data.summary.tasksCompleted}
          />
          <SummaryCard
            color="#e9ebff"
            icon={<Clock />}
            label="Tasks Due Today"
            trendLabel={data.summary.tasksDueToday > 0 ? "Due Soon" : undefined}
            value={data.summary.tasksDueToday}
          />
          <SummaryCard
            color="#e9ebff"
            icon={<Users />}
            label="Team Members"
            value={data.summary.teamMembers}
          />
        </Box>

        <Box
          sx={{
            alignItems: "stretch",
            display: "grid",
            gap: { xs: 2, sm: 3 },
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 2fr) minmax(320px, 1fr)",
            },
          }}
        >
          <TasksCompletedChart data={data.tasksCompletedThisWeek} />
          <Stack
            gap={{ xs: 2, sm: 3 }}
            height="100%"
            minHeight={0}
            minWidth={0}
          >
            <Box
              sx={{
                display: "flex",
                flex: "1 1 0",
                minHeight: 0,
                "& > .MuiPaper-root": {
                  height: "100%",
                  width: "100%",
                },
              }}
            >
              <BirthdaysPanel birthdays={data.upcomingBirthdays} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flex: "1 1 0",
                minHeight: 0,
                "& > .MuiPaper-root": {
                  height: "100%",
                  width: "100%",
                },
              }}
            >
              <RecentActivity activities={data.recentActivity} />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
