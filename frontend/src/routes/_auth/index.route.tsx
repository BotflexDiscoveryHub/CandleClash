import { createFileRoute } from "@tanstack/react-router";
import { updateUserQueryOptions } from "../../utils/queryOptions";
import useGameStore from '../../store';
import { GameScreen } from './game/~components/GameScreen/GameScreen.tsx';
import { GameStart } from './game/~components/GameStart/GameStart.tsx';
import { useScrollLock } from '../../hooks/useScrollLock.ts';

export const Route = createFileRoute("/_auth/")({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    const user = await queryClient.ensureQueryData(updateUserQueryOptions());

    useGameStore.setState((state) => {
      state.totalPoints = user.pointsBalance
      state.liquidity = user.liquidity

      return state
    });

    return { user };
  },
  component: () => <Game />,
});

const Game = () => {
  const {
    isPlay
  } = useGameStore();

  useScrollLock(true)

  if (isPlay) {
    return <GameScreen />
  }

  return <GameStart />
}
