import React from 'react';
import { calculateLevel } from '../../../../../utils/levels.ts';
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
import styles from './GameHeader.module.scss'
import { Boost, BoostType } from '../../../rewards/~types';

interface GameHeaderProps {
	liquidity: number;
	totalPoints: number;
	boosts: Boost[];
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(
	({ liquidity, totalPoints, boosts }) => {
		const { level, remainingXP, nextLevelXP, progressPercent } = calculateLevel(totalPoints)!;

		return (
			<>
				<div className={styles.gameHeader}>
					<div className={styles.gameHeader__total}>Total: {totalPoints}</div>

					<div className={styles.gameHeader__container}>
						<div className={styles.gameHeader__xp}>
							<div className={styles.gameHeader__xp__info}>
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

						<div className={styles.gameHeader__liquidity}>
							<span>Daily Energy</span>
							<ProgressBar progress={liquidity} color='green' />
						</div>
					</div>
				</div>

				{!!boosts.length && (
					<div className={styles.gameHeader__boosts}>
						{boosts.map((boost) => {
							if (boost.type === BoostType.POINTS) {
								return (
									<span>{boost.description}</span>
								)
							}
						})}
					</div>
				)}
			</>
		);
	}
);
