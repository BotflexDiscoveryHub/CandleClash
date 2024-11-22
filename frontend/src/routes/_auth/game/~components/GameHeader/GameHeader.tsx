import React, { useEffect, useState } from 'react';
import { calculateLevel } from '../../../../../utils/levels.ts';
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
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
		const [filteredBoosts, setFilteredBoosts] = useState<Boost[]>(boosts)

		useEffect(() => {
			setFilteredBoosts(
				(prevState) => prevState.filter(
					(boost) => boost.type === BoostType.POINTS
				)
			)
		}, [boosts]);

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

				{!!filteredBoosts.length && (
					<div className={styles.gameHeader__boosts}>
						{filteredBoosts.map((boost) => <span key={boost.expirationDate + boost.type}>{boost.description}</span>)}
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
