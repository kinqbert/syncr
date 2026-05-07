import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@syncr/packages";
import { useMemo, useRef, useState } from "react";

import { taskKeys, useReorderTasks } from "@/api/tasks";
import { queryClient } from "@/lib/react-query";

type TasksByStatus = Record<TaskStatus, Task[]>;
type DragOverTarget = NonNullable<DragOverEvent["over"]>;

type UseKanbanDragParams = {
  columnStatuses: TaskStatus[];
  projectId: number;
  tasks: Task[] | undefined;
};

const createEmptyTasksByStatus = (columnStatuses: TaskStatus[]) => {
  return Object.fromEntries(
    columnStatuses.map((status) => [status, []]),
  ) as unknown as TasksByStatus;
};

const normalizeColumnPositions = (status: TaskStatus, tasks: Task[]) => {
  return tasks.map((task, position) => ({
    ...task,
    status,
    position,
  }));
};

const flattenTasksByStatus = (
  tasksByStatus: TasksByStatus,
  columnStatuses: TaskStatus[],
) => {
  return columnStatuses.flatMap((status) => tasksByStatus[status]);
};

const isTaskStatus = (
  value: UniqueIdentifier,
  columnStatuses: TaskStatus[],
): value is TaskStatus => {
  return columnStatuses.includes(value as TaskStatus);
};

const getTaskStatusById = (
  tasksByStatus: TasksByStatus,
  id: UniqueIdentifier,
  columnStatuses: TaskStatus[],
) => {
  if (isTaskStatus(id, columnStatuses)) {
    return id;
  }

  const taskId = Number(id);

  return (
    columnStatuses.find((status) =>
      tasksByStatus[status].some((task) => task.id === taskId),
    ) ?? null
  );
};

const moveTask = (
  tasksByStatus: TasksByStatus,
  active: DragOverEvent["active"],
  over: DragOverTarget,
  columnStatuses: TaskStatus[],
) => {
  const activeId = active.id;
  const overId = over.id;
  const sourceStatus = getTaskStatusById(
    tasksByStatus,
    activeId,
    columnStatuses,
  );
  const targetStatus = getTaskStatusById(tasksByStatus, overId, columnStatuses);

  if (!sourceStatus || !targetStatus) {
    return null;
  }

  const activeTaskIndex = tasksByStatus[sourceStatus].findIndex(
    (task) => task.id === Number(activeId),
  );
  const activeTask = tasksByStatus[sourceStatus][activeTaskIndex];

  if (!activeTask) {
    return null;
  }

  const nextTasksByStatus = { ...tasksByStatus };

  if (sourceStatus === targetStatus) {
    if (isTaskStatus(overId, columnStatuses)) {
      return null;
    }

    const overTaskIndex = tasksByStatus[targetStatus].findIndex(
      (task) => task.id === Number(overId),
    );

    if (overTaskIndex < 0 || activeTaskIndex === overTaskIndex) {
      return null;
    }

    nextTasksByStatus[sourceStatus] = normalizeColumnPositions(
      sourceStatus,
      arrayMove(tasksByStatus[sourceStatus], activeTaskIndex, overTaskIndex),
    );

    return nextTasksByStatus;
  }

  const sourceTasks = tasksByStatus[sourceStatus].filter(
    (task) => task.id !== activeTask.id,
  );
  const targetTasks = [...tasksByStatus[targetStatus]];
  const overTaskIndex = isTaskStatus(overId, columnStatuses)
    ? targetTasks.length
    : targetTasks.findIndex((task) => task.id === Number(overId));
  const insertIndex = overTaskIndex >= 0 ? overTaskIndex : targetTasks.length;

  targetTasks.splice(insertIndex, 0, {
    ...activeTask,
    status: targetStatus,
  });

  nextTasksByStatus[sourceStatus] = normalizeColumnPositions(
    sourceStatus,
    sourceTasks,
  );
  nextTasksByStatus[targetStatus] = normalizeColumnPositions(
    targetStatus,
    targetTasks,
  );

  return nextTasksByStatus;
};

export const useKanbanDrag = ({
  columnStatuses,
  projectId,
  tasks,
}: UseKanbanDragParams) => {
  const reorderTasks = useReorderTasks();
  const dragStartTasksRef = useRef<Task[] | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const taskQueryKey = taskKeys.lists(projectId);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const tasksByStatus = useMemo(() => {
    const result = createEmptyTasksByStatus(columnStatuses);

    if (!tasks) {
      return result;
    }

    for (const task of tasks) {
      result[task.status].push(task);
    }

    for (const status of columnStatuses) {
      result[status].sort((firstTask, secondTask) => {
        return firstTask.position - secondTask.position;
      });
    }

    return result;
  }, [columnStatuses, tasks]);

  const activeTask = useMemo(() => {
    if (activeTaskId === null) {
      return null;
    }

    return tasks?.find((task) => task.id === activeTaskId) ?? null;
  }, [activeTaskId, tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    if (!tasks?.some((task) => task.id === Number(event.active.id))) {
      return;
    }

    dragStartTasksRef.current = tasks;
    setActiveTaskId(Number(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setDragOverStatus(null);

      return;
    }

    const targetStatus = getTaskStatusById(
      tasksByStatus,
      over.id,
      columnStatuses,
    );

    setDragOverStatus(targetStatus);

    if (active.id === over.id) return;

    const nextTasksByStatus = moveTask(
      tasksByStatus,
      active,
      over,
      columnStatuses,
    );

    if (!nextTasksByStatus) {
      return;
    }

    queryClient.setQueryData(
      taskQueryKey,
      flattenTasksByStatus(nextTasksByStatus, columnStatuses),
    );
  };

  const handleDragCancel = () => {
    if (dragStartTasksRef.current) {
      queryClient.setQueryData(taskQueryKey, dragStartTasksRef.current);
    }

    dragStartTasksRef.current = null;
    setActiveTaskId(null);
    setDragOverStatus(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      handleDragCancel();

      return;
    }

    if (active.id !== over.id) {
      const nextTasksByStatus = moveTask(
        tasksByStatus,
        active,
        over,
        columnStatuses,
      );

      if (nextTasksByStatus) {
        queryClient.setQueryData(
          taskQueryKey,
          flattenTasksByStatus(nextTasksByStatus, columnStatuses),
        );
      }
    }

    const reorderedTasks =
      queryClient.getQueryData<Task[]>(taskQueryKey) ?? tasks ?? [];

    try {
      const savedTasks = await reorderTasks.mutateAsync({
        projectId,
        body: {
          tasks: reorderedTasks.map((task) => ({
            id: task.id,
            status: task.status,
            position: task.position,
          })),
        },
      });

      queryClient.setQueryData(taskQueryKey, savedTasks);
    } catch {
      queryClient.setQueryData(
        taskQueryKey,
        dragStartTasksRef.current ?? tasks ?? [],
      );
    } finally {
      dragStartTasksRef.current = null;
      setActiveTaskId(null);
      setDragOverStatus(null);
    }
  };

  return {
    activeTask,
    dragOverStatus,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    sensors,
    tasksByStatus,
  };
};
