import { Box, Stack } from "@mui/material";
import {
  Bell,
  CircleCheck,
  Clock,
  Folders,
  ListTodo,
  Users,
} from "lucide-mui";
import { useMemo } from "react";

import { useGetDashboard } from "@/api/dashboard";
import { ErrorState } from "@/components/ErrorState";
import { StatusDistribution } from "@/components/StatusDistribution";
import { Page, PageHeader, PageSkeleton, StatRow } from "@/components/ui";

import { BirthdaysPanel, MyTasksPanel, RecentActivity } from "./components";
import { getTimeBasedGreeting } from "./utils/getTimeBasedGreeting";

const formatToday = () =>
  new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date());

export const DashboardPage = () => {
  const { data, error, isError, isLoading } = useGetDashboard();
  const greeting = useMemo(() => getTimeBasedGreeting(new Date()), []);

  if (isLoading) {
    return <PageSkeleton />;
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

  const { summary } = data;

  return (
    <Page maxWidth={1400}>
      <PageHeader description={formatToday()} title={greeting} />

      <StatRow
        items={[
          {
            icon: <ListTodo />,
            label: "Assigned to me",
            to: "/calendar",
            value: summary.myAssignedTasks,
          },
          {
            icon: <Clock />,
            label: "Due today",
            to: "/calendar",
            value: summary.tasksDueToday,
          },
          {
            icon: <CircleCheck />,
            label: "Completed",
            value: summary.tasksCompleted,
          },
          {
            icon: <Folders />,
            label: "Active projects",
            to: "/projects",
            value: summary.activeProjects,
          },
          {
            icon: <Users />,
            label: "Team members",
            to: "/team",
            value: summary.teamMembers,
          },
          {
            icon: <Bell />,
            label: "Unread",
            to: "/notifications",
            value: summary.unreadNotifications,
          },
        ]}
      />

      <Box
        sx={{
          alignItems: "start",
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 2fr) minmax(0, 1fr)",
          },
        }}
      >
        <Stack gap={2} minWidth={0}>
          <MyTasksPanel />
          <StatusDistribution
            data={data.tasksByStatus}
            description="Across active projects"
          />
        </Stack>
        <Stack gap={2} minWidth={0}>
          <RecentActivity activities={data.recentActivity} />
          <BirthdaysPanel birthdays={data.upcomingBirthdays} />
        </Stack>
      </Box>
    </Page>
  );
};
