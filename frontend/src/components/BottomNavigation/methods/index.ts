import useGameStore from '../../../store';
import api from '../../../api';
import { User } from '../../../types/User.ts';

export const startGame = async () => {
	try {
		useGameStore.getState().setIsPaused(false);
		useGameStore.getState().setIsPlay(true);
	} catch (e) {
		console.log(e);
	}
}

export const pauseGame = async () => {
	try {
		useGameStore.getState().setIsPaused(true);
	} catch (e) {
		console.log(e);
	}
}

export const exitGame = async (user?: User) => {
	try {
		useGameStore.getState().setIsPaused(true);
		const { xp, totalPoints, liquidity, startGame, collectedItems } = useGameStore.getState();

		const pointsBalance = (totalPoints || user?.pointsBalance || 0) + xp;

		const userUpdatedInfo = await api.updateUser({
			pointsBalance,
			liquidity,
			collectedItems
		});
		await api.setSessionGame(startGame, userUpdatedInfo.liquidity);

		useGameStore.getState().setXp(0);
		useGameStore.getState().setTotalPoints(pointsBalance);
		useGameStore.getState().setLiquidity(userUpdatedInfo.liquidity);
		useGameStore.getState().setIsPlay(false);
	} catch (e) {
		console.log(e);
	}
}

export const setNewInfo = async (user: User) => {
	const { xp, startGame, liquidity, totalPoints, collectedItems } = useGameStore.getState();
	const pointsBalance = (totalPoints || user.pointsBalance) + xp;
	const level = user.level;

	try {
		await api.updateUser({
			pointsBalance,
			liquidity,
			collectedItems,
			level,
		});
		await api.setSessionGame(startGame, liquidity);
	} catch (e) {
		console.error(e)
	}
}
