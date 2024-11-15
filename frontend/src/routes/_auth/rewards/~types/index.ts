export interface RewardProgress {
	rewardId: string;
	title: string;
	description: string;
	current: number;
	required: number;
	additionalInfo?: string;
	isActive?: boolean;
	isCompleted: boolean;
	type: RewardType;
}

export type Reward = {
	id: number;
	rewardId: string;
	title: string;
	description?: string;
	type: string;
	condition?: number;
	points?: number;
	lootboxPoints?: number;
	liquidity?: number;
	liquidityPools?: number;
	boost?: Boost;
};


export interface Boost {
	type: BoostType;
	isPercentage: boolean;
	multiplier: number;
	duration: number;
	description: string;
	expirationDate?: Date;
}

export enum RewardType {
	ACTIVITY = 'ACTIVITY', // Регулярная активность
	POINTS = 'POINTS', // Очки
	ITEMS = 'ITEMS', // Игровые предметы
	LEVEL = 'LEVEL', // Уровень
	TIME = 'TIME', // Время в игре
	CHALLENGE = 'CHALLENGE', // Челленджи
}

export enum BoostType {
	POINTS = 'POINTS', // Очки
	LIQUIDITY = 'LIQUIDITY',
}
