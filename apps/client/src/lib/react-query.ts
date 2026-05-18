import { QueryClient } from "@tanstack/react-query";

const MAX_QUERY_RETRIES = 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount) => failureCount < MAX_QUERY_RETRIES,
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
