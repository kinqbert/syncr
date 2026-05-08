import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/AppLayout";
import { ProjectLayout } from "@/components/ProjectLayout";
import {
  DashboardPage,
  LoginPage,
  NotFoundPage,
  NotificationsPage,
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
