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

import { useGetProject } from "@/api/projects";
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
  <Stack gap={0.75}>
    {Array.from({ length: 3 }, (_, index) => (
      <Skeleton height={72} key={index} variant="rounded" />
    ))}
  </Stack>
);

export const Kanban = ({
  isProjectAssigneesLoading = false,
  projectAssignees,
}: KanbanProps) => {
  const { projectId } = useProject();
  const { data: project } = useGetProject(projectId);
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
        gap={1.5}
        sx={{
          height: "100%",
          minWidth: "max-content",
        }}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            column={column}
            count={areTasksLoading ? 0 : tasksByStatus[column.status].length}
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
                <Stack gap={0.75}>
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
              transform: "rotate(2deg)",
              width: { xs: `min(80vw, ${TASK_CARD_WIDTH}px)`, sm: TASK_CARD_WIDTH },
            }}
          >
            <TaskCard isOverlay projectName={project?.name} task={activeTask} />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
