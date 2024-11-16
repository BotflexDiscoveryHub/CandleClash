import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import api from "../api";
import { userQueryOptions } from "../utils/queryOptions";
import useGameStore from '../store';

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
        user = await api.createUser();
      }

      useGameStore.setState((state) => {
        state.totalPoints = user.pointsBalance
        state.liquidity = user.liquidity
        state.collectedItems = user.collectedItems
        state.boosts = user.boosts

        return state
      });

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
