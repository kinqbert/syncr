import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/react-query";
import AppRouterProvider from "./providers/router/routerProvider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterProvider />
    </QueryClientProvider>
  );
}

export default App;
