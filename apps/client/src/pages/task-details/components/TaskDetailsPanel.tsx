import {
  Autocomplete,
  Box,
  Chip,
  MenuItem,
  Stack,
  type SxProps,
  TextField,
  type Theme,
  Typography,
} from "@mui/material";
import {
  type ProjectAssignee,
  type ProjectLabel,
  type Task,
  TaskPriority,
  TaskStatus,
  type UpdateTaskBody,
} from "@syncr/packages";
import { type ReactNode, useState } from "react";

import { useUpdateTask } from "@/api/tasks";
import { PriorityBadge, Section, StatusBadge } from "@/components/ui";
import { UserAvatar } from "@/components/UserAvatar";
import { useProject } from "@/hooks";
import { formatDuration } from "@/utils/formatDuration";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getUserFullName } from "@/utils/getUserFullName";

import { toDateInputValue } from "../utils/format";

type TaskDetailsPanelProps = {
  isAssigneesPending: boolean;
  isLabelsPending: boolean;
  projectAssignees: ProjectAssignee[];
  projectLabels: ProjectLabel[];
  task: Task;
};

/** Borderless control that only shows its frame on hover and focus. */
const ghostFieldSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  "& .MuiOutlinedInput-root": { bgcolor: "transparent" },
  "& .MuiOutlinedInput-root:not(.Mui-focused) .MuiOutlinedInput-notchedOutline":
    { borderColor: "transparent" },
  "& .MuiOutlinedInput-root:hover:not(.Mui-focused)": {
    bgcolor: "surface.hover",
  },
  "& .MuiSelect-icon": { opacity: 0 },
  "&:hover .MuiSelect-icon, & .Mui-focused .MuiSelect-icon": { opacity: 1 },
};

