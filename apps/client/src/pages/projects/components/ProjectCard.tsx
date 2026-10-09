import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { Project } from "@syncr/packages";
import { CalendarDays, Pencil, SquareCheckBig, Users } from "lucide-mui";
import { Link } from "react-router";

import { formatDateShort } from "@/utils/formatDate";

import { ProjectProgress, ProjectStatusBadge } from "./ProjectStatusBadge";

type ProjectCardProps = {
  managerName: string;
  onEdit: (project: Project) => void;
  project: Project;
};

const Meta = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <Stack
    alignItems="center"
    direction="row"
    gap={0.5}
    sx={{ color: "text.secondary", "& .MuiSvgIcon-root": { fontSize: 14 } }}
  >
    {icon}
    <Typography noWrap variant="body2">
      {text}
    </Typography>
  </Stack>
);

export const ProjectCard = ({ managerName, onEdit, project }: ProjectCardProps) => (
  <Box
    sx={{
      bgcolor: "background.paper",
      border: 1,
      borderColor: "divider",
      borderRadius: 2,
      position: "relative",
      transition: "border-color 120ms ease",
      "&:hover": { borderColor: "line.strong" },
      "&:hover .project-edit, &:focus-within .project-edit": { opacity: 1 },
    }}
  >
    <Stack
      component={Link}
      gap={1.5}
      to={`/projects/${project.id}`}
      sx={{ color: "inherit", p: 2 }}
    >
      <Stack gap={0.5} minWidth={0} pr={4}>
        <Typography fontWeight={600} noWrap variant="subtitle1">
          {project.name}
        </Typography>
        <Typography color="text.secondary" noWrap variant="body2">
          {managerName}
        </Typography>
      </Stack>
      <ProjectStatusBadge status={project.status} />
      <ProjectProgress project={project} />
      <Stack direction="row" flexWrap="wrap" gap={1.5}>
        <Meta
          icon={<SquareCheckBig />}
          text={`${project.completedTasksCount}/${project.totalTasksCount}`}
        />
        <Meta icon={<Users />} text={String(project.assignedPeopleCount)} />
        <Meta
          icon={<CalendarDays />}
          text={project.endDate ? formatDateShort(project.endDate) : "No deadline"}
        />
      </Stack>
    </Stack>
    <Tooltip title="Edit project">
      <IconButton
        aria-label={`Edit ${project.name}`}
        className="project-edit"
        onClick={() => onEdit(project)}
        size="small"
        sx={{
          opacity: { xs: 1, md: 0 },
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Pencil />
      </IconButton>
    </Tooltip>
  </Box>
);
