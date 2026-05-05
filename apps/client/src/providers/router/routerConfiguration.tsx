import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/AppLayout";
import {
  DashboardPage,
  LoginPage,
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
        path: "projects/:projectId/tasks",
        element: <TasksPage />,
      },
      {
        path: "projects/:projectId/tasks/:taskId",
        element: <TaskDetailsPage />,
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
