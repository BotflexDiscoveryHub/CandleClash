import { createLazyFileRoute } from "@tanstack/react-router";
import { StateScreen } from './~components/StateScreen/StateScreen.tsx';

export const Route = createLazyFileRoute("/_auth/state")({
  component: () => <StateScreen />,
});
