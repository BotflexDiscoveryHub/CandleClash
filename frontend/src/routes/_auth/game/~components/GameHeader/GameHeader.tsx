import React from 'react';
import { calculateLevel } from '../../../../../utils/levels.ts';
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
import { calculateBoostStats } from '../../~methods';
import { Boost, BoostType } from '../../../rewards/~types';
import styles from './GameHeader.module.scss'

interface GameHeaderProps {
	liquidity: number;
	totalPoints: number;
	boosts: Boost[];
	isMode: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(
	({ liquidity, totalPoints, boosts = [], isMode }) => {
		const { level, remainingXP, nextLevelXP, progressPercent } = calculateLevel(totalPoints)!;
		const pointBoost = calculateBoostStats(boosts, BoostType.POINTS)
		const liquidityBoost = calculateBoostStats(boosts, BoostType.LIQUIDITY)

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

				{(pointBoost || liquidityBoost) && (
					<div className={styles.gameHeader__boosts}>
						{pointBoost && <span>{pointBoost.description}</span>}
						{liquidityBoost && <span>{liquidityBoost.description}</span>}
					</div>
				)}

				{isMode && (
					<div className={styles.gameHeader__mode}>
						<span>Dump Mode</span>
					</div>
				)}
			</>
		);
	}
);
