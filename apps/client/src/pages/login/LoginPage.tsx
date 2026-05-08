import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router";

import { AuthLayout } from "../../components/AuthLayout";
import { LoginForm } from "./components/LoginForm/LoginForm";

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to Syncr."
      footer={
        <Link
          component={RouterLink}
          sx={{
            alignSelf: "center",
            color: "text.secondary",
            fontSize: 13,
            fontWeight: 500,
          }}
          to="/about"
        >
          About Syncr
        </Link>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};
