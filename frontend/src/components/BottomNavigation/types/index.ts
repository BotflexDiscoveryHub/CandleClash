import { User } from '../../../types/User.ts';

export type NavigationVariants = "game" | "state" | "rewards" | "pause" | "start";

export interface NavigationItem {
	id: NavigationVariants
	text: string;
	url?: string;
	onClick?: (user?: User) => void;
	icon: () => JSX.Element
}
