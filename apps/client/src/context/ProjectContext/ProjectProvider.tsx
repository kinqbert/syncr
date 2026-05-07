import { ProjectContext } from "./ProjectContext";

type ProviderProps = {
  children: React.ReactNode;
  projectId: number;
};

export const ProjectProvider = ({ children, projectId }: ProviderProps) => {
  return (
    <ProjectContext.Provider value={{ projectId }}>
      {children}
    </ProjectContext.Provider>
  );
};
