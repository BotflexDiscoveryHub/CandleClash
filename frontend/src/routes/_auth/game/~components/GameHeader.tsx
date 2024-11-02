import React from 'react';
import { calculateLevel } from '../../../../utils/levels.ts';
import { ProgressBar } from '../../../../components/ProgressBar/ProgressBar.tsx';

interface GameHeaderProps {
	liquidity: number;
	totalPoints: number;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(
	({ liquidity, totalPoints }) => {
		const { level, remainingXP, nextLevelXP, progressPercent } = calculateLevel(totalPoints)!;

		return (
			<div className="flex flex-col justify-center items-center w-full gap-2 px-3">
				<div className="px-3 bg-red-300 rounded-xl mb-1 mt-4 text-sm">
					Total points: {totalPoints}
				</div>
				<div className="flex w-full items-center justify-center">
					<ProgressBar
						progress={progressPercent}
					/>
					<p className="absolute text-white">
						Level {level}/
						XP {remainingXP}/
						{nextLevelXP}
					</p>
				</div>
				<div className="flex w-full items-center justify-center">
					<ProgressBar progress={liquidity} />
					<p className="absolute text-white">Liquidity</p>
				</div>
			</div>
		);
	}
);
