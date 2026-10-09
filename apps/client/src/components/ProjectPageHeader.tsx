import { Skeleton } from "@mui/material";
import type { Project } from "@syncr/packages";
import type { ReactNode } from "react";

import { ProjectViewNav } from "./ProjectViewNav";
import { PageHeader } from "./ui";

type ProjectPageHeaderProps = {
  projectId: number;
  project?: Project;
  isLoading?: boolean;
  actions?: ReactNode;
};

/** Shared header for every project view: breadcrumbs, name and view tabs. */
export const ProjectPageHeader = ({
  actions,
  isLoading = false,
  project,
  projectId,
}: ProjectPageHeaderProps) => {
  const title = isLoading ? (
    <Skeleton variant="rounded" width={220} height={26} />
  ) : (
    (project?.name ?? "Project")
  );

  return (
    <PageHeader
      actions={actions}
      breadcrumbs={[
        { label: "Projects", to: "/projects" },
        { label: isLoading ? "…" : (project?.name ?? "Project") },
      ]}
      tabs={<ProjectViewNav projectId={projectId} />}
      title={title}
    />
  );
};
