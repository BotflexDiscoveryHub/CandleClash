import { exitGame, pauseGame, startGame } from '../methods';
import { NavigationItem } from '../types';
import { TradingIcon } from '../components/TradingIcon/TradingIcon.tsx';
import { StateIcon } from '../components/StateIcon/StateIcon.tsx';
import { RewardsIcon } from '../components/RewardsIcon/RewardsIcon.tsx';
import { PlayIcon } from '../components/PlayIcon/PlayIcon.tsx';
import { PauseIcon } from '../components/PauseIcon/PauseIcon.tsx';

export const navigationItemsMock: NavigationItem[] = [
	{
		id: 'start',
		text: "Start",
		onClick: startGame,
		icon: PlayIcon,
	},
	{
		id: 'pause',
		text: "Pause",
		onClick: pauseGame,
		icon: PauseIcon,
	},
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
