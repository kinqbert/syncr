import { createBrowserRouter } from "react-router";
import { AuthPage } from "@/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
]);

export default router;
