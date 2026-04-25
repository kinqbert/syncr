import { createBrowserRouter } from "react-router";
import { DashboardPage, LoginPage, RegisterPage } from "@/pages";
import { AuthenticatedLayout } from "@/providers/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export default router;
