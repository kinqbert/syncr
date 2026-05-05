import type {
  CreateProjectBody,
  Project,
  ProjectManagerCandidate,
  UpdateProjectBody,
} from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const projectsKeys = {
  projects: ["projects"],
  project: (projectId: number) => ["projects", projectId],
  managerCandidates: ["projects-manager-candidates"],
};

const getMyProjects = async () => {
  const response = await api.get<Project[]>("projects");

  return response.data;
};

const getProject = async (projectId: number) => {
  const response = await api.get<Project>(`projects/${projectId}`);

  return response.data;
};

const getProjectManagerCandidates = async () => {
  const response = await api.get<ProjectManagerCandidate[]>(
    "projects/manager-candidates",
  );

  return response.data;
};

const createProject = async (body: CreateProjectBody) => {
  const response = await api.post<Project>("projects", body);

  return response.data;
};

const updateProject = async ({
  projectId,
  body,
}: {
  projectId: number;
  body: UpdateProjectBody;
}) => {
  const response = await api.patch<Project>(`projects/${projectId}`, body);

  return response.data;
};

export const useGetMyProjects = (enabled = true) => {
  return useQuery({
    enabled,
    queryFn: getMyProjects,
    queryKey: projectsKeys.projects,
  });
};

export const useGetProject = (projectId: number, enabled = true) => {
  return useQuery({
    enabled,
    queryFn: () => getProject(projectId),
    queryKey: projectsKeys.project(projectId),
  });
};

export const useGetProjectManagerCandidates = (enabled = true) => {
  return useQuery({
    enabled,
    queryFn: getProjectManagerCandidates,
    queryKey: projectsKeys.managerCandidates,
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
