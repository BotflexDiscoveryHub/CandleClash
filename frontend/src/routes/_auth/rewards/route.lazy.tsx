import { RewardsScreen } from './~components/RewardsScreen/RewardsScreen.tsx';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute("/_auth/rewards")({
  component: RewardsScreen,
});