const PropertyRow = ({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) => (
  <Stack alignItems="center" direction="row" gap={1} minHeight={34}>
    <Typography
      color="text.secondary"
      sx={{ flexShrink: 0, width: 84 }}
      variant="body2"
    >
      {label}
    </Typography>
    {children}
  </Stack>
);

export const TaskDetailsPanel = ({
  isAssigneesPending,
  isLabelsPending,
  projectAssignees,
  projectLabels,
  task,
}: TaskDetailsPanelProps) => {
  const { projectId } = useProject();
  const updateTask = useUpdateTask();
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState(String(task.estimateMinutes ?? ""));
  const [syncedEstimate, setSyncedEstimate] = useState(task.estimateMinutes);

  // Reset the draft when the saved estimate changes (e.g. from another tab).
  if (syncedEstimate !== task.estimateMinutes) {
    setSyncedEstimate(task.estimateMinutes);
    setEstimate(String(task.estimateMinutes ?? ""));
  }

  // Each property saves on its own as soon as it changes.
  const save = async (body: UpdateTaskBody) => {
    setError(null);

    try {
      await updateTask.mutateAsync({ projectId, taskId: task.id, body });
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Could not update task."));
    }
  };

  const saveEstimate = () => {
    const minutes = Number(estimate) || 0;

    if (minutes % 15 !== 0) {
      setError("Estimate must be divisible by 15 minutes.");
      return;
    }

    const next = minutes === 0 ? null : minutes;

    if (next !== task.estimateMinutes) {
      void save({ estimateMinutes: next });
    }
  };

  const labelNames = task.labels.map((label) => label.name);

  return (
    <Section title="Properties">
      <Stack gap={0.25} sx={{ mx: -0.5 }}>
        {error && (
          <Typography color="error" sx={{ mb: 1, px: 0.5 }} variant="body2">
            {error}
          </Typography>
        )}

        <PropertyRow label="Status">
          <TextField
            onChange={(event) =>
              void save({ status: event.target.value as TaskStatus })
            }
            select
            size="small"
            slotProps={{
              select: {
                renderValue: (value) => (
                  <StatusBadge status={value as TaskStatus} />
                ),
              },
            }}
            sx={ghostFieldSx}
            value={task.status}
          >
            {(Object.values(TaskStatus) as TaskStatus[]).map((status) => (
              <MenuItem key={status} value={status}>
                <StatusBadge status={status} />
              </MenuItem>
            ))}
          </TextField>
        </PropertyRow>

        <PropertyRow label="Priority">
          <TextField
            onChange={(event) =>
              void save({ priority: event.target.value as TaskPriority })
            }
            select
            size="small"
            slotProps={{
              select: {
                renderValue: (value) => (
                  <PriorityBadge priority={value as TaskPriority} />
                ),
              },
            }}
            sx={ghostFieldSx}
            value={task.priority}
          >
            {(Object.values(TaskPriority) as TaskPriority[]).map((priority) => (
              <MenuItem key={priority} value={priority}>
                <PriorityBadge priority={priority} />
              </MenuItem>
            ))}
          </TextField>
        </PropertyRow>

        <PropertyRow label="Assignee">
          <TextField
            disabled={isAssigneesPending}
            onChange={(event) =>
              void save({
                assigneeId: event.target.value
                  ? Number(event.target.value)
                  : null,
              })
            }
            select
            size="small"
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: () =>
                  task.assignee ? (
                    <Stack alignItems="center" direction="row" gap={1}>
                      <UserAvatar
                        name={task.assignee.name}
                        size={20}
                        surname={task.assignee.surname}
                      />
                      <Typography noWrap variant="body2">
                        {getUserFullName(
                          task.assignee.name,
                          task.assignee.surname,
                        )}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography color="text.disabled" variant="body2">
                      Unassigned
                    </Typography>
                  ),
              },
            }}
            sx={ghostFieldSx}
            value={task.assignee?.id ?? ""}
          >
            <MenuItem divider value="">
              Unassigned
            </MenuItem>
            {projectAssignees.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <UserAvatar name={user.name} size={20} surname={user.surname} />
                <Stack minWidth={0}>
                  <Typography noWrap variant="body2">
                    {getUserFullName(user.name, user.surname)}
                  </Typography>
                  <Typography color="text.secondary" noWrap variant="caption">
                    {user.email}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </PropertyRow>

        <PropertyRow label="Due date">
          <TextField
            onChange={(event) => void save({ endDate: event.target.value || null })}
            size="small"
            sx={ghostFieldSx}
            type="date"
            value={toDateInputValue(task.endDate)}
          />
        </PropertyRow>

        <PropertyRow label="Estimate">
          <TextField
            onBlur={saveEstimate}
            onChange={(event) => setEstimate(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                (event.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Minutes"
            size="small"
            slotProps={{
              htmlInput: { min: 0, step: 15 },
              input: {
                endAdornment: (
                  <Typography
                    color="text.secondary"
                    noWrap
                    sx={{ flexShrink: 0, pr: 1 }}
                    variant="body2"
                  >
                    {formatDuration(Number(estimate) || 0)}
                  </Typography>
                ),
              },
            }}
            sx={[ghostFieldSx, { "& input": { minWidth: 0 } }]}
            type="number"
            value={estimate}
          />
        </PropertyRow>

        <Stack direction="row" gap={1} sx={{ pt: 0.75 }}>
          <Typography
            color="text.secondary"
            sx={{ flexShrink: 0, pt: 0.75, width: 84 }}
            variant="body2"
          >
            Labels
          </Typography>
          <Box flex={1} minWidth={0}>
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
                void save({
                  labelNames: value.map((option) =>
                    typeof option === "string" ? option : option.name,
                  ),
                })
              }
              options={projectLabels}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={labelNames.length === 0 ? "Add label" : ""}
                  size="small"
                  sx={ghostFieldSx}
                />
              )}
              renderValue={(value, getItemProps) =>
                value.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index });

                  return (
                    <Chip
                      key={key}
                      label={typeof option === "string" ? option : option.name}
                      size="small"
                      variant="outlined"
                      {...itemProps}
                    />
                  );
                })
              }
              size="small"
              value={labelNames}
            />
          </Box>
        </Stack>
      </Stack>
    </Section>
  );
};
