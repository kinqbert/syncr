import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Bell, CircleCheck, Clock, Folders, ListTodo, Users } from "lucide-mui";
import { useMemo } from "react";

import { useGetDashboard } from "@/api/dashboard";
import { ErrorState } from "@/components/ErrorState";

import {
  BirthdaysPanel,
  DashboardQuickLinks,
  RecentActivity,
  SummaryCard,
  TasksByStatusChart,
} from "./components";
import { getTimeBasedGreeting } from "./utils/getTimeBasedGreeting";

export const DashboardPage = () => {
  const { data, error, isError, isLoading } = useGetDashboard();
  const greeting = useMemo(() => getTimeBasedGreeting(new Date()), []);

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
      <ErrorState
        error={error}
        fallback="Refresh the page or try again later."
        title="Could not load dashboard."
      />
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
            {greeting}
          </Typography>
          <Typography color="text.secondary">
            Welcome back. Here's what's happening with your projects.
          </Typography>
        </Stack>

        <DashboardQuickLinks />

        <Box
          sx={{
            alignItems: "stretch",
            display: "grid",
            gap: { xs: 2, sm: 2.5, lg: 3 },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))",
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
            value={data.summary.tasksDueToday}
          />
          <SummaryCard
            color="#e9ebff"
            icon={<Users />}
            label="Team Members"
            value={data.summary.teamMembers}
          />
          <SummaryCard
            color="#e9ebff"
            icon={<ListTodo />}
            label="My Assigned Tasks"
            value={data.summary.myAssignedTasks}
          />
          <SummaryCard
            color="#e9ebff"
            icon={<Bell />}
            label="Unread Notifications"
            value={data.summary.unreadNotifications}
          />
          <Box
            sx={{
              display: "flex",
              gridColumn: { xs: "1", sm: "1 / -1", lg: "span 2" },
              minHeight: 0,
              minWidth: 0,
              "& > .MuiPaper-root": {
                height: "100%",
                width: "100%",
              },
            }}
          >
            <TasksByStatusChart data={data.tasksByStatus} />
          </Box>
          <Box
            sx={{
              display: "flex",
              gridColumn: { xs: "1", sm: "span 1", lg: "span 2" },
              minHeight: 0,
              minWidth: 0,
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
              gridColumn: { xs: "1", sm: "span 1", lg: "span 2" },
              minHeight: 0,
              minWidth: 0,
              "& > .MuiPaper-root": {
                height: "100%",
                width: "100%",
              },
            }}
          >
            <RecentActivity activities={data.recentActivity} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
