import {
  Autocomplete,
  Avatar,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  type ProjectAssignee,
  type ProjectLabel,
  type Task,
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
  TaskPriority,
  TaskStatus,
  type UpdateTaskBody,
} from "@syncr/packages";
import { useState } from "react";

import { projectsKeys } from "@/api/projects";
import { useSetTaskAssignee, useUpdateTask } from "@/api/tasks";
import { queryClient } from "@/lib/react-query";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { Panel } from "../../../components/Panel";
import { updateTaskInCache } from "../utils/updateTaskInCache";

type TaskDetailsPanelProps = {
  isAssigneesPending: boolean;
  isLabelsPending: boolean;
  projectId: number;
  projectAssignees: ProjectAssignee[];
  projectLabels: ProjectLabel[];
  task: Task;
};

const toDateInputValue = (value: string | null) => {
  return value ? value.slice(0, 10) : "";
};

const getUserInitials = (name: string, surname: string) => {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
};

const getUserName = (name: string, surname: string) => {
  return `${name} ${surname}`.trim();
};

export const TaskDetailsPanel = ({
  isAssigneesPending,
  isLabelsPending,
  projectId,
  projectAssignees,
  projectLabels,
  task,
}: TaskDetailsPanelProps) => {
  const updateTask = useUpdateTask();
  const setTaskAssignee = useSetTaskAssignee();
  const [error, setError] = useState<string | null>(null);
  const assignee = projectAssignees.find(
    (user) => user.id === task.assignee?.id,
  );

  const saveTask = async (body: UpdateTaskBody) => {
    setError(null);

    try {
      const updatedTask = await updateTask.mutateAsync({
        projectId,
        taskId: task.id,
        body,
      });

      updateTaskInCache(projectId, updatedTask);

      if (body.labelNames) {
        void queryClient.invalidateQueries({
          queryKey: projectsKeys.projectLabels(projectId),
        });
      }
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Could not update task."));
    }
  };

  const saveAssignee = async (assigneeId: number | null) => {
    if ((task.assignee?.id ?? null) === assigneeId) {
      return;
    }

    setError(null);

    try {
      const updatedTask = await setTaskAssignee.mutateAsync({
        projectId,
        taskId: task.id,
        body: { assigneeId },
      });

      updateTaskInCache(projectId, updatedTask);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Could not update task assignee."));
    }
  };

  return (
    <Panel>
      <Stack gap={2}>
        <Typography variant="subtitle1">Details</Typography>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Stack gap={1}>
          <Typography color="text.secondary" variant="caption">
            Assigned To
          </Typography>
          <TextField
            disabled={isAssigneesPending || setTaskAssignee.isPending}
            helperText={
              projectAssignees.length === 0
                ? "No users are assigned to this project."
                : undefined
            }
            onChange={(event) =>
              void saveAssignee(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            select
            size="small"
            value={task.assignee?.id ?? ""}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {task.assignee && !assignee ? (
              <MenuItem disabled value={task.assignee.id}>
                {getUserName(task.assignee.name, task.assignee.surname)}
              </MenuItem>
            ) : null}
            {projectAssignees.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Stack alignItems="center" direction="row" gap={1.25}>
                  <Avatar sx={{ height: 28, width: 28 }}>
                    {getUserInitials(user.name, user.surname)}
                  </Avatar>
                  <Stack minWidth={0}>
                    <Typography variant="body2">
                      {getUserName(user.name, user.surname)}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {user.email}
                    </Typography>
                  </Stack>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <TextField
          label="Priority"
          onChange={(event) =>
            void saveTask({
              priority: event.target.value as TaskPriority,
            })
          }
          select
          size="small"
          value={task.priority}
        >
          {(Object.values(TaskPriority) as TaskPriority[]).map((priority) => (
            <MenuItem key={priority} value={priority}>
              {TASK_PRIORITY_LABEL[priority]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Deadline"
          onChange={(event) =>
            void saveTask({ endDate: event.target.value || null })
          }
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          type="date"
          value={toDateInputValue(task.endDate)}
        />

        <TextField
          label="Status"
          onChange={(event) =>
            void saveTask({ status: event.target.value as TaskStatus })
          }
          select
          size="small"
          value={task.status}
        >
          {(Object.values(TaskStatus) as TaskStatus[]).map((status) => (
            <MenuItem key={status} value={status}>
              {TASK_STATUS_LABEL[status]}
            </MenuItem>
          ))}
        </TextField>

        <Stack gap={1}>
          <Typography color="text.secondary" variant="caption">
            Labels
          </Typography>
          <Autocomplete<ProjectLabel, true, false, true>
            autoSelect
            disabled={isLabelsPending || updateTask.isPending}
            filterSelectedOptions
            freeSolo
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            isOptionEqualToValue={(option, value) =>
              typeof value !== "string" && option.id === value.id
            }
            multiple
            onChange={(_, value) =>
              void saveTask({
                labelNames: value.map((option) =>
                  typeof option === "string" ? option : option.name,
                ),
              })
            }
            options={projectLabels}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={task.labels.length === 0 ? "Add label" : ""}
                size="small"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });

                return (
                  <Chip
                    key={key}
                    label={typeof option === "string" ? option : option.name}
                    size="small"
                    {...tagProps}
                  />
                );
              })
            }
            size="small"
            value={task.labels}
          />
        </Stack>
      </Stack>
    </Panel>
  );
};
