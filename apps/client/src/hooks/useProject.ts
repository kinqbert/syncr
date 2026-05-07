import { useContext } from "react";

import { ProjectContext } from "@/context/ProjectContext/ProjectContext";

export const useProject = () => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used inside ProjectProvider");
  }

  return context;
};
