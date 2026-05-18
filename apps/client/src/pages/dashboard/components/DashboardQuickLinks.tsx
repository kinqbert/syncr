import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import {
  CalendarDays,
  ExternalLink,
  Folders,
  MessageCircle,
  Users,
} from "lucide-mui";
import type { ReactNode } from "react";
import { Link } from "react-router";

const QUICK_LINKS: {
  description: string;
  icon: ReactNode;
  label: string;
  to: string;
}[] = [
  {
    description: "Open workspace projects",
    icon: <Folders />,
    label: "Projects",
    to: "/projects",
  },
  {
    description: "Review assigned deadlines",
    icon: <CalendarDays />,
    label: "Calendar",
    to: "/calendar",
  },
  {
    description: "Jump into team messages",
    icon: <MessageCircle />,
    label: "Conversations",
    to: "/conversations",
  },
  {
    description: "Check teammates and roles",
    icon: <Users />,
    label: "Team",
    to: "/team",
  },
];

export const DashboardQuickLinks = () => {
  return (
    <Box
      sx={{
        bgcolor: { xs: "background.paper", sm: "transparent" },
        border: { xs: 1, sm: 0 },
        borderColor: { xs: "divider", sm: "transparent" },
        borderRadius: { xs: 1, sm: 0 },
        display: "grid",
        gap: { xs: 0, sm: 3 },
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        overflow: "hidden",
      }}
    >
      {QUICK_LINKS.map((link, index) => (
        <>
          <Button
            key={link.to}
            component={Link}
            endIcon={<ExternalLink />}
            startIcon={link.icon}
            sx={{
              alignItems: "flex-start",
              bgcolor: { xs: "transparent", sm: "background.paper" },
              border: { xs: 0, sm: 1 },
              borderBottom: { xs: 1, sm: 1 },
              borderBottomColor: "divider",
              borderColor: { xs: "transparent", sm: "divider" },
              borderRadius: { xs: 0, sm: 2 },
              color: "text.primary",
              justifyContent: "flex-start",
              minHeight: 64,
              px: 1.5,
              py: 1.25,
              textAlign: "left",
              "&:hover": {
                bgcolor: { xs: "action.hover", sm: "background.paper" },
                borderBottomColor: { xs: "divider", sm: "primary.main" },
                borderColor: { xs: "transparent", sm: "primary.main" },
                color: "primary.main",
              },
              "& .MuiButton-endIcon": {
                ml: "auto",
              },
            }}
            to={link.to}
          >
            <Stack minWidth={0}>
              <Typography
                component="span"
                fontSize={14}
                fontWeight={800}
                lineHeight={1.35}
              >
                {link.label}
              </Typography>
              <Typography
                color="text.secondary"
                component="span"
                fontSize={12}
                fontWeight={500}
                lineHeight={1.35}
              >
                {link.description}
              </Typography>
            </Stack>
          </Button>
          {index !== QUICK_LINKS.length - 1 && (
            <Divider sx={{ display: { sm: "none" } }} />
          )}
        </>
      ))}
    </Box>
  );
};
