import api from "@/lib/axios";
import type { LoginBody, RegisterBody } from "@syncr/packages";
import { useMutation } from "@tanstack/react-query";

const register = (body: RegisterBody) => api.post("register", body);
const login = (body: LoginBody) => api.post("login", body);

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
