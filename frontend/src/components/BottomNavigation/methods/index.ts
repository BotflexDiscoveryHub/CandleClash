import useGameStore from '../../../store';
import api from '../../../api';

export const startGame = async () => {
	try {
		useGameStore.getState().setIsPaused(false);
		useGameStore.getState().setXp(0);
	} catch (e) {
		console.log(e);
	}
}

export const reloadGame = () => {
	const {
		isPaused,
		setIsPaused
	} = useGameStore();

	setIsPaused(!isPaused);
}

export const exitGame = async () => {
	try {
		const newTotalPoints =
			useGameStore.getState().totalPoints + useGameStore.getState().xp;
		await api.updateUser({
			pointsBalance: newTotalPoints,
			liquidity: useGameStore.getState().liquidity,
		});
		useGameStore.getState().setIsPaused(true);
		useGameStore.getState().setXp(0);
		useGameStore.getState().setTotalPoints(newTotalPoints);
	} catch (e) {
		console.log(e);
	}
}
