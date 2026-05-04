import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/AppLayout";
import {
  DashboardPage,
  LoginPage,
  ProjectsPage,
  RegisterPage,
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
        path: "project/:projectId/tasks",
        element: <TasksPage />,
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
]);

export default router;
