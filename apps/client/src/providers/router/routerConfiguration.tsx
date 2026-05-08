import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/AppLayout";
import { ProjectLayout } from "@/components/ProjectLayout";
import {
  AboutPage,
  DashboardPage,
  LoginPage,
  NotFoundPage,
  NotificationsPage,
  ProjectDashboardPage,
  ProjectsPage,
  RegisterPage,
  SettingsPage,
  TaskDetailsPage,
  TasksPage,
} from "@/pages";
import { TeamPage } from "@/pages/team";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "team",
        element: <TeamPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "projects/:projectId",
        element: <ProjectLayout />,
        children: [
          {
            index: true,
            element: <ProjectDashboardPage />,
          },
          {
            path: "tasks",
            element: <TasksPage />,
          },
          {
            path: "tasks/:taskId",
            element: <TaskDetailsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "about",
    element: <AboutPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
