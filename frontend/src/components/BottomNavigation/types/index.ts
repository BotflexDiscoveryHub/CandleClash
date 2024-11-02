export type NavigationVariants = "game" | "state" | "rewards";

export interface NavigationItem {
	id: NavigationVariants
	text: string;
	url?: string;
	onClick?: () => void;
	icon: () => JSX.Element
}
