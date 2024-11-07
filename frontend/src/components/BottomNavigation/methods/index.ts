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

export const exitGame = async (user: User) => {
	try {
		const newTotalPoints =
			useGameStore.getState().totalPoints + useGameStore.getState().xp;
		await api.updateUser({
			pointsBalance: newTotalPoints || user.pointsBalance,
			liquidity: useGameStore.getState().liquidity,
		});
		useGameStore.getState().setIsPlay(false);
		useGameStore.getState().setIsPaused(true);
		useGameStore.getState().setXp(0);
		useGameStore.getState().setTotalPoints(newTotalPoints);
	} catch (e) {
		console.log(e);
	}
}
