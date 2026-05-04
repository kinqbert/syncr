import type {
  CreateProjectBody,
  Project,
  ProjectManagerCandidate,
  UpdateProjectBody,
} from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const projectKeys = {
  projects: ["projects"],
  managerCandidates: ["project-manager-candidates"],
};

const getMyProjects = async () => {
  const response = await api.get<Project[]>("project");

  return response.data;
};

const getProjectManagerCandidates = async () => {
  const response = await api.get<ProjectManagerCandidate[]>(
    "project/manager-candidates",
  );

  return response.data;
};

const createProject = async (body: CreateProjectBody) => {
  const response = await api.post<Project>("project", body);

  return response.data;
};

const updateProject = async ({
  projectId,
  body,
}: {
  projectId: number;
  body: UpdateProjectBody;
}) => {
  const response = await api.patch<Project>(`project/${projectId}`, body);

  return response.data;
};

export const useGetMyProjects = (enabled = true) => {
  return useQuery({
    enabled,
    queryFn: getMyProjects,
    queryKey: projectKeys.projects,
  });
};

export const useGetProjectManagerCandidates = (enabled = true) => {
  return useQuery({
    enabled,
    queryFn: getProjectManagerCandidates,
    queryKey: projectKeys.managerCandidates,
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: updateProject,
  });
};
