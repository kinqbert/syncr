import { keyframes } from "@emotion/react";
import { alpha, type SxProps, type Theme } from "@mui/material";

const fadeHighlight = keyframes`
  from { background-color: var(--recently-added-bg); }
  to { background-color: transparent; }
`;

export const recentlyAddedSx: SxProps<Theme> = (theme) => ({
  "--recently-added-bg": alpha(theme.palette.primary.main, 0.14),
  animation: `${fadeHighlight} 2.5s ease-out`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});
