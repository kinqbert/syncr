import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const MAX_QUERY_RETRIES = 5;

const retryQuery = (failureCount: number, error: unknown) => {
  if (failureCount >= MAX_QUERY_RETRIES) {
    return false;
  }

  if (!axios.isAxiosError(error)) {
    return true;
  }

  const status = error.response?.status;

  if (!status) {
    return true;
  }

  return status === 408 || status === 429 || status >= 500;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: retryQuery,
    },
  },
});

const globalQueryRoots = new Set(["me", "companies"]);

export const removeCompanyScopedCache = () => {
  queryClient.removeQueries({
    predicate: (query) => {
      const rootKey = query.queryKey[0];

      return typeof rootKey !== "string" || !globalQueryRoots.has(rootKey);
    },
  });
};
