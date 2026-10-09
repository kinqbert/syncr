import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  /** Tighter spacing for use inside sections and columns. */
  compact?: boolean;
};

export const EmptyState = ({
  action,
  compact = false,
  description,
  icon,
  title,
}: EmptyStateProps) => (
  <Stack
    alignItems="center"
    gap={compact ? 0.75 : 1}
    justifyContent="center"
    textAlign="center"
    sx={{ px: 2, py: compact ? 3 : 6 }}
  >
    {icon && (
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "surface.subtle",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          color: "text.secondary",
          display: "inline-flex",
          height: compact ? 32 : 40,
          justifyContent: "center",
          mb: 0.5,
          width: compact ? 32 : 40,
          "& .MuiSvgIcon-root": { fontSize: compact ? 16 : 20 },
        }}
      >
        {icon}
      </Box>
    )}
    <Typography fontWeight={600} variant={compact ? "body1" : "subtitle1"}>
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary" maxWidth={360} variant="body2">
        {description}
      </Typography>
    )}
    {action && <Box sx={{ mt: 1 }}>{action}</Box>}
  </Stack>
);
