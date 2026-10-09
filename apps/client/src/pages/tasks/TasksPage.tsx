import { Box, Button } from "@mui/material";
import { Users } from "lucide-mui";
import { useState } from "react";
import { useParams } from "react-router";

import {
  useAddProjectMember,
  useGetProject,
  useGetProjectAssignees,
  useGetProjectMemberCandidates,
  useRemoveProjectMember,
} from "@/api/projects";
import { ErrorState } from "@/components/ErrorState";
import { ProjectPageHeader } from "@/components/ProjectPageHeader";
import { Page } from "@/components/ui";

import { Kanban } from "./components/Kanban";
import { ProjectMembersDialog } from "./components/ProjectMembersDialog";

export const TasksPage = () => {
  const { projectId } = useParams();
  const numericProjectId = Number(projectId);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  const {
    data: project,
    error: projectError,
    isError: isProjectError,
    isLoading: isProjectLoading,
  } = useGetProject(numericProjectId, Boolean(projectId));
  const { data: members = [], isLoading: isMembersLoading } =
    useGetProjectAssignees(numericProjectId, Boolean(projectId));
  const { data: memberCandidates = [], isLoading: isMemberCandidatesLoading } =
    useGetProjectMemberCandidates(
      numericProjectId,
      Boolean(projectId) && isMembersDialogOpen,
    );

  const addProjectMember = useAddProjectMember();
  const removeProjectMember = useRemoveProjectMember();

  if (!projectId) {
    return null;
  }

  if (isProjectError) {
    return (
      <ErrorState
        error={projectError}
        fallback="Could not load project."
        title="Could not load project."
      />
    );
  }

  const handleAddProjectMember = async (userId: number) => {
    await addProjectMember.mutateAsync({
      projectId: numericProjectId,
      body: { userId },
    });
  };

  const handleRemoveProjectMember = async (userId: number) => {
    await removeProjectMember.mutateAsync({
      projectId: numericProjectId,
      userId,
    });
  };

  return (
    <Page sx={{ height: "100%" }}>
      <ProjectPageHeader
        actions={
          <Button
            onClick={() => setIsMembersDialogOpen(true)}
            size="small"
            startIcon={<Users />}
            variant="outlined"
          >
            Members
            {members.length > 0 && (
              <Box component="span" sx={{ color: "text.secondary", ml: 0.75 }}>
                {members.length}
              </Box>
            )}
          </Button>
        }
        isLoading={isProjectLoading}
        project={project}
        projectId={numericProjectId}
      />
      <Box
        minHeight={0}
        minWidth={0}
        sx={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          pb: 1,
        }}
      >
        <Kanban
          isProjectAssigneesLoading={isMembersLoading}
          projectAssignees={members}
        />
      </Box>
      <ProjectMembersDialog
        candidates={memberCandidates}
        isAdding={addProjectMember.isPending}
        isCandidatesLoading={isMemberCandidatesLoading}
        isMembersLoading={isMembersLoading}
        isOpen={isMembersDialogOpen}
        isRemoving={removeProjectMember.isPending}
        members={members}
        onAddMember={handleAddProjectMember}
        onClose={() => setIsMembersDialogOpen(false)}
        onRemoveMember={handleRemoveProjectMember}
      />
    </Page>
  );
};
