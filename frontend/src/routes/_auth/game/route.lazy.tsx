import { createLazyFileRoute } from "@tanstack/react-router";
import { GameScreen } from './~components/GameScreen.tsx';
import useGameStore from '../../../store';
import { GameStart } from './~components/GameStart/GameStart.tsx';

export const Route = createLazyFileRoute("/_auth/game")({
  component: () => <Game />,
});

const Game = () => {
  const {
    isPaused
  } = useGameStore();

  if (!isPaused) {
    return <GameScreen />
  }

  return <GameStart />
}
