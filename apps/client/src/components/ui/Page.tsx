import { Box, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

type PageProps = {
  children: ReactNode;
  /** Constrains content width; `false` lets the page use the full width. */
  maxWidth?: number | false;
  /** Removes page padding, e.g. for full-bleed boards and split views. */
  disableGutters?: boolean;
  sx?: SxProps<Theme>;
};

export const Page = ({
  children,
  disableGutters = false,
  maxWidth = false,
  sx,
}: PageProps) => (
  <Box
    component="main"
    sx={[
      {
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, sm: 2.5 },
        minHeight: "100%",
        minWidth: 0,
        mx: "auto",
        maxWidth: maxWidth === false ? "none" : maxWidth,
        px: disableGutters ? 0 : { xs: 2, sm: 3, lg: 4 },
        py: disableGutters ? 0 : { xs: 2, sm: 3 },
        width: "100%",
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {children}
  </Box>
);
