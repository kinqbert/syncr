import { createContext } from "react";

type ProjectContextValue = {
  projectId: number;
};

export const ProjectContext = createContext<ProjectContextValue | null>(null);
