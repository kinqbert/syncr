import {
  Autocomplete,
  Avatar,
  Button,
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
import { useMemo, useState } from "react";

import { useUpdateTask } from "@/api/tasks";
import { formatDuration } from "@/utils/formatDuration";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getUserFullName } from "@/utils/getUserFullName";
import { getUserInitials } from "@/utils/getUserInitials";

import { Panel } from "../../../components/Panel";
import { toDateInputValue } from "../utils/format";

type TaskDetailsPanelProps = {
  isAssigneesPending: boolean;
  isLabelsPending: boolean;
  projectId: number;
  projectAssignees: ProjectAssignee[];
  projectLabels: ProjectLabel[];
  task: Task;
};

const getChangedFields = (task: Task, form: FormState): UpdateTaskBody => {
  const estimate = Number(form.estimateMinutes);

  const body: UpdateTaskBody = {};

  if ((task.assignee?.id ?? null) !== form.assigneeId) {
    body.assigneeId = form.assigneeId;
  }

  if (form.priority !== task.priority) {
    body.priority = form.priority;
  }

  if (form.status !== task.status) {
    body.status = form.status;
  }

  if (form.endDate !== toDateInputValue(task.endDate)) {
    body.endDate = form.endDate || null;
  }

  if ((estimate === 0 ? null : estimate) !== task.estimateMinutes) {
    body.estimateMinutes = estimate === 0 ? null : estimate;
  }

  const originalLabels = task.labels.map((label) => label.name).sort();

  const currentLabels = [...form.labelNames].sort();

  if (JSON.stringify(originalLabels) !== JSON.stringify(currentLabels)) {
    body.labelNames = form.labelNames;
  }

  return body;
};

const createFormState = (task: Task): FormState => ({
  assigneeId: task.assignee?.id ?? null,
  priority: task.priority,
  endDate: toDateInputValue(task.endDate),
  estimateMinutes: String(task.estimateMinutes ?? 0),
  status: task.status,
  labelNames: task.labels.map((label) => label.name),
});

type FormState = {
  assigneeId: number | null;
  priority: TaskPriority;
  endDate: string;
  estimateMinutes: string;
  status: TaskStatus;
  labelNames: string[];
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

  const [error, setError] = useState<string | null>(null);
  const initialState: FormState = useMemo(() => createFormState(task), [task]);

  const [form, setForm] = useState<FormState>(initialState);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialState);
  const handleSave = async () => {
    setError(null);

    const estimate = Number(form.estimateMinutes);

    if (estimate && estimate % 15 !== 0) {
      setError("Estimate must be divisible by 15 minutes.");
      return;
    }

    try {
      const body = getChangedFields(task, form);

      if (Object.keys(body).length > 0) {
        await updateTask.mutateAsync({
          projectId,
          taskId: task.id,
          body,
        });
      }
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Could not update task."));
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
            disabled={isAssigneesPending}
            helperText={
              projectAssignees.length === 0
                ? "No users are assigned to this project."
                : undefined
            }
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                assigneeId: event.target.value
                  ? Number(event.target.value)
                  : null,
              }))
            }
            select
            size="small"
            value={form.assigneeId ?? ""}
          >
            <MenuItem value="">Unassigned</MenuItem>

            {projectAssignees.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Stack alignItems="center" direction="row" gap={1.25}>
                  <Avatar sx={{ height: 28, width: 28 }}>
                    {getUserInitials(user.name, user.surname)}
                  </Avatar>

                  <Stack minWidth={0}>
                    <Typography variant="body2">
                      {getUserFullName(user.name, user.surname)}
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
            setForm((prev) => ({
              ...prev,
              priority: event.target.value as TaskPriority,
            }))
          }
          select
          size="small"
          value={form.priority}
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
            setForm((prev) => ({
              ...prev,
              endDate: event.target.value,
            }))
          }
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          type="date"
          value={form.endDate}
        />

        <TextField
          label="Estimate (minutes)"
          helperText={formatDuration(Number(form.estimateMinutes) || 0)}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              estimateMinutes: event.target.value,
            }))
          }
          size="small"
          slotProps={{
            htmlInput: {
              min: 0,
              step: 15,
            },
          }}
          type="number"
          value={form.estimateMinutes}
        />

        <TextField
          label="Status"
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              status: event.target.value as TaskStatus,
            }))
          }
          select
          size="small"
          value={form.status}
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
            disabled={isLabelsPending}
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
              setForm((prev) => ({
                ...prev,
                labelNames: value.map((option) =>
                  typeof option === "string" ? option : option.name,
                ),
              }))
            }
            options={projectLabels}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={form.labelNames.length === 0 ? "Add label" : ""}
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
            value={form.labelNames}
          />
        </Stack>

        {isDirty && (
          <Button
            disabled={updateTask.isPending}
            onClick={() => void handleSave()}
            variant="contained"
          >
            Save Changes
          </Button>
        )}
      </Stack>
    </Panel>
  );
};
