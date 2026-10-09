import { Box } from "@mui/material";
import type { TeamInvitation } from "@syncr/packages";
import { Mail } from "lucide-mui";

import { EmptyState, ListRow, Section } from "@/components/ui";

type InvitationsSectionProps = {
  invitations: TeamInvitation[];
};

export const InvitationsSection = ({
  invitations,
}: InvitationsSectionProps) => (
  <Section
    icon={<Mail />}
    padding="none"
    title={
      invitations.length > 0
        ? `Pending invitations · ${invitations.length}`
        : "Pending invitations"
    }
  >
    {invitations.length === 0 ? (
      <EmptyState compact title="No pending invitations" />
    ) : (
      <Box sx={{ p: 1 }}>
        {invitations.map((invitation) => (
          <ListRow
            key={invitation.id}
            subtitle={invitation.roleName}
            title={invitation.email}
            trailing={
              <Box component="span" sx={{ textTransform: "capitalize" }}>
                {invitation.status}
              </Box>
            }
          />
        ))}
      </Box>
    )}
  </Section>
);
