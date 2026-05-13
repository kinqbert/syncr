import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Project } from "@syncr/packages";
import {
  CalendarDays,
  LayoutDashboard,
  Pencil,
  SquareCheckBig,
  UserRound,
  Users,
} from "lucide-mui";
import { Link } from "react-router";

import { formatDate } from "@/utils/formatDate";

type ProjectCardProps = {
  managerName: string;
  onEdit: (project: Project) => void;
  onOpenTasks: (project: Project) => void;
  project: Project;
};

export const ProjectCard = ({
  managerName,
  onEdit,
  onOpenTasks,
  project,
}: ProjectCardProps) => {
  const completionProgress =
    project.totalTasksCount > 0
      ? Math.round(
          (project.completedTasksCount / project.totalTasksCount) * 100,
        )
      : 0;

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: "divider",
        borderRadius: 1.5,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
        display: "flex",
        flexDirection: "column",
        minHeight: { xs: "auto", sm: 248 },
        overflow: "hidden",
        transition:
          "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
        "&:hover": {
          borderColor: "#C7D2FE",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
        },
      }}
    >
      <CardContent sx={{ display: "flex", flex: 1, p: { xs: 2, sm: 2.5 } }}>
        <Stack gap={{ xs: 2, sm: 2.25 }} minWidth={0} width="100%">
          <Stack
            alignItems="flex-start"
            direction="row"
            gap={1}
            justifyContent="space-between"
          >
            <Stack minWidth={0}>
              <Typography
                noWrap
                sx={{
                  color: "text.primary",
                  fontSize: { xs: 18, sm: 20 },
                  fontWeight: 800,
                  lineHeight: { xs: "24px", sm: "28px" },
                }}
              >
                {project.name}
              </Typography>
              <Typography color="text.secondary" fontSize={13}>
                {project.completedTasksCount}/{project.totalTasksCount} tasks
                completed
              </Typography>
            </Stack>

            <Stack alignItems="center" direction="row" flexShrink={0} gap={0.5}>
              <Chip
                color="success"
                label={project.status}
                size="small"
                sx={{
                  bgcolor: "#ECFDF5",
                  borderColor: "#A7F3D0",
                  color: "#047857",
                  flexShrink: 0,
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
                variant="outlined"
              />
              <Tooltip title="Edit project">
                <IconButton
                  aria-label="Edit project"
                  onClick={() => onEdit(project)}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    color: "text.secondary",
                    height: 32,
                    width: 32,
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "primary.main",
                    },
                  }}
                >
                  <Pencil fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Stack gap={1.25}>
            <Stack alignItems="center" direction="row" gap={1} minWidth={0}>
              <UserRound
                sx={{
                  color: "text.secondary",
                  flexShrink: 0,
                  fontSize: 18,
                }}
              />
              <Typography color="text.secondary" fontSize={13}>
                Manager
              </Typography>
              <Typography noWrap fontSize={13} fontWeight={700} minWidth={0}>
                {managerName}
              </Typography>
            </Stack>

            <Stack alignItems="center" direction="row" gap={1} minWidth={0}>
              <CalendarDays
                sx={{
                  color: "text.secondary",
                  flexShrink: 0,
                  fontSize: 18,
                }}
              />
              <Typography color="text.secondary" fontSize={13}>
                Timeline
              </Typography>
              <Typography noWrap fontSize={13} fontWeight={700} minWidth={0}>
                {formatDate(project.startDate)} -{" "}
                {project.endDate ? formatDate(project.endDate) : "No deadline"}
              </Typography>
            </Stack>
          </Stack>

          <Stack gap={1.25}>
            <Stack
              alignItems="baseline"
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary" fontSize={13} fontWeight={700}>
                Progress
              </Typography>
              <Typography fontSize={20} fontWeight={800}>
                {completionProgress}%
              </Typography>
            </Stack>

            <LinearProgress
              aria-label={`${project.name} completion progress`}
              value={completionProgress}
              variant="determinate"
              sx={{
                bgcolor: "#EEF2FF",
                borderRadius: 999,
                height: 8,
                ".MuiLinearProgress-bar": {
                  backgroundColor: "#4F46E5",
                  borderRadius: 999,
                },
              }}
            />

            <Stack direction="row" gap={2.5} flexWrap="wrap">
              <Stack alignItems="center" direction="row" gap={0.75}>
                <Users sx={{ color: "text.secondary", fontSize: 16 }} />
                <Typography color="text.secondary" fontSize={13}>
                  {project.assignedPeopleCount}{" "}
                  {project.assignedPeopleCount === 1 ? "person" : "people"}
                </Typography>
              </Stack>
              <Stack alignItems="center" direction="row" gap={0.75}>
                <SquareCheckBig
                  sx={{ color: "text.secondary", fontSize: 16 }}
                />
                <Typography color="text.secondary" fontSize={13}>
                  {project.completedTasksCount} done
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              mt: "auto",
              pt: 0.5,
            }}
          >
            <Button
              component={Link}
              startIcon={<LayoutDashboard />}
              sx={{ borderRadius: 1, minWidth: 0 }}
              to={`/projects/${project.id}`}
              variant="contained"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => onOpenTasks(project)}
              startIcon={<SquareCheckBig />}
              sx={{ borderRadius: 1, minWidth: 0 }}
              variant="outlined"
            >
              Tasks
            </Button>
            <Button
              component={Link}
              startIcon={<CalendarDays />}
              sx={{ borderRadius: 1, minWidth: 0 }}
              to={`/projects/${project.id}/calendar`}
              variant="outlined"
            >
              Calendar
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
