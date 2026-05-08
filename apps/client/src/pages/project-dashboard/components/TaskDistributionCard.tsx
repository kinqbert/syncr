import { Box, Paper, Stack, Typography } from "@mui/material";
import type { Task, TaskStatus as TaskStatusType } from "@syncr/packages";
import { TASK_STATUS_LABEL, TaskStatus } from "@syncr/packages";

type TaskDistributionCardProps = {
  tasks: Task[];
};

const statusOrder: TaskStatusType[] = [
  TaskStatus.Backlog,
  TaskStatus.Todo,
  TaskStatus.InProgress,
  TaskStatus.Review,
  TaskStatus.Done,
];

const getTaskCountByStatus = (tasks: Task[]) => {
  return statusOrder.reduce<Record<TaskStatusType, number>>(
    (counts, status) => ({
      ...counts,
      [status]: tasks.filter((task) => task.status === status).length,
    }),
    {
      [TaskStatus.Backlog]: 0,
      [TaskStatus.Todo]: 0,
      [TaskStatus.InProgress]: 0,
      [TaskStatus.Review]: 0,
      [TaskStatus.Done]: 0,
    },
  );
};

export const TaskDistributionCard = ({ tasks }: TaskDistributionCardProps) => {
  const statusCounts = getTaskCountByStatus(tasks);
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
        minWidth: 0,
        p: 2.5,
      }}
    >
      <Stack gap={3} height="100%">
        <Typography fontSize={17} fontWeight={800}>
          Task Distribution
        </Typography>
        <Stack
          alignItems="end"
          direction="row"
          gap={2}
          sx={{
            flex: 1,
            minHeight: 230,
            minWidth: 0,
            overflowX: "auto",
            pb: 1,
          }}
        >
          {statusOrder.map((status) => {
            const count = statusCounts[status];
            const height = Math.max((count / maxStatusCount) * 180, 10);

            return (
              <Stack
                key={status}
                alignItems="center"
                gap={1}
                sx={{ flex: "1 0 86px", minWidth: 0 }}
              >
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: "8px 8px 0 0",
                    height,
                    transition: "height 180ms ease",
                    width: "100%",
                  }}
                />
                <Typography color="text.secondary" fontSize={12}>
                  {TASK_STATUS_LABEL[status]}
                </Typography>
                <Typography fontSize={13} fontWeight={800}>
                  {count}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
};
