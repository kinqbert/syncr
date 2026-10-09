import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type {
  CreateProjectBody,
  Project,
  ProjectStatus,
} from "@syncr/packages";
import { Folders, LayoutGrid, List, Plus } from "lucide-mui";
import { useMemo, useState } from "react";

import {
  useCreateProject,
  useGetMyProjects,
  useGetProjectManagerCandidates,
  useUpdateProject,
} from "@/api/projects";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState, Page, PageHeader, RowSkeleton } from "@/components/ui";
import { useIsMobile } from "@/hooks/useIsMobile";

import {
  ProjectCard,
  ProjectFormDialog,
  ProjectsTable,
} from "./components";
import { PROJECT_STATUS_LABEL } from "./utils/projectStatus";

type StatusFilter = "all" | ProjectStatus;
type ProjectsView = "list" | "grid";

const STATUS_FILTERS: StatusFilter[] = [
  "all",
  "active",
  "paused",
  "completed",
  "archived",
];
const VIEW_STORAGE_KEY = "syncr-projects-view";

const readStoredView = (): ProjectsView => {
  try {
    return localStorage.getItem(VIEW_STORAGE_KEY) === "grid" ? "grid" : "list";
  } catch {
    return "list";
  }
};

export const ProjectsPage = () => {
  const isMobile = useIsMobile();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [view, setView] = useState<ProjectsView>(readStoredView);

  const changeView = (nextView: ProjectsView) => {
    setView(nextView);

    try {
      localStorage.setItem(VIEW_STORAGE_KEY, nextView);
    } catch {
      // Storage can be unavailable (private mode); the choice just won't stick.
    }
  };

  const {
    data: projects = [],
    error: projectsError,
    isError: areProjectsError,
    isLoading: areProjectsLoading,
  } = useGetMyProjects();
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

  if (areProjectsError) {
    return (
      <ErrorState
        error={projectsError}
        fallback="Could not load projects."
        title="Could not load projects."
      />
    );
  }

  const handleOpenCreateDialog = () => {
    setDialogProject(null);
    setIsDialogOpen(true);
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

  const getManagerName = (project: Project) =>
    project.managerId
      ? (managerById.get(project.managerId) ?? "Unknown")
      : "No manager";

  const statusCounts = projects.reduce<Record<string, number>>(
    (counts, project) => ({
      ...counts,
      [project.status]: (counts[project.status] ?? 0) + 1,
    }),
    {},
  );
  const visibleProjects =
    statusFilter === "all"
      ? projects
      : projects.filter((project) => project.status === statusFilter);

  return (
    <Page maxWidth={1400}>
      <PageHeader
        actions={
          <Button
            onClick={handleOpenCreateDialog}
            size="small"
            startIcon={<Plus />}
            variant="contained"
          >
            New project
          </Button>
        }
        tabs={
          <Stack alignItems="center" direction="row" justifyContent="space-between">
            <Tabs
              onChange={(_, value: StatusFilter) => setStatusFilter(value)}
              value={statusFilter}
              variant="scrollable"
            >
              {STATUS_FILTERS.map((filter) => {
                const count =
                  filter === "all" ? projects.length : (statusCounts[filter] ?? 0);

                return (
                  <Tab
                    key={filter}
                    label={
                      <Stack direction="row" gap={0.75}>
                        {filter === "all" ? "All" : PROJECT_STATUS_LABEL[filter]}
                        <Box component="span" sx={{ color: "text.disabled" }}>
                          {count}
                        </Box>
                      </Stack>
                    }
                    value={filter}
                  />
                );
              })}
            </Tabs>
            <ToggleButtonGroup
              exclusive
              onChange={(_, value: ProjectsView | null) => value && changeView(value)}
              size="small"
              sx={{ display: { xs: "none", md: "flex" }, flexShrink: 0 }}
              value={view}
            >
              <ToggleButton aria-label="List view" sx={{ p: 0.5 }} value="list">
                <List sx={{ fontSize: 16 }} />
              </ToggleButton>
              <ToggleButton aria-label="Grid view" sx={{ p: 0.5 }} value="grid">
                <LayoutGrid sx={{ fontSize: 16 }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
        title="Projects"
      />

      {areProjectsLoading ? (
        <RowSkeleton count={5} />
      ) : projects.length === 0 ? (
        <EmptyState
          action={
            <Button onClick={handleOpenCreateDialog} startIcon={<Plus />} variant="contained">
              New project
            </Button>
          }
          description="Projects group tasks, people and deadlines. Create one to get started."
          icon={<Folders />}
          title="No projects yet"
        />
      ) : visibleProjects.length === 0 ? (
        <EmptyState compact title="No projects with this status" />
      ) : view === "list" && !isMobile ? (
        <ProjectsTable
          getManagerName={getManagerName}
          onEdit={handleOpenEditDialog}
          projects={visibleProjects}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              managerName={getManagerName(project)}
              onEdit={handleOpenEditDialog}
              project={project}
            />
          ))}
        </Box>
      )}

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
    </Page>
  );
};
