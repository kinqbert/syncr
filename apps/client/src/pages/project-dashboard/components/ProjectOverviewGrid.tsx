import { Box, CircularProgress, Stack } from "@mui/material";
import type { Task } from "@syncr/packages";
import { TaskStatus } from "@syncr/packages";
import { Activity, FolderKanban, TrendingUp } from "lucide-mui";

import { useGetProjectTasks } from "@/api/tasks";

import { StatCard } from "./StatCard";
import { TaskDistributionCard } from "./TaskDistributionCard";
import { TeamMembersCard } from "./TeamMembersCard";

type ProjectOverviewGridProps = {
  projectId: number;
};

const getCompletionProgress = (tasks: Task[]) => {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.Done,
  );

  return Math.round((completedTasks.length / tasks.length) * 100);
};

export const ProjectOverviewGrid = ({
  projectId,
}: ProjectOverviewGridProps) => {
  const { data: tasks = [], isLoading } = useGetProjectTasks(projectId);
  const completionProgress = getCompletionProgress(tasks);
  const completedTasksCount = tasks.filter(
    (task) => task.status === TaskStatus.Done,
  ).length;
  const inProgressTasksCount = tasks.filter(
    (task) => task.status === TaskStatus.InProgress,
  ).length;

  return (
    <Box
      sx={{
        alignItems: "stretch",
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
      }}
    >
      {isLoading ? (
        <Stack alignItems="center" sx={{ gridColumn: "1 / -1" }} py={3}>
          <CircularProgress />
        </Stack>
      ) : null}

      {!isLoading ? (
        <>
          <StatCard
            helper={`${completedTasksCount} completed`}
            icon={<Activity />}
            label="Total Tasks"
            value={tasks.length}
          />
          <StatCard
            helper="Currently active tasks"
            icon={<FolderKanban />}
            label="In Progress"
            value={inProgressTasksCount}
          />
          <StatCard
            helper={`${completedTasksCount} of ${tasks.length} tasks done`}
            icon={<TrendingUp />}
            label="Completion Rate"
            value={`${completionProgress}%`}
          />

          <Box
            sx={{ gridColumn: { xs: "1 / -1", lg: "span 2" }, minWidth: 0 }}
          >
            <TaskDistributionCard tasks={tasks} />
          </Box>
          <Box
            sx={{ gridColumn: { xs: "1 / -1", lg: "span 1" }, minWidth: 0 }}
          >
            <TeamMembersCard projectId={projectId} tasks={tasks} />
          </Box>
        </>
      ) : null}
    </Box>
  );
};
