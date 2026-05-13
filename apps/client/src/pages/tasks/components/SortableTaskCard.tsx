import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import type { Task } from "@syncr/packages";
import { useState } from "react";

import { useProject } from "@/hooks";

import { TaskCard } from "./TaskCard";

type SortableTaskCardProps = {
  task: Task;
};

export const SortableTaskCard = ({ task }: SortableTaskCardProps) => {
  const { projectId } = useProject();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      animateLayoutChanges: () => false,
      id: task.id,
      disabled: isMenuOpen,
    });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        cursor: isDragging ? "grabbing" : "grab",
        transform: CSS.Transform.toString(transform),
        transition: "none",
        touchAction: "auto",
        visibility: isDragging ? "hidden" : "visible",
      }}
    >
      <TaskCard
        task={task}
        detailsPath={`/projects/${projectId}/tasks/${task.id}`}
        onMenuOpenChange={setIsMenuOpen}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </Box>
  );
};
