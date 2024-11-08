import { createFileRoute } from "@tanstack/react-router";
import useGameStore from '../../store';
import { GameScreen } from './game/~components/GameScreen/GameScreen.tsx';
import { GameStart } from './game/~components/GameStart/GameStart.tsx';
import { useScrollLock } from '../../hooks/useScrollLock.ts';

export const Route = createFileRoute("/_auth/")({
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
