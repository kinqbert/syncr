import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Skeleton, Stack } from "@mui/material";
import {
  type CreateTaskBody,
  type ProjectAssignee,
  TaskStatus,
} from "@syncr/packages";

import { useCreateTask, useGetProjectTasks } from "@/api/tasks";
import { ErrorState } from "@/components/ErrorState";
import { useProject } from "@/hooks";

import { useKanbanDrag } from "../hooks/useKanbanDrag";
import { KanbanColumn } from "./KanbanColumn";
import { SortableTaskCard } from "./SortableTaskCard";
import { TASK_CARD_WIDTH, TaskCard } from "./TaskCard";

const columns: KanbanColumn[] = [
  {
    status: TaskStatus.Backlog,
    label: "Backlog",
  },
  {
    status: TaskStatus.Todo,
    label: "Todo",
  },
  {
    status: TaskStatus.InProgress,
    label: "In Progress",
  },
  {
    status: TaskStatus.Review,
    label: "Review",
  },
  {
    status: TaskStatus.Done,
    label: "Done",
  },
];

const columnStatuses = columns.map((column) => column.status);

type KanbanProps = {
  isProjectAssigneesLoading?: boolean;
  projectAssignees: ProjectAssignee[];
};

type CreateTaskFormBody = CreateTaskBody;

const renderTaskSkeletons = () => (
  <Stack gap={1}>
    {Array.from({ length: 3 }, (_, index) => (
      <Skeleton
        key={index}
        height={112}
        sx={{ borderRadius: 2 }}
        variant="rectangular"
      />
    ))}
  </Stack>
);

export const Kanban = ({
  isProjectAssigneesLoading = false,
  projectAssignees,
}: KanbanProps) => {
  const { projectId } = useProject();
  const {
    data: tasks,
    error: tasksError,
    isError: areTasksError,
    isLoading: areTasksLoading,
  } = useGetProjectTasks(projectId);
  const createTask = useCreateTask();
  const {
    activeTask,
    dragOverStatus,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    sensors,
    tasksByStatus,
  } = useKanbanDrag({
    columnStatuses,
    tasks,
  });
  const isBoardBusy =
    createTask.isPending || areTasksLoading || isProjectAssigneesLoading;

  const handleCreateTask = async (body: CreateTaskFormBody) => {
    await createTask.mutateAsync({
      projectId,
      body,
    });
  };

  if (areTasksError) {
    return (
      <ErrorState
        error={tasksError}
        fallback="Could not load tasks."
        title="Could not load tasks."
      />
    );
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Stack
        alignItems="stretch"
        direction="row"
        gap={{ xs: 1.25, sm: 1.5 }}
        sx={{
          minWidth: "max-content",
          pb: 0.5,
        }}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            column={column}
            isDragOver={dragOverStatus === column.status}
            isCreating={isBoardBusy}
            isLoading={areTasksLoading}
            onCreateTask={handleCreateTask}
            projectAssignees={projectAssignees}
          >
            {areTasksLoading ? (
              renderTaskSkeletons()
            ) : (
              <SortableContext
                items={tasksByStatus[column.status].map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <Stack gap={1}>
                  {tasksByStatus[column.status].map((task) => (
                    <SortableTaskCard key={task.id} task={task} />
                  ))}
                </Stack>
              </SortableContext>
            )}
          </KanbanColumn>
        ))}
      </Stack>
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <Box
            sx={{
              cursor: "grabbing",
              transform: "rotate(1deg)",
              width: { xs: "min(82vw, 360px)", sm: TASK_CARD_WIDTH },
            }}
          >
            <TaskCard task={activeTask} />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
