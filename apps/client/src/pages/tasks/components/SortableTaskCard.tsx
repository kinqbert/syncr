import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import type { Task } from "@syncr/packages";
import { useState } from "react";

import { useGetProject } from "@/api/projects";
import { useProject } from "@/hooks";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

import { TaskCard } from "./TaskCard";

type SortableTaskCardProps = {
  task: Task;
};

export const SortableTaskCard = ({ task }: SortableTaskCardProps) => {
  const { projectId } = useProject();
  const { data: project } = useGetProject(projectId);
  const isTouchDevice = useIsTouchDevice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      animateLayoutChanges: () => false,
      id: task.id,
      disabled: isMenuOpen,
    });

  const dragProps = { ...attributes, ...listeners };

  // Desktop: the whole card is the drag source (a small activation distance
  // keeps clicks working). Touch: only the grip, so the column can scroll.
  return (
    <Box
      ref={setNodeRef}
      {...(isTouchDevice ? {} : dragProps)}
      sx={{
        borderRadius: 1.5,
        cursor: isDragging ? "grabbing" : isTouchDevice ? "auto" : "grab",
        transform: CSS.Transform.toString(transform),
        transition: "none",
        visibility: isDragging ? "hidden" : "visible",
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      }}
    >
      <TaskCard
        detailsPath={`/projects/${projectId}/tasks/${task.id}`}
        dragHandleProps={isTouchDevice ? dragProps : undefined}
        onMenuOpenChange={setIsMenuOpen}
        projectName={project?.name}
        task={task}
      />
    </Box>
  );
};
