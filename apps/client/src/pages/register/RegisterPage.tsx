import { Navigate } from "react-router";

import { isDemoView } from "@/lib/demo";

import { AuthLayout } from "../../components/AuthLayout";
import { RegisterForm } from "./components/RegisterForm/RegisterForm";

export const RegisterPage = () => {
  if (isDemoView()) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up your workspace in a few short steps."
    >
      <RegisterForm />
    </AuthLayout>
  );
};
