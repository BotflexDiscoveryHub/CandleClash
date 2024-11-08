import { FC, useEffect } from 'react';
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
import { calculateLevel } from '../../../../../utils/levels.ts';
import useGameStore from '../../../../../store';
import { exitGame } from '../../../../../components/BottomNavigation/methods';
import { User } from '../../../../../types/User.ts';
import styles from './NewLvlModal.module.scss'

interface IProps {
	user: User
	setModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const NewLvlModal: FC<IProps> = ({ user, setModal }) => {
	const { xp, totalPoints, setIsPlay, setIsPaused } = useGameStore();

	const pointsBalance = (totalPoints || user.pointsBalance) + xp;
	const { level, remainingXP, nextLevelXP, progressPercent } = calculateLevel(pointsBalance)!;

	const handleStart = () => {
		setIsPaused(false);
		setModal(false);
	}

	const handleExit = async () => {
		await exitGame(user);
		setIsPlay(false);
		setModal(false);
	}

	useEffect(() => {
		setIsPaused(true);
	}, []);

	return (
		<div className={styles.lvlUp}>
			<div className={styles.lvlUp__title}>
				Congratulations!
			</div>
			<div className={styles.lvlUp__subTitle}>
				You reached the new level
			</div>

			<div className={styles.lvlUp__xp}>
				<div className={styles.lvlUp__xp__info}>
						<span>
							lvl {level}
						</span>

					<span>
							XP {remainingXP}/
						{nextLevelXP}
						</span>
				</div>
				<ProgressBar progress={progressPercent} />
			</div>

			<div className={styles.lvlUp__buttons}>
				<button onClick={handleStart}>
					Continue
				</button>

				<button onClick={handleExit}>
					Exit to Menu
				</button>
			</div>
		</div>
	);
};
