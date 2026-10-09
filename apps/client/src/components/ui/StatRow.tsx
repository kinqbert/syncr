import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "react-router";

export type StatItem = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  /** Secondary line under the value, e.g. "of 24 tasks". */
  hint?: ReactNode;
  /** Makes the whole cell a link. */
  to?: string;
};

type StatRowProps = {
  items: StatItem[];
  /** Columns at the widest breakpoint; defaults to the number of items. */
  columns?: number;
};

const StatCell = ({ hint, icon, label, to, value }: StatItem) => (
  <Stack
    {...(to ? { component: Link, to } : {})}
    gap={0.5}
    sx={{
      bgcolor: "background.paper",
      color: "inherit",
      minWidth: 0,
      px: 2,
      py: 1.5,
      transition: "background-color 120ms ease",
      ...(to && { "&:hover": { bgcolor: "surface.subtle" } }),
    }}
  >
    <Stack alignItems="center" direction="row" gap={0.75} minWidth={0}>
      {icon && (
        <Box
          sx={{
            color: "text.secondary",
            display: "inline-flex",
            "& .MuiSvgIcon-root": { fontSize: 14 },
          }}
        >
          {icon}
        </Box>
      )}
      <Typography color="text.secondary" noWrap variant="body2">
        {label}
      </Typography>
    </Stack>
    <Typography
      sx={{
        fontSize: 22,
        fontVariantNumeric: "tabular-nums",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
      }}
    >
      {value}
    </Typography>
    {hint && (
      <Typography color="text.secondary" noWrap variant="body2">
        {hint}
      </Typography>
    )}
  </Stack>
);

/**
 * A single bordered strip of compact stats. The 1px gap over a divider
 * background draws the inner separators, so cells wrap cleanly.
 */
export const StatRow = ({ columns, items }: StatRowProps) => {
  const wide = columns ?? items.length;

  return (
    <Box
      sx={{
        bgcolor: "divider",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        display: "grid",
        gap: "1px",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          md: `repeat(${Math.min(wide, 3)}, minmax(0, 1fr))`,
          lg: `repeat(${wide}, minmax(0, 1fr))`,
        },
        overflow: "hidden",
      }}
    >
      {items.map((item) => (
        <StatCell key={item.label} {...item} />
      ))}
    </Box>
  );
};
