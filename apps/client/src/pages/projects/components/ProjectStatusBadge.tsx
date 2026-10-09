import { Box, Stack, Typography } from "@mui/material";
import type { Project, ProjectStatus } from "@syncr/packages";

import { getProjectProgress, PROJECT_STATUS_LABEL } from "../utils/projectStatus";

export const ProjectStatusBadge = ({ status }: { status: ProjectStatus }) => (
  <Stack alignItems="center" direction="row" gap={0.75}>
    <Box
      sx={{
        bgcolor: `projectStatus.${status}`,
        borderRadius: 0.5,
        flexShrink: 0,
        height: 8,
        width: 8,
      }}
    />
    <Typography noWrap variant="body2">
      {PROJECT_STATUS_LABEL[status]}
    </Typography>
  </Stack>
);

/** Thin progress bar with the percentage next to it. */
export const ProjectProgress = ({ project }: { project: Project }) => {
  const progress = getProjectProgress(project);

  return (
    <Stack alignItems="center" direction="row" gap={1} minWidth={0}>
      <Box
        aria-label={`${progress}% complete`}
        role="img"
        sx={{
          bgcolor: "surface.active",
          borderRadius: 999,
          flex: 1,
          height: 4,
          minWidth: 40,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            bgcolor: progress === 100 ? "success.main" : "primary.main",
            height: "100%",
            width: `${progress}%`,
          }}
        />
      </Box>
      <Typography
        color="text.secondary"
        sx={{ fontVariantNumeric: "tabular-nums", minWidth: 32, textAlign: "right" }}
        variant="body2"
      >
        {progress}%
      </Typography>
    </Stack>
  );
};
