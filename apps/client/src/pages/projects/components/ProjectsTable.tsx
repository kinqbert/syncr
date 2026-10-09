import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { Project } from "@syncr/packages";
import { Pencil } from "lucide-mui";
import { useNavigate } from "react-router";

import { formatDateShort } from "@/utils/formatDate";

import { ProjectProgress, ProjectStatusBadge } from "./ProjectStatusBadge";

type ProjectsTableProps = {
  getManagerName: (project: Project) => string;
  onEdit: (project: Project) => void;
  projects: Project[];
};

const COLUMNS = "minmax(200px, 2.4fr) 120px minmax(140px, 1.2fr) 80px 72px minmax(120px, 1fr) 96px 40px";

const headerCellSx = {
  color: "text.secondary",
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: "nowrap",
} as const;

/** Dense, scannable list of projects; rows open the project overview. */
export const ProjectsTable = ({
  getManagerName,
  onEdit,
  projects,
}: ProjectsTableProps) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflowX: "auto",
      }}
    >
      <Box role="table" sx={{ minWidth: 880 }}>
        <Box
          role="row"
          sx={{
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            display: "grid",
            gap: 2,
            gridTemplateColumns: COLUMNS,
            height: 36,
            px: 2,
          }}
        >
          {["Name", "Status", "Progress", "Tasks", "People", "Manager", "Deadline", ""].map(
            (label) => (
              <Typography key={label} role="columnheader" sx={headerCellSx}>
                {label}
              </Typography>
            ),
          )}
        </Box>

        {projects.map((project) => (
          <Box
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter") navigate(`/projects/${project.id}`);
            }}
            role="row"
            tabIndex={0}
            sx={{
              alignItems: "center",
              borderBottom: 1,
              borderColor: "line.subtle",
              cursor: "pointer",
              display: "grid",
              gap: 2,
              gridTemplateColumns: COLUMNS,
              height: 44,
              px: 2,
              transition: "background-color 120ms ease",
              "&:last-of-type": { borderBottom: 0 },
              "&:hover": { bgcolor: "surface.subtle" },
              "&:hover .project-edit, &:focus-within .project-edit": {
                opacity: 1,
              },
              "&:focus-visible": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: -2,
              },
            }}
          >
            <Typography fontWeight={500} noWrap role="cell">
              {project.name}
            </Typography>
            <Box role="cell">
              <ProjectStatusBadge status={project.status} />
            </Box>
            <Box role="cell">
              <ProjectProgress project={project} />
            </Box>
            <Typography
              color="text.secondary"
              role="cell"
              sx={{ fontVariantNumeric: "tabular-nums" }}
              variant="body2"
            >
              {project.completedTasksCount}/{project.totalTasksCount}
            </Typography>
            <Typography color="text.secondary" role="cell" variant="body2">
              {project.assignedPeopleCount}
            </Typography>
            <Typography color="text.secondary" noWrap role="cell" variant="body2">
              {getManagerName(project)}
            </Typography>
            <Typography color="text.secondary" noWrap role="cell" variant="body2">
              {project.endDate ? formatDateShort(project.endDate) : "—"}
            </Typography>
            <Stack alignItems="flex-end" role="cell">
              <Tooltip title="Edit project">
                <IconButton
                  aria-label={`Edit ${project.name}`}
                  className="project-edit"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(project);
                  }}
                  size="small"
                  sx={{ opacity: 0 }}
                >
                  <Pencil />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
