import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { DashboardActivity, DashboardChartPoint } from "@syncr/packages";
import { TaskActivityAction } from "@syncr/packages";
import {
  CircleCheck,
  Clock,
  Folders,
  TrendingUp,
  Users,
} from "lucide-mui";
import type { ReactNode } from "react";

import { useGetDashboard } from "@/api/dashboard";
import { UserAvatar } from "@/components/UserAvatar";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { getUserFullName } from "@/utils/getUserFullName";

type SummaryCardProps = {
  color: string;
  icon: ReactNode;
  label: string;
  trend?: number | null;
  trendLabel?: string;
  value: number;
};

const ACTIVITY_LABEL: Record<TaskActivityAction, string> = {
  [TaskActivityAction.TaskCreated]: "created task",
  [TaskActivityAction.TaskUpdated]: "updated task",
  [TaskActivityAction.TaskNameUpdated]: "renamed task",
  [TaskActivityAction.TaskDescriptionUpdated]: "updated task description",
  [TaskActivityAction.TaskAssigneeUpdated]: "changed assignee for",
  [TaskActivityAction.TaskStatusUpdated]: "changed status for",
  [TaskActivityAction.TaskPriorityUpdated]: "changed priority for",
  [TaskActivityAction.TaskDeadlineUpdated]: "changed deadline for",
  [TaskActivityAction.TaskEstimateUpdated]: "changed estimate for",
  [TaskActivityAction.TaskLabelsUpdated]: "updated labels for",
  [TaskActivityAction.TaskCommentAdded]: "commented on",
  [TaskActivityAction.AcceptanceCriterionCreated]:
    "added acceptance criteria to",
  [TaskActivityAction.AcceptanceCriterionUpdated]:
    "updated acceptance criteria on",
  [TaskActivityAction.AcceptanceCriterionDeleted]:
    "removed acceptance criteria from",
};

const getActivityText = (activity: DashboardActivity) => {
  const actor = activity.actor
    ? getUserFullName(activity.actor.name, activity.actor.surname)
    : "Deleted user";

  return `${actor} ${ACTIVITY_LABEL[activity.action]} ${activity.task.name}`;
};

const SummaryCard = ({
  color,
  icon,
  label,
  trend,
  trendLabel,
  value,
}: SummaryCardProps) => {
  const trendText =
    trendLabel ??
    (trend == null
      ? null
      : `${trend >= 0 ? "+" : ""}${trend.toLocaleString()}%`);

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack gap={2.25}>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between">
          <Box
            sx={{
              alignItems: "center",
              bgcolor: color,
              borderRadius: 2,
              color: "primary.main",
              display: "inline-flex",
              height: 48,
              justifyContent: "center",
              width: 48,
              "& .MuiSvgIcon-root": { fontSize: 23 },
            }}
          >
            {icon}
          </Box>
          {trendText ? (
            <Stack alignItems="center" direction="row" gap={0.5}>
              {trend != null && trend >= 0 ? (
                <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
              ) : null}
              <Typography
                color={trend != null && trend < 0 ? "error.main" : "success.main"}
                fontSize={13}
                fontWeight={800}
              >
                {trendText}
              </Typography>
            </Stack>
          ) : null}
        </Stack>
        <Stack gap={0.25}>
          <Typography fontSize={{ xs: 26, sm: 28 }} fontWeight={800}>
            {value.toLocaleString()}
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            {label}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

const BarChart = ({ data }: { data: DashboardChartPoint[] }) => {
  const maxValue = Math.max(1, ...data.map((point) => point.value));

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack gap={3}>
        <Typography fontSize={18} fontWeight={800}>
          Tasks Completed This Week
        </Typography>
        <Box
          sx={{
            alignItems: "end",
            display: "grid",
            gap: { xs: 1, sm: 2 },
            gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
            height: { xs: 210, sm: 260 },
            pt: 1,
          }}
        >
          {data.map((point) => (
            <Stack key={point.label} alignItems="center" gap={1} minWidth={0}>
              <Box
                sx={{
                  alignItems: "end",
                  display: "flex",
                  height: { xs: 160, sm: 205 },
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: "8px 8px 2px 2px",
                    height: `${Math.max(4, (point.value / maxValue) * 100)}%`,
                    minHeight: point.value > 0 ? 12 : 4,
                    width: "100%",
                  }}
                />
              </Box>
              <Typography color="text.secondary" fontSize={12} noWrap>
                {point.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
};

const RecentActivity = ({ activities }: { activities: DashboardActivity[] }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack gap={2.5}>
        <Typography fontSize={18} fontWeight={800}>
          Recent Activity
        </Typography>

        {activities.length === 0 ? (
          <Typography color="text.secondary">No recent activity yet.</Typography>
        ) : null}

        {activities.map((activity) => (
          <Stack
            key={activity.id}
            alignItems="flex-start"
            direction="row"
            gap={1.5}
            minWidth={0}
          >
            <UserAvatar
              name={activity.actor?.name}
              size={34}
              surname={activity.actor?.surname}
            />
            <Stack minWidth={0}>
              <Typography fontSize={14} fontWeight={650}>
                {getActivityText(activity)}
              </Typography>
              <Typography color="text.secondary" fontSize={12}>
                {formatRelativeDate(activity.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export const DashboardPage = () => {
  const { data, isError, isLoading } = useGetDashboard();

  if (isLoading) {
    return (
      <Stack alignItems="center" component="main" minHeight="100%" py={8} width="100%">
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
            color="#E0E7FF"
            icon={<Folders />}
            label="Active Projects"
            value={data.summary.activeProjects}
          />
          <SummaryCard
            color="#DCFCE7"
            icon={<CircleCheck />}
            label="Tasks Completed"
            trend={data.summary.tasksCompletedChangePercent}
            value={data.summary.tasksCompleted}
          />
          <SummaryCard
            color="#FFEDD5"
            icon={<Clock />}
            label="Tasks Due Today"
            trendLabel={data.summary.tasksDueToday > 0 ? "Due Soon" : undefined}
            value={data.summary.tasksDueToday}
          />
          <SummaryCard
            color="#F3E8FF"
            icon={<Users />}
            label="Team Members"
            value={data.summary.teamMembers}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, sm: 3 },
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 2fr) minmax(320px, 1fr)" },
          }}
        >
          <BarChart data={data.tasksCompletedThisWeek} />
          <RecentActivity activities={data.recentActivity} />
        </Box>
      </Stack>
    </Box>
  );
};
