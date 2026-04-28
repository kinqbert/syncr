import { AuthenticatedLayout } from "@/providers/auth";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { useGetMyCompanies } from "@/api/company";

export const AppLayout = () => {
  const { data } = useGetMyCompanies();

  console.log(data);

  return (
    <AuthenticatedLayout>
      <Header />
      <Outlet />
    </AuthenticatedLayout>
  );
};
