import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Stack } from "@mui/material";
import { type CreateTaskBody, TaskStatus } from "@syncr/packages";

import { useCreateTask, useGetProjectTasks } from "@/api/tasks";
import { queryClient } from "@/lib/react-query";
import { useAuthStore } from "@/store/useAuthStore";

import { KanbanColumn } from "./KanbanColumn";
import { SortableTaskCard } from "./SortableTaskCard";
import { TaskCard } from "./TaskCard";
import { useKanbanDrag } from "./useKanbanDrag";

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
  projectId: number;
};

type CreateTaskFormBody = Omit<CreateTaskBody, "assigneeId">;

export const Kanban = ({ projectId }: KanbanProps) => {
  const { data: tasks } = useGetProjectTasks(projectId);
  const currentUserId = useAuthStore((state) => state.user?.id ?? null);
  const createTask = useCreateTask();
  const {
    activeTask,
    dragOverStatus,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    sensors,
    taskQueryKey,
    tasksByStatus,
  } = useKanbanDrag({
    columnStatuses,
    projectId,
    tasks,
  });

  const handleCreateTask = async (body: CreateTaskFormBody) => {
    if (!currentUserId) {
      throw new Error("You need to be signed in to create a task.");
    }

    await createTask.mutateAsync({
      projectId,
      body: {
        ...body,
        assigneeId: currentUserId,
      },
    });

    await queryClient.invalidateQueries({
      queryKey: taskQueryKey,
    });
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <Stack direction="row" gap={4}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            column={column}
            isDragOver={dragOverStatus === column.status}
            isCreating={createTask.isPending}
            onCreateTask={handleCreateTask}
          >
            <SortableContext
              items={tasksByStatus[column.status].map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap={2}>
                {tasksByStatus[column.status].map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    projectId={projectId}
                    task={task}
                  />
                ))}
              </Stack>
            </SortableContext>
          </KanbanColumn>
        ))}
      </Stack>
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <Box
            sx={{
              cursor: "grabbing",
              transform: "rotate(1deg)",
            }}
          >
            <TaskCard task={activeTask} />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
