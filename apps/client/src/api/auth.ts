import api from "@/lib/axios";
import type { LoginBody, RegisterBody } from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

const keys = {
  me: ["me"],
};

const register = (body: RegisterBody) => api.post("register", body);
const login = (body: LoginBody) => api.post("login", body);
const me = () => api.get("me");

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

export const useMe = () => {
  return useQuery({
    queryFn: me,
    queryKey: keys.me,
  });
};
