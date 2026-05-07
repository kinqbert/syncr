import {
  Alert,
  Box,
  Button,
  ClickAwayListener,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type {
  CreateTaskBody,
  ProjectAssignee,
  TaskPriority,
  TaskStatus,
} from "@syncr/packages";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { getErrorMessage } from "@/utils/getErrorMessage";
import { getUserFullName } from "@/utils/getUserFullName";

type TaskFormState = {
  name: string;
  description: string;
  assigneeId: string;
  priority: TaskPriority;
  endDate: string;
};

type TaskCreateFormProps = {
  isCreating: boolean;
  onClose: () => void;
  onCreateTask: (body: CreateTaskBody) => Promise<void>;
  projectAssignees: ProjectAssignee[];
  status: TaskStatus;
};

const createDefaultFormState = (): TaskFormState => ({
  name: "",
  description: "",
  assigneeId: "",
  priority: "medium",
  endDate: "",
});

export const TaskCreateForm = ({
  isCreating,
  onClose,
  onCreateTask,
  projectAssignees,
  status,
}: TaskCreateFormProps) => {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<TaskFormState>({
    defaultValues: createDefaultFormState(),
  });

  const handleClose = () => {
    if (isCreating) {
      return;
    }

    setFormError(null);
    reset(createDefaultFormState());
    onClose();
  };

  const handleCreateTask = async (formState: TaskFormState) => {
    setFormError(null);

    try {
      await onCreateTask({
        name: formState.name.trim(),
        description: formState.description.trim() || null,
        assigneeId: formState.assigneeId
          ? Number(formState.assigneeId)
          : undefined,
        priority: formState.priority,
        status,
        endDate: formState.endDate || null,
      });

      reset(createDefaultFormState());
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not create task."));
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleCreateTask)}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mt: 1.5,
          p: 1.5,
        }}
      >
        <Stack gap={1.5}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            {...register("name", {
              required: "Task name is required.",
              validate: (value) =>
                value.trim().length >= 2 ||
                "Task name must be at least 2 characters long.",
            })}
            autoFocus
            disabled={isCreating}
            error={Boolean(errors.name)}
            fullWidth
            helperText={errors.name?.message}
            label="Task name"
            size="small"
          />
          <TextField
            {...register("description")}
            disabled={isCreating}
            fullWidth
            label="Description"
            minRows={2}
            multiline
            size="small"
          />
          <Controller
            control={control}
            name="assigneeId"
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isCreating}
                fullWidth
                helperText={
                  projectAssignees.length === 0
                    ? "No users are assigned to this project."
                    : undefined
                }
                label="Assignee"
                select
                size="small"
                slotProps={{
                  select: {
                    MenuProps: {
                      disablePortal: true,
                    },
                  },
                }}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {projectAssignees.map((assignee) => (
                  <MenuItem key={assignee.id} value={String(assignee.id)}>
                    {getUserFullName(assignee.name, assignee.surname)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isCreating}
                fullWidth
                label="Priority"
                select
                size="small"
                slotProps={{
                  select: {
                    MenuProps: {
                      disablePortal: true,
                    },
                  },
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
            )}
          />
          <TextField
            {...register("endDate")}
            disabled={isCreating}
            fullWidth
            label="Deadline"
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
          />
          <Stack direction="row" gap={1} justifyContent="flex-end">
            <Button
              disabled={isCreating}
              onClick={handleClose}
              size="small"
              type="button"
            >
              Cancel
            </Button>
            <Button
              disabled={isCreating}
              size="small"
              type="submit"
              variant="contained"
            >
              Create
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ClickAwayListener>
  );
};
