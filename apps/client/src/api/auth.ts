import type {
  LoginBody,
  MeResponse,
  RegisterBody,
  UpdatePasswordBody,
  UpdateProfileBody,
} from "@syncr/packages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/axios";

export const authKeys = {
  me: ["me"],
};

const register = async (body: RegisterBody) => await api.post("register", body);
const login = async (body: LoginBody) => await api.post("login", body);
const logout = async () => await api.post("logout");
const updateProfile = async (body: UpdateProfileBody) => {
  const response = await api.patch<MeResponse>("me", body);

  return response.data;
};
const updatePassword = async (body: UpdatePasswordBody) =>
  await api.patch("me/password", body);

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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["team"] });
      void queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};
