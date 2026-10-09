import { Box, Stack, Typography } from "@mui/material";
import type { TeamUser } from "@syncr/packages";

import { EmptyState, ListRow, RowSkeleton, Section } from "@/components/ui";
import { UserAvatar } from "@/components/UserAvatar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getUserFullName } from "@/utils/getUserFullName";

import { WorkloadBar } from "./WorkloadBar";

type TeamMembersTableProps = {
  isLoading: boolean;
  members: TeamUser[];
};

const COLUMNS =
  "minmax(200px, 1.6fr) minmax(120px, 1fr) minmax(180px, 1.4fr) 80px 90px 120px 80px";

const StatusDot = ({ status }: { status: TeamUser["status"] }) => (
  <Stack alignItems="center" direction="row" gap={0.75}>
    <Box
      sx={{
        bgcolor: status === "active" ? "success.main" : "line.strong",
        borderRadius: "50%",
        height: 6,
        width: 6,
      }}
    />
    <Typography
      color="text.secondary"
      sx={{ textTransform: "capitalize" }}
      variant="body2"
    >
      {status}
    </Typography>
  </Stack>
);

export const TeamMembersTable = ({
  isLoading,
  members,
}: TeamMembersTableProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Section padding="none" title="Members">
        <Box sx={{ p: 1.5 }}>
          <RowSkeleton count={5} />
        </Box>
      </Section>
    );
  }

  if (members.length === 0) {
    return (
      <Section padding="none" title="Members">
        <EmptyState compact title="No team members yet" />
      </Section>
    );
  }

  if (isMobile) {
    return (
      <Section padding="none" title={`Members · ${members.length}`}>
        <Box sx={{ p: 1 }}>
          {members.map((member) => (
            <ListRow
              key={member.id}
              leading={
                <UserAvatar
                  name={member.name}
                  size={28}
                  surname={member.surname}
                />
              }
              subtitle={`${member.roleName} · ${member.assignedTasks} tasks`}
              title={getUserFullName(member.name, member.surname)}
              trailing={<WorkloadBar value={member.workload} />}
            />
          ))}
        </Box>
      </Section>
    );
  }

  return (
    <Section padding="none" title={`Members · ${members.length}`}>
      <Box sx={{ overflowX: "auto" }}>
        <Box role="table" sx={{ minWidth: 900 }}>
          <Box
            role="row"
            sx={{
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
              display: "grid",
              gap: 2,
              gridTemplateColumns: COLUMNS,
              height: 34,
              px: 2,
            }}
          >
            {[
              "Name",
              "Role",
              "Email",
              "Assigned",
              "Completed",
              "Workload",
              "Status",
            ].map((label) => (
              <Typography
                color="text.secondary"
                key={label}
                role="columnheader"
                sx={{ fontSize: 12, fontWeight: 500 }}
              >
                {label}
              </Typography>
            ))}
          </Box>
          {members.map((member) => (
            <Box
              key={member.id}
              role="row"
              sx={{
                alignItems: "center",
                borderBottom: 1,
                borderColor: "line.subtle",
                display: "grid",
                gap: 2,
                gridTemplateColumns: COLUMNS,
                height: 44,
                px: 2,
                "&:last-of-type": { borderBottom: 0 },
                "&:hover": { bgcolor: "surface.subtle" },
              }}
            >
              <Stack
                alignItems="center"
                direction="row"
                gap={1.25}
                minWidth={0}
                role="cell"
              >
                <UserAvatar
                  name={member.name}
                  size={24}
                  surname={member.surname}
                />
                <Typography fontWeight={500} noWrap>
                  {getUserFullName(member.name, member.surname)}
                </Typography>
              </Stack>
              <Typography
                color="text.secondary"
                noWrap
                role="cell"
                variant="body2"
              >
                {member.roleName}
              </Typography>
              <Typography
                color="text.secondary"
                noWrap
                role="cell"
                variant="body2"
              >
                {member.email}
              </Typography>
              <Typography
                role="cell"
                sx={{ fontVariantNumeric: "tabular-nums" }}
                variant="body2"
              >
                {member.assignedTasks}
              </Typography>
              <Typography
                color="text.secondary"
                role="cell"
                sx={{ fontVariantNumeric: "tabular-nums" }}
                variant="body2"
              >
                {member.completedTasks}
              </Typography>
              <Box role="cell">
                <WorkloadBar value={member.workload} />
              </Box>
              <Box role="cell">
                <StatusDot status={member.status} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
};
