import axios, { type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/store/useAuthStore";
import { env } from "./env";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

let refreshPromise: Promise<unknown> | null = null;

const clearAndRedirect = () => {
  useAuthStore.getState().clearUser();

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      !error.config
    ) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig;

    if (originalRequest._retry || originalRequest.url === "refresh") {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= refreshApi.post("refresh").finally(() => {
      refreshPromise = null;
    });

    try {
      await refreshPromise;
    } catch (refreshError) {
      clearAndRedirect();

      return Promise.reject(refreshError);
    }

    return api(originalRequest);
  },
);

export default api;
