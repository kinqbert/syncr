import { AuthLayout } from "../../components/AuthLayout";
import { RegisterForm } from "./components/RegisterForm/RegisterForm";

export const RegisterPage = () => {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up your workspace in a few short steps."
    >
      <RegisterForm />
    </AuthLayout>
  );
};
