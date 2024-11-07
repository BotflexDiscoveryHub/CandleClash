import styles from './NewLvlModal.module.scss'
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
import { calculateLevel } from '../../../../../utils/levels.ts';
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../../utils/queryOptions.tsx';
import useGameStore from '../../../../../store';
import { exitGame } from '../../../../../components/BottomNavigation/methods';
import { FC, useEffect } from 'react';

interface IProps {
	setModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const NewLvlModal: FC<IProps> = ({ setModal }) => {
	const { xp, setIsPlay, setIsPaused } = useGameStore();
	const { data: user } = useSuspenseQuery(userQueryOptions());
	const { level, remainingXP, nextLevelXP, progressPercent } = calculateLevel(user.pointsBalance + xp)!;

	const handleStart = () => {
		setIsPaused(false);
		setModal(false);
	}

	const handleExit = async () => {
		await exitGame();
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
