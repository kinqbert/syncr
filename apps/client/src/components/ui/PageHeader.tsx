import { Box, Stack, Typography } from "@mui/material";
import { ChevronRight } from "lucide-mui";
import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";

export type Breadcrumb = {
  label: ReactNode;
  to?: string;
};

type PageHeaderProps = {
  /** Optional so a page can show only breadcrumbs above its own heading. */
  title?: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Breadcrumb[];
  /** Buttons or controls aligned to the right of the title. */
  actions?: ReactNode;
  /** Rendered under the title row, e.g. view tabs. */
  tabs?: ReactNode;
};

export const PageHeader = ({
  actions,
  breadcrumbs,
  description,
  tabs,
  title,
}: PageHeaderProps) => (
  <Stack gap={1} minWidth={0}>
    {breadcrumbs && breadcrumbs.length > 0 && (
      <Stack
        alignItems="center"
        aria-label="Breadcrumb"
        component="nav"
        direction="row"
        gap={0.5}
        minWidth={0}
      >
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <ChevronRight
                aria-hidden
                sx={{ color: "text.disabled", fontSize: 14 }}
              />
            )}
            {crumb.to ? (
              <Typography
                component={Link}
                noWrap
                to={crumb.to}
                variant="body2"
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                }}
              >
                {crumb.label}
              </Typography>
            ) : (
              <Typography color="text.secondary" noWrap variant="body2">
                {crumb.label}
              </Typography>
            )}
          </Fragment>
        ))}
      </Stack>
    )}

    {(title || actions) && (
    <Stack
      alignItems={{ xs: "stretch", sm: "flex-start" }}
      direction={{ xs: "column", sm: "row" }}
      gap={1.5}
      justifyContent="space-between"
      minWidth={0}
    >
      <Stack gap={0.25} minWidth={0}>
        <Typography component="h1" variant="h3" sx={{ wordBreak: "break-word" }}>
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary">{description}</Typography>
        )}
      </Stack>
      {actions && (
        <Stack
          alignItems="center"
          direction="row"
          flexShrink={0}
          flexWrap="wrap"
          gap={1}
        >
          {actions}
        </Stack>
      )}
    </Stack>
    )}

    {tabs && (
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mt: 0.5,
          overflowX: "auto",
        }}
      >
        {tabs}
      </Box>
    )}
  </Stack>
);
