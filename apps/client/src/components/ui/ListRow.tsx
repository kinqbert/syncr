import { Box, Stack, type SxProps, type Theme, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "react-router";

type ListRowProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Avatar or icon on the left. */
  leading?: ReactNode;
  /** Right-aligned content, e.g. a timestamp or badge. */
  trailing?: ReactNode;
  to?: string;
  onClick?: () => void;
  /** Shows an accent dot and stronger title for unread items. */
  unread?: boolean;
  /** Lets the title wrap instead of truncating. */
  wrap?: boolean;
  sx?: SxProps<Theme>;
};

/** Dense row for feeds, inboxes and member lists. */
export const ListRow = ({
  leading,
  onClick,
  subtitle,
  sx,
  title,
  to,
  trailing,
  unread = false,
  wrap = false,
}: ListRowProps) => {
  const interactive = Boolean(to || onClick);
  const rootProps = to
    ? { component: Link, to }
    : onClick
      ? { component: "button" as const, onClick, type: "button" as const }
      : {};

  return (
    <Stack
      {...rootProps}
      alignItems={wrap ? "flex-start" : "center"}
      direction="row"
      gap={1.25}
      sx={[
        {
          bgcolor: "transparent",
          border: 0,
          borderRadius: 1,
          color: "inherit",
          font: "inherit",
          minWidth: 0,
          position: "relative",
          px: 1,
          py: 0.875,
          textAlign: "left",
          width: "100%",
          ...(interactive && {
            cursor: "pointer",
            transition: "background-color 120ms ease",
            "&:hover": { bgcolor: "surface.hover" },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: -2,
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {leading && (
        <Box sx={{ display: "inline-flex", flexShrink: 0 }}>{leading}</Box>
      )}
      <Stack flex={1} gap={0.125} minWidth={0}>
        <Typography
          noWrap={!wrap}
          sx={{ fontWeight: unread ? 600 : 400, wordBreak: "break-word" }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" noWrap={!wrap} variant="body2">
            {subtitle}
          </Typography>
        )}
      </Stack>
      {(trailing || unread) && (
        <Stack alignItems="center" direction="row" flexShrink={0} gap={1}>
          {trailing && (
            <Typography
              color="text.secondary"
              component="div"
              noWrap
              variant="body2"
            >
              {trailing}
            </Typography>
          )}
          {unread && (
            <Box
              aria-label="Unread"
              sx={{
                bgcolor: "primary.main",
                borderRadius: "50%",
                height: 6,
                width: 6,
              }}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};
