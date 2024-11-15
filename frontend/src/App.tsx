import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { TelegramProvider } from './providers/telegram-provider.tsx';
import { routeTree } from "./routeTree.gen";
import "./index.css";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <TelegramProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </TelegramProvider>
  );
}
