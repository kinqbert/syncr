import { createBrowserRouter } from "react-router";
import { DashboardPage, LoginPage, RegisterPage } from "@/pages";
import { AppLayout } from "@/components/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
