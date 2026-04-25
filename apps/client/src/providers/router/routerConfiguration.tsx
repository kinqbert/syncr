import { createBrowserRouter } from "react-router";
import { LoginPage, RegisterPage } from "@/pages";

const router = createBrowserRouter([
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
