import { Box, Stack } from "@mui/material";
import {
  type Project,
  type ProjectAssignee,
  type Task,
  TaskStatus,
} from "@syncr/packages";
import { CalendarDays, CircleCheck, Gauge, UserRound } from "lucide-mui";

import { StatRow } from "@/components/ui";
import { ProjectStatusBadge } from "@/pages/projects/components";
import {
  DUE_STATE_COLOR,
  formatDueDate,
  getDueState,
} from "@/utils/formatDueDate";
import { getUserFullName } from "@/utils/getUserFullName";

type ProjectSummaryProps = {
  members: ProjectAssignee[];
  project: Project;
  tasks: Task[];
};

/**
 * Key facts in one strip. Counts come from the loaded tasks because the
 * single-project endpoint does not include task stats.
 */
export const ProjectSummary = ({ members, project, tasks }: ProjectSummaryProps) => {
  const doneCount = tasks.filter((task) => task.status === TaskStatus.Done).length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const manager = members.find((member) => member.id === project.managerId);
  const isClosed = project.status === "completed" || project.status === "archived";
  const dueState = isClosed ? "later" : getDueState(project.endDate);

  return (
    <StatRow
      columns={4}
      items={[
        {
          icon: <Gauge />,
          label: "Progress",
          value: (
            <Stack alignItems="center" direction="row" gap={1.25}>
              <span>{progress}%</span>
              <Box
                sx={{
                  bgcolor: "surface.active",
                  borderRadius: 999,
                  flex: 1,
                  height: 4,
                  maxWidth: 120,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{ bgcolor: "primary.main", height: "100%", width: `${progress}%` }}
                />
              </Box>
            </Stack>
          ),
          hint: <ProjectStatusBadge status={project.status} />,
        },
        {
          icon: <CircleCheck />,
          label: "Tasks done",
          value: `${doneCount}/${tasks.length}`,
          hint: `${tasks.filter((task) => task.status === TaskStatus.InProgress).length} in progress`,
        },
        {
          icon: <CalendarDays />,
          label: "Deadline",
          value: (
            <Box
              component="span"
              sx={{ color: project.endDate ? DUE_STATE_COLOR[dueState] : "text.disabled" }}
            >
              {project.endDate ? formatDueDate(project.endDate) : "None"}
            </Box>
          ),
          hint: dueState === "overdue" ? "Overdue" : undefined,
        },
        {
          icon: <UserRound />,
          label: "Manager",
          value: (
            <Box component="span" sx={{ fontSize: 15, fontWeight: 500 }}>
              {manager ? getUserFullName(manager.name, manager.surname) : "—"}
            </Box>
          ),
          hint: `${members.length} ${members.length === 1 ? "member" : "members"}`,
        },
      ]}
    />
  );
};
