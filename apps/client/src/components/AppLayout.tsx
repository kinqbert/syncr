import { AuthenticatedLayout } from "@/providers/auth";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Box } from "@mui/material";

export const AppLayout = () => {
  return (
    <AuthenticatedLayout>
      <Header />
      <Box display="flex">
        <Sidebar />
        <Outlet />
      </Box>
    </AuthenticatedLayout>
  );
};
