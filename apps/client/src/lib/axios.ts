import axios, { type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";

import { DEMO_HEADER, isDemoView } from "./demo";
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

api.interceptors.request.use((config) => {
  const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;

  if (isDemoView()) {
    config.headers.set(DEMO_HEADER, "true");
  }

  if (selectedCompanyId) {
    config.headers.set("X-Company-Id", String(selectedCompanyId));
  }

  return config;
});

let refreshPromise: Promise<unknown> | null = null;

const clearAndRedirect = () => {
  useAuthStore.getState().clearUser();
  useCompanyStore.getState().clearSelectedCompany();

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

    if (isDemoView()) {
      return Promise.reject(error);
    }

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
