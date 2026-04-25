import { useMe } from "@/api";
import { CircularProgress, Stack } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router";

export const AuthenticatedLayout = () => {
  const location = useLocation();
  const { data: user, isPending } = useMe();

  if (isPending) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
