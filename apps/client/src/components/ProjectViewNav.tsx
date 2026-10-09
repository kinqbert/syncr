import { Tab, Tabs } from "@mui/material";
import { CalendarDays, Columns3, LayoutDashboard } from "lucide-mui";
import { Link, useLocation } from "react-router";

type ProjectViewNavProps = {
  projectId: number;
};

const getProjectViewItems = (projectId: number) => [
  {
    icon: <LayoutDashboard />,
    label: "Overview",
    path: `/projects/${projectId}`,
  },
  {
    icon: <Columns3 />,
    label: "Board",
    path: `/projects/${projectId}/tasks`,
  },
  {
    icon: <CalendarDays />,
    label: "Calendar",
    path: `/projects/${projectId}/calendar`,
  },
];

/** Underline tabs for switching between a project's views. */
export const ProjectViewNav = ({ projectId }: ProjectViewNavProps) => {
  const location = useLocation();
  const items = getProjectViewItems(projectId);
  const activePath = items.some((item) => item.path === location.pathname)
    ? location.pathname
    : false;

  return (
    <Tabs aria-label="Project views" value={activePath} variant="scrollable">
      {items.map((item) => (
        <Tab
          component={Link}
          icon={item.icon}
          iconPosition="start"
          key={item.path}
          label={item.label}
          to={item.path}
          value={item.path}
          sx={{
            gap: 0.75,
            "& .MuiTab-iconWrapper": { fontSize: 15, m: 0 },
          }}
        />
      ))}
    </Tabs>
  );
};
