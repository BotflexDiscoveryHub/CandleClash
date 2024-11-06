import { exitGame } from '../methods';
import { NavigationItem } from '../types';
import { TradingIcon } from '../components/TradingIcon/TradingIcon.tsx';
import { StateIcon } from '../components/StateIcon/StateIcon.tsx';
import { RewardsIcon } from '../components/RewardsIcon/RewardsIcon.tsx';

export const navigationItemsMock: NavigationItem[] = [
	{
	  id: 'game',
	  text: "Trading",
	  url: "/",
		// onClick: reloadGame,
		icon: TradingIcon,
  },
	{
		id: 'state',
		text: "State",
		url: "/state",
		onClick: exitGame,
		icon: StateIcon
	},
	{
		id: 'rewards',
		text: "Rewards",
		url: "/rewards",
		onClick: exitGame,
		icon: RewardsIcon
	}
]
