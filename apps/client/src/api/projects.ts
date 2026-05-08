import type {
  AddProjectMemberBody,
  CreateProjectBody,
  Project,
  ProjectActivitiesPage,
  ProjectAssignee,
  ProjectLabel,
  ProjectManagerCandidate,
  ProjectMemberCandidate,
  UpdateProjectBody,
} from "@syncr/packages";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import api from "@/lib/axios";
import { queryClient } from "@/lib/react-query";

export const projectsKeys = {
  projects: ["projects"],
  project: (projectId: number) => ["projects", projectId],
  projectAssignees: (projectId: number) =>
    ["projects", projectId, "assignees"] as const,
  projectLabels: (projectId: number) =>
    ["projects", projectId, "labels"] as const,
  projectActivities: (projectId: number) =>
    ["projects", projectId, "activity"] as const,
  projectMemberCandidates: (projectId: number) =>
    ["projects", projectId, "member-candidates"] as const,
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

const getProjectAssignees = async (projectId: number) => {
  const response = await api.get<ProjectAssignee[]>(
    `projects/${projectId}/assignees`,
  );

  return response.data;
};

const getProjectLabels = async (projectId: number) => {
  const response = await api.get<ProjectLabel[]>(
    `projects/${projectId}/labels`,
  );

  return response.data;
};

const getProjectMemberCandidates = async (projectId: number) => {
  const response = await api.get<ProjectMemberCandidate[]>(
    `projects/${projectId}/member-candidates`,
  );

  return response.data;
};

const getProjectActivities = async ({
  projectId,
  limit,
  offset,
}: {
  projectId: number;
  limit: number;
  offset: number;
}) => {
  const response = await api.get<ProjectActivitiesPage>(
    `projects/${projectId}/activity`,
    {
      params: { limit, offset },
    },
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

const addProjectMember = async ({
  projectId,
  body,
}: {
  projectId: number;
  body: AddProjectMemberBody;
}) => {
  const response = await api.post<ProjectAssignee[]>(
    `projects/${projectId}/members`,
    body,
  );

  return response.data;
};

const removeProjectMember = async ({
  projectId,
  userId,
}: {
  projectId: number;
  userId: number;
}) => {
  const response = await api.delete<ProjectAssignee[]>(
    `projects/${projectId}/members/${userId}`,
  );

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

export const useGetProjectAssignees = (projectId: number, enabled = true) => {
  return useQuery({
    enabled,
    queryFn: () => getProjectAssignees(projectId),
    queryKey: projectsKeys.projectAssignees(projectId),
  });
};

export const useGetProjectLabels = (projectId: number, enabled = true) => {
  return useQuery({
    enabled,
    queryFn: () => getProjectLabels(projectId),
    queryKey: projectsKeys.projectLabels(projectId),
  });
};

export const useGetProjectMemberCandidates = (
  projectId: number,
  enabled = true,
) => {
  return useQuery({
    enabled,
    queryFn: () => getProjectMemberCandidates(projectId),
    queryKey: projectsKeys.projectMemberCandidates(projectId),
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectsKeys.projects });
    },
  });
};

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectsKeys.projects });
    },
  });
};

export const useAddProjectMember = () => {
  return useMutation({
    mutationFn: addProjectMember,
    onSuccess: (members, variables) => {
      queryClient.setQueryData(
        projectsKeys.projectAssignees(variables.projectId),
        members,
      );
      void queryClient.invalidateQueries({
        queryKey: projectsKeys.projectAssignees(variables.projectId),
      });
      void queryClient.invalidateQueries({ queryKey: projectsKeys.projects });
    },
  });
};

export const useGetProjectActivities = (
  projectId: number,
  limit = 5,
  enabled = true,
) => {
  return useInfiniteQuery<
    ProjectActivitiesPage,
    Error,
    InfiniteData<ProjectActivitiesPage>,
    ReturnType<typeof projectsKeys.projectActivities>,
    number
  >({
    enabled,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore
        ? pages.reduce((count, page) => count + page.items.length, 0)
        : undefined,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getProjectActivities({ projectId, limit, offset: pageParam }),
    queryKey: projectsKeys.projectActivities(projectId),
  });
};

export const useRemoveProjectMember = () => {
  return useMutation({
    mutationFn: removeProjectMember,
    onSuccess: (members, variables) => {
      queryClient.setQueryData(
        projectsKeys.projectAssignees(variables.projectId),
        members,
      );
      void queryClient.invalidateQueries({
        queryKey: projectsKeys.project(variables.projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: projectsKeys.projectAssignees(variables.projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tasks"],
      });
      void queryClient.invalidateQueries({ queryKey: projectsKeys.projects });
    },
  });
};
