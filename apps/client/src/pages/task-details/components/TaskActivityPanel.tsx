import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { type TaskActivity, TaskActivityAction } from "@syncr/packages";
import { History } from "lucide-mui";

import { useGetTaskActivities } from "@/api/tasks";
import { RowSkeleton, Section } from "@/components/ui";
import { useProject } from "@/hooks";
import { formatDuration } from "@/utils/formatDuration";
import { formatRelativeDate } from "@/utils/formatRelativeDate";
import { getErrorMessage } from "@/utils/getErrorMessage";

const ACTIVITY_PAGE_SIZE = 5;

type TaskActivityPanelProps = {
  taskId: number;
};

const ACTIVITY_LABEL: Record<TaskActivityAction, string> = {
  [TaskActivityAction.TaskCreated]: "Task created",
  [TaskActivityAction.TaskUpdated]: "Task updated",
  [TaskActivityAction.TaskNameUpdated]: "Task name updated",
  [TaskActivityAction.TaskDescriptionUpdated]: "Description updated",
  [TaskActivityAction.TaskAssigneeUpdated]: "Assignee updated",
  [TaskActivityAction.TaskStatusUpdated]: "Status updated",
  [TaskActivityAction.TaskPriorityUpdated]: "Priority updated",
  [TaskActivityAction.TaskDeadlineUpdated]: "Deadline updated",
  [TaskActivityAction.TaskEstimateUpdated]: "Estimate updated",
  [TaskActivityAction.TaskLabelsUpdated]: "Labels updated",
  [TaskActivityAction.TaskCommentAdded]: "Comment added",
  [TaskActivityAction.AcceptanceCriterionCreated]: "Acceptance criterion added",
  [TaskActivityAction.AcceptanceCriterionUpdated]:
    "Acceptance criterion updated",
  [TaskActivityAction.AcceptanceCriterionDeleted]:
    "Acceptance criterion deleted",
};

const getActorName = (activity: TaskActivity) => {
  return activity.actor
    ? `${activity.actor.name} ${activity.actor.surname}`.trim()
    : "Deleted user";
};

const getTitleChangeText = (activity: TaskActivity) => {
  if (
    activity.action !== TaskActivityAction.TaskNameUpdated ||
    !activity.previousValue ||
    !activity.newValue
  ) {
    return null;
  }

  return `"${activity.previousValue}" to "${activity.newValue}"`;
};

const getEstimateChangeText = (activity: TaskActivity) => {
  if (activity.action !== TaskActivityAction.TaskEstimateUpdated) {
    return null;
  }

  const previousValue = activity.previousValue
    ? Number(activity.previousValue)
    : null;
  const newValue = activity.newValue ? Number(activity.newValue) : null;

  return `${formatDuration(previousValue)} to ${formatDuration(newValue)}`;
};

export const TaskActivityPanel = ({ taskId }: TaskActivityPanelProps) => {
  const { projectId } = useProject();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isPending,
  } = useGetTaskActivities(projectId, taskId, ACTIVITY_PAGE_SIZE);

  const activities = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Section icon={<History />} title="Activity">
      <Stack>
        {isPending ? <RowSkeleton count={3} /> : null}

        {isError ? (
          <Alert severity="error">
            {getErrorMessage(error, "Could not load task activity.")}
          </Alert>
        ) : null}

        {!isPending && !isError && activities.length === 0 ? (
          <Typography color="text.secondary">No activity yet.</Typography>
        ) : null}

        {!isError &&
          activities.map((activity, index) => {
            const details = [
              getTitleChangeText(activity),
              getEstimateChangeText(activity),
            ].filter(Boolean);
            const isLast = index === activities.length - 1 && !hasNextPage;

            return (
              <Stack direction="row" gap={1.25} key={activity.id}>
                <Stack alignItems="center" sx={{ pt: 0.75, width: 8 }}>
                  <Box
                    sx={{
                      bgcolor: "line.strong",
                      borderRadius: "50%",
                      flexShrink: 0,
                      height: 7,
                      width: 7,
                    }}
                  />
                  {!isLast && (
                    <Box sx={{ bgcolor: "divider", flex: 1, mt: 0.5, width: "1px" }} />
                  )}
                </Stack>
                <Stack minWidth={0} sx={{ pb: 1.5 }}>
                  <Typography sx={{ overflowWrap: "anywhere" }}>
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {getActorName(activity)}
                    </Box>{" "}
                    <Box component="span" sx={{ color: "text.secondary" }}>
                      {ACTIVITY_LABEL[activity.action].toLowerCase()}
                    </Box>
                    {details.length > 0 && <> · {details.join(" · ")}</>}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {formatRelativeDate(activity.createdAt)}
                  </Typography>
                </Stack>
              </Stack>
            );
          })}

        {!isError && hasNextPage ? (
          <Button
            color="inherit"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
            size="small"
            sx={{ alignSelf: "flex-start", color: "text.secondary" }}
          >
            {isFetchingNextPage ? "Loading…" : "Show more"}
          </Button>
        ) : null}
      </Stack>
    </Section>
  );
};
