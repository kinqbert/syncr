import { Box, Tab, Tabs } from "@mui/material";
import { CalendarDays, Columns3, LayoutDashboard } from "lucide-mui";
import { useLocation, useNavigate } from "react-router";

type ProjectViewNavProps = {
  projectId: number;
};

const getProjectViewItems = (projectId: number) => [
  {
    icon: <LayoutDashboard />,
    label: "Dashboard",
    path: `/projects/${projectId}`,
  },
  {
    icon: <Columns3 />,
    label: "Kanban",
    path: `/projects/${projectId}/tasks`,
  },
  {
    icon: <CalendarDays />,
    label: "Calendar",
    path: `/projects/${projectId}/calendar`,
  },
];

export const ProjectViewNav = ({ projectId }: ProjectViewNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const items = getProjectViewItems(projectId);
  const activePath = items.some((item) => item.path === location.pathname)
    ? location.pathname
    : items[0].path;

  return (
    <Box
      sx={{
        bgcolor: "#F9FAFB",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        maxWidth: "100%",
        overflowX: "auto",
        p: 0.5,
      }}
    >
      <Tabs
        onChange={(_, value: string) => navigate(value)}
        TabIndicatorProps={{ sx: { display: "none" } }}
        sx={{
          minHeight: 0,
          "& .MuiTabs-flexContainer": {
            gap: 0.5,
          },
        }}
        value={activePath}
        variant="scrollable"
      >
        {items.map((item) => (
          <Tab
            icon={item.icon}
            iconPosition="start"
            key={item.path}
            label={item.label}
            sx={{
              borderRadius: 0.75,
              color: "text.secondary",
              fontSize: 14,
              fontWeight: 700,
              gap: 0.75,
              lineHeight: "20px",
              minHeight: 34,
              minWidth: "auto",
              px: 1.5,
              py: 0.75,
              textTransform: "none",
              whiteSpace: "nowrap",
              "& .MuiSvgIcon-root": {
                fontSize: 17,
              },
              "&.Mui-selected": {
                bgcolor: "#FFFFFF",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
                color: "primary.main",
              },
            }}
            value={item.path}
          />
        ))}
      </Tabs>
    </Box>
  );
};
