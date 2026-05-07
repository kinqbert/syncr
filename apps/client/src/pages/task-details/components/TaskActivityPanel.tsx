import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { type TaskActivity, TaskActivityAction } from "@syncr/packages";

import { useGetTaskActivities } from "@/api/tasks";
import { useProject } from "@/hooks";
import { formatDuration } from "@/utils/formatDuration";

import { Panel } from "../../../components/Panel";

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

const formatCreatedAt = (value: string) => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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

  const { data: activities = [], isPending } = useGetTaskActivities(
    projectId,
    taskId,
  );

  return (
    <Panel>
      <Stack gap={2}>
        <Typography variant="subtitle1">Activity</Typography>

        {isPending ? (
          <Stack alignItems="center" py={1}>
            <CircularProgress size={24} />
          </Stack>
        ) : null}

        {!isPending && activities.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No activity yet.
          </Typography>
        ) : null}

        {activities.map((activity) => {
          const finalTextArr = [ACTIVITY_LABEL[activity.action]];
          const titleChangeText = getTitleChangeText(activity);
          const estimateChangeText = getEstimateChangeText(activity);

          if (titleChangeText) {
            finalTextArr.push(titleChangeText);
          }

          if (estimateChangeText) {
            finalTextArr.push(estimateChangeText);
          }

          return (
            <Stack direction="row" gap={1.25} key={activity.id}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  height: 6,
                  mt: 0.75,
                  width: 6,
                  flexShrink: 0,
                }}
              />
              <Stack>
                <Typography
                  variant="body2"
                  sx={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
                >
                  {finalTextArr.join(". ")}
                </Typography>

                <Typography color="text.secondary" variant="caption">
                  {getActorName(activity)} -{" "}
                  {formatCreatedAt(activity.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Panel>
  );
};
