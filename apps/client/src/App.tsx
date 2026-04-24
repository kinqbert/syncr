import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import AppRouterProvider from "./providers/router/routerProvider";
import { queryClient } from "./lib/react-query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterProvider />
    </QueryClientProvider>
  );
}

export default App;
