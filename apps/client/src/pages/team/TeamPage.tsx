import { Button } from "@mui/material";
import { CircleCheck, Folders, Gauge, UserPlus, Users } from "lucide-mui";
import { useState } from "react";

import { useGetTeam } from "@/api/team";
import { ErrorState } from "@/components/ErrorState";
import { Page, PageHeader, StatRow } from "@/components/ui";

import { InvitationsSection } from "./components/InvitationsSection";
import { InviteMembersDialog } from "./components/InviteMembersDialog";
import { TeamMembersTable } from "./components/TeamMembersTable";
import { formatPercent } from "./utils/format";

export const TeamPage = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { data, error, isError, isLoading } = useGetTeam();

  if (isError) {
    return (
      <ErrorState
        error={error}
        fallback="Could not load team."
        title="Could not load team."
      />
    );
  }

  return (
    <Page maxWidth={1400}>
      <PageHeader
        actions={
          <Button
            onClick={() => setIsInviteDialogOpen(true)}
            size="small"
            startIcon={<UserPlus />}
            variant="contained"
          >
            Invite people
          </Button>
        }
        description="Everyone in this workspace and how much is on their plate."
        title="Team"
      />

      <StatRow
        items={[
          { icon: <Users />, label: "Members", value: data?.totalMembers ?? "–" },
          {
            icon: <Folders />,
            label: "Active projects",
            to: "/projects",
            value: data?.activeProjects ?? "–",
          },
          {
            icon: <Gauge />,
            label: "Avg. workload",
            value: data ? formatPercent(data.averageWorkload) : "–",
          },
          {
            icon: <CircleCheck />,
            label: "Tasks completed",
            value: data?.tasksCompleted ?? "–",
          },
        ]}
      />

      <TeamMembersTable isLoading={isLoading} members={data?.members ?? []} />
      <InvitationsSection invitations={data?.invitations ?? []} />

      <InviteMembersDialog
        onClose={() => setIsInviteDialogOpen(false)}
        open={isInviteDialogOpen}
      />
    </Page>
  );
};
