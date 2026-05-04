import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import type { Task } from "@syncr/packages";

import { TaskCard } from "./TaskCard";

type SortableTaskCardProps = {
  task: Task;
};

export const SortableTaskCard = ({ task }: SortableTaskCardProps) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      animateLayoutChanges: () => false,
      id: task.id,
    });

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        cursor: isDragging ? "grabbing" : "grab",
        mt: 1.5,
        transform: CSS.Transform.toString(transform),
        transition: "none",
        touchAction: "none",
        visibility: isDragging ? "hidden" : "visible",
      }}
    >
      <TaskCard task={task} />
    </Box>
  );
};
