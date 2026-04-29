import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const globalQueryRoots = new Set(["me", "companies"]);

export const removeCompanyScopedCache = () => {
  queryClient.removeQueries({
    predicate: (query) => {
      const rootKey = query.queryKey[0];

      return typeof rootKey !== "string" || !globalQueryRoots.has(rootKey);
    },
  });
};
