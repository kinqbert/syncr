import {
  Box,
  Card,
  CardActions,
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
        borderRadius: 2,
        boxShadow: "0 10px 28px rgba(17, 24, 39, 0.04)",
        display: "flex",
        flexDirection: "column",
        minHeight: 260,
        overflow: "hidden",
        transition:
          "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
        "&:hover": {
          borderColor: "#C7D2FE",
          boxShadow: "0 18px 42px rgba(17, 24, 39, 0.09)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: 2.5 }}>
        <Stack gap={2.5}>
          <Stack direction="row" gap={1.5} justifyContent="space-between">
            <Stack minWidth={0}>
              <Typography
                noWrap
                sx={{
                  color: "text.primary",
                  fontSize: 20,
                  fontWeight: 800,
                  lineHeight: "28px",
                }}
              >
                {project.name}
              </Typography>
            </Stack>

            <Chip
              color="success"
              label={project.status}
              size="small"
              sx={{
                alignSelf: "flex-start",
                bgcolor: "#ECFDF5",
                borderColor: "#A7F3D0",
                color: "#047857",
                fontWeight: 700,
                textTransform: "capitalize",
              }}
              variant="outlined"
            />
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={1.5}
            sx={{
              bgcolor: "#F9FAFB",
              border: 1,
              borderColor: "divider",
              borderRadius: 1.5,
              p: 1.5,
            }}
          >
            <Stack direction="row" gap={1} minWidth={0}>
              <UserRound
                sx={{
                  color: "text.secondary",
                  flexShrink: 0,
                  fontSize: 17,
                  mt: 0.25,
                }}
              />
              <Stack minWidth={0}>
                <Typography color="text.secondary" fontSize={12}>
                  Manager
                </Typography>
                <Typography noWrap fontSize={13} fontWeight={700}>
                  {managerName}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={1} minWidth={0}>
              <CalendarDays
                sx={{
                  color: "text.secondary",
                  flexShrink: 0,
                  fontSize: 17,
                  mt: 0.25,
                }}
              />
              <Stack minWidth={0}>
                <Typography color="text.secondary" fontSize={12}>
                  Timeline
                </Typography>
                <Typography noWrap fontSize={13} fontWeight={700}>
                  {formatDate(project.startDate)} -{" "}
                  {project.endDate ? formatDate(project.endDate) : "No deadline"}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack
            gap={1.5}
            sx={{
              bgcolor: "#FFFFFF",
              border: 1,
              borderColor: "divider",
              borderRadius: 1.5,
              p: 1.75,
            }}
          >
            <Stack
              alignItems="baseline"
              direction="row"
              justifyContent="space-between"
            >
              <Stack gap={0.25}>
                <Typography
                  color="text.secondary"
                  fontSize={12}
                  fontWeight={700}
                >
                  Completion progress
                </Typography>
                <Typography fontSize={24} fontWeight={800}>
                  {completionProgress}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" fontSize={13} fontWeight={700}>
                {project.completedTasksCount}/{project.totalTasksCount} tasks
              </Typography>
            </Stack>

            <LinearProgress
              aria-label={`${project.name} completion progress`}
              value={completionProgress}
              variant="determinate"
              sx={{
                bgcolor: "#EEF2FF",
                borderRadius: 999,
                height: 9,
                ".MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(90deg, #4F46E5 0%, #2563EB 100%)",
                  borderRadius: 999,
                },
              }}
            />

            <Stack direction="row" gap={1} flexWrap="wrap">
              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: "#F8FAFC",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1.25,
                  display: "flex",
                  gap: 0.75,
                  minHeight: 34,
                  px: 1.25,
                }}
              >
                <Users sx={{ color: "text.secondary", fontSize: 16 }} />
                <Typography fontSize={13} fontWeight={700}>
                  {project.assignedPeopleCount}{" "}
                  {project.assignedPeopleCount === 1 ? "person" : "people"}
                </Typography>
              </Box>
              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: "#F8FAFC",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1.25,
                  display: "flex",
                  gap: 0.75,
                  minHeight: 34,
                  px: 1.25,
                }}
              >
                <SquareCheckBig
                  sx={{ color: "text.secondary", fontSize: 16 }}
                />
                <Typography fontSize={13} fontWeight={700}>
                  {project.completedTasksCount} done
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions
        sx={{
          bgcolor: "#F9FAFB",
          borderTop: 1,
          borderColor: "divider",
          justifyContent: "flex-end",
          px: 2,
          py: 1.25,
        }}
      >
        <Tooltip title="Open dashboard">
          <IconButton
            aria-label="Open project dashboard"
            component={Link}
            to={`/projects/${project.id}`}
            sx={{
              color: "primary.main",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <LayoutDashboard fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open tasks">
          <IconButton
            aria-label="Open project tasks"
            onClick={() => onOpenTasks(project)}
            sx={{
              color: "primary.main",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <SquareCheckBig fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit project">
          <IconButton
            aria-label="Edit project"
            onClick={() => onEdit(project)}
            sx={{
              color: "primary.main",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <Pencil fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
