import { Box, Button, Stack } from "@mui/material";
import { TaskStatus } from "@syncr/packages";
import { ArrowRight, ListTodo } from "lucide-mui";
import { Link } from "react-router";

import { useGetMyAssignedTasks } from "@/api/tasks";
import {
  EmptyState,
  ListRow,
  PriorityIcon,
  RowSkeleton,
  Section,
  StatusIcon,
} from "@/components/ui";
import {
  DUE_STATE_COLOR,
  formatDueDate,
  getDueState,
} from "@/utils/formatDueDate";
import { getTaskDisplayName } from "@/utils/getTaskDisplayName";

const MAX_TASKS = 8;

const byDeadline = (a: string | null, b: string | null) => {
  if (a === b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return new Date(a).getTime() - new Date(b).getTime();
};

/** The signed-in user's open tasks, soonest deadline first. */
export const MyTasksPanel = () => {
  const { data: tasks = [], isLoading } = useGetMyAssignedTasks();

  const openTasks = tasks
    .filter((task) => task.status !== TaskStatus.Done)
    .sort((a, b) => byDeadline(a.endDate, b.endDate));

  return (
    <Section
      actions={
        openTasks.length > MAX_TASKS ? (
          <Button
            component={Link}
            endIcon={<ArrowRight />}
            size="small"
            to="/calendar"
          >
            View all
          </Button>
        ) : undefined
      }
      description={
        isLoading ? undefined : `${openTasks.length} open assigned to you`
      }
      icon={<ListTodo />}
      padding="none"
      title="My tasks"
    >
      <Box sx={{ p: 1 }}>
        {isLoading ? (
          <RowSkeleton count={4} />
        ) : openTasks.length === 0 ? (
          <EmptyState
            compact
            description="Tasks assigned to you will show up here."
            title="You're all caught up"
          />
        ) : (
          openTasks.slice(0, MAX_TASKS).map((task) => {
            const dueState = getDueState(task.endDate);

            return (
              <ListRow
                key={task.id}
                leading={
                  <Stack alignItems="center" direction="row" gap={1}>
                    <PriorityIcon priority={task.priority} />
                    <StatusIcon status={task.status} />
                  </Stack>
                }
                title={getTaskDisplayName(task.name, task.project.name)}
                to={`/projects/${task.project.id}/tasks/${task.id}`}
                trailing={
                  <Stack component="span" direction="row" gap={1.5}>
                    <Box
                      component="span"
                      sx={{ display: { xs: "none", sm: "inline" } }}
                    >
                      {task.project.name}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        color: DUE_STATE_COLOR[dueState],
                        minWidth: 64,
                        textAlign: "right",
                      }}
                    >
                      {formatDueDate(task.endDate)}
                    </Box>
                  </Stack>
                }
              />
            );
          })
        )}
      </Box>
    </Section>
  );
};
