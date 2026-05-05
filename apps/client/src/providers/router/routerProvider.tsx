import { RouterProvider } from "react-router";

import router from "./routerConfiguration";

const AppRouterProvider = () => <RouterProvider router={router} />;

export default AppRouterProvider;
