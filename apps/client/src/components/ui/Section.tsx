import { Box, Stack, type SxProps, type Theme, Typography } from "@mui/material";
import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Controls aligned to the right of the section header. */
  actions?: ReactNode;
  /** `none` lets lists and tables run edge to edge. */
  padding?: "default" | "none";
  sx?: SxProps<Theme>;
};

/** Bordered surface with an optional header row. */
export const Section = ({
  actions,
  children,
  description,
  icon,
  padding = "default",
  sx,
  title,
}: SectionProps) => {
  const hasHeader = Boolean(title || actions);

  return (
    <Box
      component="section"
      sx={[
        {
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {hasHeader && (
        <Stack
          alignItems="center"
          direction="row"
          gap={1}
          justifyContent="space-between"
          sx={{
            borderBottom: padding === "none" ? 1 : 0,
            borderColor: "divider",
            minHeight: 44,
            px: 2,
            pt: 1.25,
            pb: padding === "none" ? 1.25 : 0,
          }}
        >
          <Stack alignItems="center" direction="row" gap={1} minWidth={0}>
            {icon && (
              <Box
                sx={{
                  color: "text.secondary",
                  display: "inline-flex",
                  "& .MuiSvgIcon-root": { fontSize: 16 },
                }}
              >
                {icon}
              </Box>
            )}
            <Stack minWidth={0}>
              {title && (
                <Typography component="h2" noWrap variant="h6">
                  {title}
                </Typography>
              )}
              {description && (
                <Typography color="text.secondary" variant="body2">
                  {description}
                </Typography>
              )}
            </Stack>
          </Stack>
          {actions && (
            <Stack alignItems="center" direction="row" gap={0.5}>
              {actions}
            </Stack>
          )}
        </Stack>
      )}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: padding === "none" ? 0 : 2,
          pt: padding === "none" ? 0 : hasHeader ? 1.5 : 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
