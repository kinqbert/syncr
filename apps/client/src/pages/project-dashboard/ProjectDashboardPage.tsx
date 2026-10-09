import { useGetProject } from "@/api/projects";
import { ErrorState } from "@/components/ErrorState";
import { ProjectPageHeader } from "@/components/ProjectPageHeader";
import { EmptyState, Page } from "@/components/ui";
import { useProject } from "@/hooks";

import {
  ActivityTimeline,
  ProjectDashboardHeader,
  ProjectOverviewGrid,
} from "./components";

export const ProjectDashboardPage = () => {
  const { projectId } = useProject();
  const {
    data: project,
    error: projectError,
    isError: isProjectError,
    isLoading: isProjectLoading,
  } = useGetProject(projectId);

  if (isProjectError) {
    return (
      <ErrorState
        error={projectError}
        fallback="Could not load project dashboard."
        title="Could not load project dashboard."
      />
    );
  }

  return (
    <Page>
      <ProjectPageHeader
        isLoading={isProjectLoading}
        project={project}
        projectId={projectId}
      />

      <ProjectDashboardHeader
        project={project}
        isProjectLoading={isProjectLoading}
      />

      {!isProjectLoading && project ? (
        <>
          <ProjectOverviewGrid projectId={projectId} />
          <ActivityTimeline projectId={projectId} />
        </>
      ) : null}

      {!isProjectLoading && !project ? (
        <EmptyState
          description="It may have been removed or you no longer have access."
          title="Project not found"
        />
      ) : null}
    </Page>
  );
};
