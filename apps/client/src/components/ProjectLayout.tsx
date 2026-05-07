import { Navigate, Outlet, useParams } from "react-router";

import { ProjectProvider } from "@/context/ProjectContext/ProjectProvider";

export const ProjectLayout = () => {
  const { projectId } = useParams();

  const parsedProjectId = Number(projectId);

  if (!projectId || Number.isNaN(parsedProjectId) || parsedProjectId <= 0) {
    return <Navigate replace to="/projects" />;
  }

  return (
    <ProjectProvider projectId={parsedProjectId}>
      <Outlet />
    </ProjectProvider>
  );
};
