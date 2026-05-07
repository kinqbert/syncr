import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { CreateProjectBody, Project } from "@syncr/packages";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  useCreateProject,
  useGetMyProjects,
  useGetProjectManagerCandidates,
  useUpdateProject,
} from "@/api/projects";
import { formatDate } from "@/utils/formatDate";

import { NoProjectsCard, ProjectFormDialog } from "./components";

export const ProjectsPage = () => {
  const navigate = useNavigate();

  const { data: projects = [], isLoading: areProjectsLoading } =
    useGetMyProjects();
  const { data: managerCandidates = [], isLoading: areManagersLoading } =
    useGetProjectManagerCandidates();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const [dialogProject, setDialogProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const managerById = useMemo(() => {
    return new Map(
      managerCandidates.map((manager) => [
        manager.id,
        `${manager.name} ${manager.surname}`,
      ]),
    );
  }, [managerCandidates]);

  const isSaving = createProject.isPending || updateProject.isPending;

  const handleOpenCreateDialog = () => {
    setDialogProject(null);
    setIsDialogOpen(true);
  };

  const handleClickTasksButton = (project: Project) => {
    navigate(`/projects/${project.id}/tasks`);
  };

  const handleOpenEditDialog = (project: Project) => {
    setDialogProject(project);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (isSaving) {
      return;
    }

    setIsDialogOpen(false);
    setDialogProject(null);
  };

  const handleSaveProject = async (
    projectId: number | null,
    body: CreateProjectBody,
  ) => {
    if (projectId) {
      await updateProject.mutateAsync({ projectId, body });
    } else {
      await createProject.mutateAsync(body);
    }

    handleCloseDialog();
  };

  return (
    <Box component="main" sx={{ width: "100%", p: 3 }}>
      <Stack gap={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          justifyContent="space-between"
        >
          <Stack gap={0.5}>
            <Typography variant="h4">Projects</Typography>
            <Typography color="text.secondary">
              {projects.length} active workspace project
              {projects.length === 1 ? "" : "s"}
            </Typography>
          </Stack>
          <Button
            onClick={handleOpenCreateDialog}
            startIcon={<AddIcon />}
            sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
            variant="contained"
          >
            Create project
          </Button>
        </Stack>

        {areProjectsLoading && (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
          </Stack>
        )}

        {!areProjectsLoading && projects.length === 0 && <NoProjectsCard />}

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {projects.map((project) => (
            <Card
              key={project.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                minHeight: 220,
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" gap={1} justifyContent="space-between">
                  <Typography variant="h6">{project.name}</Typography>
                  <Chip
                    color="success"
                    label={project.status}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Typography color="text.secondary" mt={1.5}>
                  {project.description || "No description"}
                </Typography>

                <Stack gap={0.75} mt={3}>
                  <Typography variant="body2">
                    Manager:{" "}
                    {project.managerId
                      ? (managerById.get(project.managerId) ?? "Unknown")
                      : "Unassigned"}
                  </Typography>
                  <Typography variant="body2">
                    Starts: {formatDate(project.startDate)}
                  </Typography>
                  <Typography variant="body2">
                    Deadline:{" "}
                    {project.endDate ? formatDate(project.endDate) : "Not set"}
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                <Tooltip title="Open tasks">
                  <IconButton
                    aria-label="Edit project"
                    onClick={() => handleClickTasksButton(project)}
                  >
                    <TaskAltIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit project">
                  <IconButton
                    aria-label="Edit project"
                    onClick={() => handleOpenEditDialog(project)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Stack>

      {isDialogOpen && (
        <ProjectFormDialog
          isManagersLoading={areManagersLoading}
          isOpen={isDialogOpen}
          isSaving={isSaving}
          managerCandidates={managerCandidates}
          onClose={handleCloseDialog}
          onSave={handleSaveProject}
          project={dialogProject}
        />
      )}
    </Box>
  );
};
