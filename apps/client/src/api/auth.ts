import type { LoginBody, MeResponse, RegisterBody } from "@syncr/packages";
import { useMutation, useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const authKeys = {
  me: ["me"],
};

const register = async (body: RegisterBody) => await api.post("register", body);
const login = async (body: LoginBody) => await api.post("login", body);
const logout = async () => await api.post("logout");

const me = async () => {
  const response = await api.get<MeResponse>("me");

  return response.data;
};

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

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useMe = () => {
  return useQuery({
    queryFn: me,
    queryKey: authKeys.me,
    retry: false,
  });
};
