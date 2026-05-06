import { Chip, Divider, Stack, Typography } from "@mui/material";
import {
  type Task,
  TASK_STATUS_LABEL,
  type UpdateTaskAcceptanceCriterionBody,
  type UpdateTaskBody,
} from "@syncr/packages";
import { useState } from "react";

import {
  useCreateTaskAcceptanceCriterion,
  useDeleteTaskAcceptanceCriterion,
  useUpdateTask,
  useUpdateTaskAcceptanceCriterion,
} from "@/api/tasks";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { AcceptanceCriteriaSection } from "./AcceptanceCriteriaSection";
import { EditableText } from "../../../components/EditableText";
import { Panel } from "../../../components/Panel";
import { updateTaskInCache } from "../utils/updateTaskInCache";

type TaskOverviewPanelProps = {
  projectId: number;
  task: Task;
};

export const TaskOverviewPanel = ({
  projectId,
  task,
}: TaskOverviewPanelProps) => {
  const updateTask = useUpdateTask();
  const createTaskAcceptanceCriterion = useCreateTaskAcceptanceCriterion();
  const updateTaskAcceptanceCriterion = useUpdateTaskAcceptanceCriterion();
  const deleteTaskAcceptanceCriterion = useDeleteTaskAcceptanceCriterion();
  const [error, setError] = useState<string | null>(null);

  const saveTask = async (body: UpdateTaskBody) => {
    setError(null);

    try {
      const updatedTask = await updateTask.mutateAsync({
        projectId,
        taskId: task.id,
        body,
      });

      updateTaskInCache(projectId, updatedTask);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Could not update task."));
    }
  };

  const saveAcceptanceCriterion = async (
    criterionId: number,
    body: UpdateTaskAcceptanceCriterionBody,
  ) => {
    setError(null);

    try {
      const updatedTask = await updateTaskAcceptanceCriterion.mutateAsync({
        projectId,
        taskId: task.id,
        criterionId,
        body,
      });

      updateTaskInCache(projectId, updatedTask);
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, "Could not update acceptance criterion."),
      );
    }
  };

  const addAcceptanceCriterion = async (description: string) => {
    setError(null);

    try {
      const updatedTask = await createTaskAcceptanceCriterion.mutateAsync({
        projectId,
        taskId: task.id,
        body: { description },
      });

      updateTaskInCache(projectId, updatedTask);
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, "Could not add acceptance criterion."),
      );
    }
  };

  const removeAcceptanceCriterion = async (criterionId: number) => {
    setError(null);

    try {
      const updatedTask = await deleteTaskAcceptanceCriterion.mutateAsync({
        projectId,
        taskId: task.id,
        criterionId,
      });

      updateTaskInCache(projectId, updatedTask);
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, "Could not remove acceptance criterion."),
      );
    }
  };

  return (
    <Panel>
      <Stack gap={2}>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Stack
          alignItems="flex-start"
          direction="row"
          gap={2}
          justifyContent="space-between"
        >
          <EditableText
            onSave={(name) => {
              if (!name) {
                throw new Error("Title is required.");
              }

              return saveTask({ name });
            }}
            value={task.name}
            variant="h5"
          />
          <Chip
            color="primary"
            label={TASK_STATUS_LABEL[task.status]}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <EditableText
          minRows={3}
          multiline
          onSave={(description) =>
            saveTask({ description: description || null })
          }
          placeholder="Click to add a description"
          value={task.description ?? ""}
        />
        <Divider />
        <AcceptanceCriteriaSection
          criteria={task.acceptanceCriteria}
          isCreating={createTaskAcceptanceCriterion.isPending}
          isDeleting={deleteTaskAcceptanceCriterion.isPending}
          isUpdating={updateTaskAcceptanceCriterion.isPending}
          onCreate={addAcceptanceCriterion}
          onDelete={removeAcceptanceCriterion}
          onUpdate={saveAcceptanceCriterion}
        />
      </Stack>
    </Panel>
  );
};
