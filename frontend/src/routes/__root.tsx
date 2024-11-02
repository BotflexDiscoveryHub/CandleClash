import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import api from "../api";
import { userQueryOptions } from "../utils/queryOptions";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
    beforeLoad: async ({ context }) => {
      if (api.initDataWasSet) {
        await api.setInitData();
      }
      let user;
      try {
        user = await context.queryClient.ensureQueryData(userQueryOptions());
      } catch (error) {
        console.error(error, 'error userQueryOptions');
        user = await api.createUser();
      }

      return { user };
    },
  }
);

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
