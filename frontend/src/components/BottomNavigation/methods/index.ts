import useGameStore from '../../../store';
import api from '../../../api';
import { User } from '../../../types/User.ts';

export const startGame = async () => {
	try {
		useGameStore.getState().setIsPaused(false);
		useGameStore.getState().setIsPlay(true);
		useGameStore.getState().setXp(0);
	} catch (e) {
		console.log(e);
	}
}

export const exitGame = async (user?: User) => {
	try {
		useGameStore.getState().setIsPaused(true);
		const { xp, totalPoints, liquidity, startGame, isPlay } = useGameStore.getState();

		const pointsBalance = (totalPoints || user?.pointsBalance || 0) + xp;

		if (!isPlay) return;

		const userUpdatedInfo = await api.updateUser({
			pointsBalance,
			liquidity,
		});
		await api.getRewards();
		await api.setSessionGame(startGame, liquidity);

		useGameStore.getState().setIsPlay(false);
		useGameStore.getState().setXp(0);
		useGameStore.getState().setTotalPoints(pointsBalance);
		useGameStore.getState().setLiquidity(userUpdatedInfo.liquidity);
	} catch (e) {
		console.log(e);
	}
}

export const setNewInfo = async (user: User) => {
	const { xp, startGame, liquidity, totalPoints } = useGameStore.getState();
	const pointsBalance = (totalPoints || user.pointsBalance) + xp;

	try {
		await api.updateUser({
			pointsBalance,
			liquidity,
		});
		await api.getRewards();
		await api.setSessionGame(startGame, liquidity);
	} catch (e) {
		console.error(e)
	}
}
