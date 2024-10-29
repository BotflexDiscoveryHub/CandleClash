import { User } from '../../../../types/User.ts';

export type Reward = { id: string, name: string; condition: () => boolean; action: () => void };

export function checkRewards(user: User): void {
	const rewards: Reward[] = [
		{
			id: '1',
			name: "Лутбокс с 50 очками",
			condition: () => getPlayTimeInHours(user) >= 1,
			action: () => giveLootbox(user, 50),
		},
		{
			id: '2',
			name: "Ускорение очков на 2x на 3 часа",
			condition: () => user.pointsBalance >= 200,
			action: () => activateDoublePoints(user, 3),
		},
		{
			id: '3',
			name: "Пул ликвидности за вход 3 дня подряд",
			condition: () => checkDailyVisits(user, 3),
			action: () => addLiquidityPool(user, 1),
		},
		{
			id: '4',
			name: "Лутбокс с 75 очками за 700 очков за 5 дней",
			condition: () => user.pointsBalance >= 700 && daysSinceFirstVisit(user) <= 5,
			action: () => giveLootbox(user, 75),
		},
		{
			id: '5',
			name: "+1 пул ликвидности за 100 зеленых свечей",
			condition: () => getGreenCandles(user) >= 100,
			action: () => addLiquidityPool(user, 1),
		},
		// Добавь другие награды по аналогии
	];

	// Проверяем все награды
	for (const reward of rewards) {
		if (reward.condition() && !user.rewards.includes(reward.id)) {
			reward.action();
			// user.rewards.push(reward.id);
			console.log(`Награда "${reward.name}" выдана пользователю ${user.username}`);
		}
	}
}

function getPlayTimeInHours(user: User): number {
	const now = Date.now();
	return (now - user.lastRequestAt) / (1000 * 60 * 60);
}

function checkDailyVisits(user: User, days: number): boolean {
	const today = new Date().toISOString().split('T')[0];
	const lastDays = user?.datesOfVisits?.slice(-days);
	return lastDays.length === days && lastDays.every((date) => date === today);
}

function daysSinceFirstVisit(user: User): number {
	const firstVisit = new Date(user.datesOfVisits[0]);
	const today = new Date();
	const diff = today.getTime() - firstVisit.getTime();
	return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function giveLootbox(user: User, points: number): void {
	user.pointsBalance += points;
	console.log(`${points} очков добавлено на баланс пользователя ${user.username}`);
}

function addLiquidityPool(user: User, pools: number): void {
	user.liquidityPools += pools;
	console.log(`${pools} пул(а) ликвидности добавлено пользователю ${user.username}`);
}

function activateDoublePoints(user: User, hours: number): void {
	console.log(`Ускорение очков 2x на ${hours} часов активировано для ${user.username}`);
}

function getGreenCandles(user: User): number {
	console.log(user)
	// Здесь нужно добавить логику подсчета "зеленых свечей"
	return 0; // Пример
}
