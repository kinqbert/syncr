import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  CreateProjectBody,
  Project,
  ProjectManagerCandidate,
} from "@syncr/packages";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { UserAvatar } from "@/components/UserAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import { getErrorMessage } from "@/utils/getErrorMessage";

type ProjectFormState = {
  name: string;
  managerId: string;
  startDate: string;
  endDate: string;
};

type ProjectFormDialogProps = {
  isManagersLoading: boolean;
  isOpen: boolean;
  isSaving: boolean;
  managerCandidates: ProjectManagerCandidate[];
  onClose: () => void;
  onSave: (projectId: number | null, body: CreateProjectBody) => Promise<void>;
  project: Project | null;
};

const toDateInputValue = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 10);
};

const createInitialFormState = (
  project?: Project | null,
): ProjectFormState => ({
  name: project?.name ?? "",
  managerId: project?.managerId ? String(project.managerId) : "",
  startDate: project?.startDate
    ? toDateInputValue(new Date(project.startDate))
    : toDateInputValue(new Date()),
  endDate: project?.endDate ? toDateInputValue(new Date(project.endDate)) : "",
});

export const ProjectFormDialog = ({
  isManagersLoading,
  isOpen,
  isSaving,
  managerCandidates,
  onClose,
  onSave,
  project,
}: ProjectFormDialogProps) => {
  const currentUserId = useAuthStore((state) => state.user?.id ?? null);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormState>({
    defaultValues: createInitialFormState(project),
  });
  const [formError, setFormError] = useState<string | null>(null);
  const selectedManagerId = useWatch({ control, name: "managerId" });
  const currentUserCandidate = managerCandidates.find(
    (manager) => manager.id === currentUserId,
  );

  const isCurrentUserSelected =
    currentUserId !== null && selectedManagerId === String(currentUserId);
  const canAssignCurrentUser =
    Boolean(currentUserCandidate) && !isSaving && !isManagersLoading;

  const handleSubmitProject = async (formState: ProjectFormState) => {
    setFormError(null);

    try {
      await onSave(project?.id ?? null, {
        name: formState.name.trim(),
        managerId: formState.managerId ? Number(formState.managerId) : null,
        startDate: formState.startDate,
        endDate: formState.endDate || null,
      });
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not save project."));
    }
  };

  const handleAssignCurrentUser = () => {
    if (!currentUserId) {
      return;
    }

    setValue("managerId", String(currentUserId), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={isOpen}>
      <DialogTitle>{project ? "Update project" : "Create project"}</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          gap={2}
          id="project-form"
          onSubmit={handleSubmit(handleSubmitProject)}
          pt={1}
        >
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            {...register("name", {
              required: "Project name is required.",
              validate: (value) =>
                value.trim().length >= 2 ||
                "Project name must be at least 2 characters long.",
            })}
            autoFocus
            disabled={isSaving}
            error={Boolean(errors.name)}
            fullWidth
            helperText={errors.name?.message}
            label="Project name"
          />
          <TextField
            {...register("startDate", {
              required: "Start date is required.",
            })}
            disabled={isSaving}
            error={Boolean(errors.startDate)}
            fullWidth
            helperText={errors.startDate?.message}
            label="Start date"
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
          />
          <TextField
            {...register("endDate")}
            disabled={isSaving}
            fullWidth
            label="Deadline"
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
          />
          <Box
            sx={{
              alignItems: "end",
              display: "grid",
              gap: 1,
              gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
            }}
          >
            <Controller
              control={control}
              name="managerId"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="project-manager-label">
                    Project manager
                  </InputLabel>
                  <Select
                    {...field}
                    disabled={isSaving || isManagersLoading}
                    label="Project manager"
                    labelId="project-manager-label"
                  >
                    <MenuItem divider value="">
                      Unassigned
                    </MenuItem>
                    {managerCandidates.map((manager) => (
                      <MenuItem key={manager.id} value={String(manager.id)}>
                        <Stack alignItems="center" direction="row" gap={1.25}>
                          <UserAvatar
                            name={manager.name}
                            size={28}
                            surname={manager.surname}
                          />
                          <Stack minWidth={0}>
                            <Typography noWrap variant="body2">
                              {manager.name} {manager.surname}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              noWrap
                              variant="caption"
                            >
                              {manager.email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Button
              disabled={!canAssignCurrentUser || isCurrentUserSelected}
              onClick={handleAssignCurrentUser}
              type="button"
              variant="outlined"
            >
              Set me
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={isSaving} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={isSaving}
          form="project-form"
          type="submit"
          variant="contained"
        >
          {project ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
