import { createLazyFileRoute } from "@tanstack/react-router";
import { GameScreen } from './~components/GameScreen.tsx';

export const Route = createLazyFileRoute("/_auth/game")({
  component: () => <GameScreen />,
});




