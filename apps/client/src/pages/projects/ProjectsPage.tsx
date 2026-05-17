import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import type { CreateProjectBody, Project } from "@syncr/packages";
import { FolderPlus } from "lucide-mui";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
  useCreateProject,
  useGetMyProjects,
  useGetProjectManagerCandidates,
  useUpdateProject,
} from "@/api/projects";

import { NoProjectsCard, ProjectCard, ProjectFormDialog } from "./components";

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
    <Box
      component="main"
      sx={{ minWidth: 0, p: { xs: 2, sm: 3 }, width: "100%" }}
    >
      <Stack gap={{ xs: 2.5, sm: 3 }} minWidth={0}>
        <Stack
          alignItems={{ xs: "stretch", sm: "center" }}
          direction={{ xs: "column", sm: "row" }}
          gap={2}
          justifyContent="space-between"
        >
          <Stack gap={0.5} minWidth={0}>
            <Typography
              variant="h4"
              sx={{ fontSize: { xs: 28, sm: 34 }, lineHeight: 1.2 }}
            >
              Projects
            </Typography>
            <Typography color="text.secondary">
              {areProjectsLoading
                ? "Loading workspace projects..."
                : `${projects.length} active workspace project${
                    projects.length === 1 ? "" : "s"
                  }`}
            </Typography>
          </Stack>
          <Button
            onClick={handleOpenCreateDialog}
            startIcon={<FolderPlus />}
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
            <ProjectCard
              key={project.id}
              managerName={
                project.managerId
                  ? (managerById.get(project.managerId) ?? "Unknown")
                  : "Unassigned"
              }
              onEdit={handleOpenEditDialog}
              onOpenTasks={handleClickTasksButton}
              project={project}
            />
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
