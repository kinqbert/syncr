import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { CreateTaskBody, TaskPriority, TaskStatus } from "@syncr/packages";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { getErrorMessage } from "@/utils/getErrorMessage";

import { MIN_TASK_CARD_WIDTH } from "./TaskCard";

export type KanbanColumn = { status: TaskStatus; label: string };

type TaskFormState = {
  name: string;
  description: string;
  priority: TaskPriority;
  endDate: string;
};

type CreateTaskFormBody = Omit<CreateTaskBody, "assigneeId">;

type KanbanColumnProps = {
  children: React.ReactNode;
  column: KanbanColumn;
  isCreating?: boolean;
  onCreateTask: (body: CreateTaskFormBody) => Promise<void>;
};

const createDefaultFormState = (): TaskFormState => ({
  name: "",
  description: "",
  priority: "medium",
  endDate: "",
});

export const KanbanColumn = ({
  children,
  column,
  isCreating = false,
  onCreateTask,
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id: column.status });
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const handleOpenForm = () => {
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (isCreating) {
      return;
    }

    setFormError(null);
    reset(createDefaultFormState());
    setIsFormOpen(false);
  };

  const handleCreateTask = async (formState: TaskFormState) => {
    setFormError(null);

    try {
      await onCreateTask({
        name: formState.name.trim(),
        description: formState.description.trim() || null,
        priority: formState.priority,
        status: column.status,
        endDate: formState.endDate || null,
      });

      reset(createDefaultFormState());
      setIsFormOpen(false);
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not create task."));
    }
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{ flex: `0 0 ${MIN_TASK_CARD_WIDTH}px`, width: "100%" }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography>{column.label}</Typography>
        <Tooltip title={isFormOpen ? "Close form" : "Create task"}>
          <IconButton
            aria-label={isFormOpen ? "Close task form" : "Create task"}
            disabled={isCreating}
            onClick={isFormOpen ? handleCloseForm : handleOpenForm}
          >
            {isFormOpen ? <CloseIcon /> : <AddIcon />}
          </IconButton>
        </Tooltip>
      </Stack>

      {isFormOpen && (
        <ClickAwayListener onClickAway={handleCloseForm}>
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
                  onClick={handleCloseForm}
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
      )}

      {children}
    </Box>
  );
};
