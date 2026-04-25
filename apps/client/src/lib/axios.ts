import axios, { type InternalAxiosRequestConfig } from "axios";

import { env } from "./env";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig;

    if (originalRequest._retry || originalRequest.url === "refresh") {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= api.post("refresh").finally(() => {
      refreshPromise = null;
    });

    await refreshPromise;

    return api(originalRequest);
  },
);

export default api;
