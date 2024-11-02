import { createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from '../../../utils/queryOptions';
import useGameStore from '../../../store';

export const Route = createFileRoute("/_auth/game")({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;

    const user = await queryClient.ensureQueryData(userQueryOptions());

    const { isDataLoaded, setTotalPoints, setLiquidity, setIsDataLoaded } = useGameStore.getState();

    if (!isDataLoaded) {
      setTotalPoints(user.pointsBalance);
      setLiquidity(user.liquidity);
      setIsDataLoaded(true);
    }

    return {
      user,
    };
  },

});
