import { AuthenticatedLayout } from "@/providers/auth";
import { Outlet } from "react-router";
import { Header } from "./Header";

export const AppLayout = () => {
  return (
    <AuthenticatedLayout>
      <Header />
      <Outlet />
    </AuthenticatedLayout>
  );
};
