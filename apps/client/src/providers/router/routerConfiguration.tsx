import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/AppLayout";
import { ProjectLayout } from "@/components/ProjectLayout";
import {
  DashboardPage,
  LoginPage,
  NotFoundPage,
  ProjectsPage,
  RegisterPage,
  TaskDetailsPage,
  TasksPage,
} from "@/pages";

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
