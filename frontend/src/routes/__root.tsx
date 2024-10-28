import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import api from "../api";
import { userQueryOptions } from "../utils/queryOptions";
import useGameStore from "../store";

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
        console.error(error);
        alert(JSON.stringify(error))
        user = await api.createUser();
      }

      useGameStore.getState().setTotalPoints(user.pointsBalance);
      useGameStore.getState().setLiquidity(user.liquidity);
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
