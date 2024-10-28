import React from 'react';
import { getLevel } from '../../../../utils/levels.ts';
import { ProgressBar } from '../../../../components/ui/progress-bar.tsx';

interface GameHeaderProps {
	liquidity: number;
	totalPoints: number;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(
	({ liquidity, totalPoints }) => {
		console.log(totalPoints, 'totalPoints')
		const level = getLevel(totalPoints)!;
		return (
			<div className="flex flex-col justify-center items-center w-full gap-2 px-3">
				<div className="px-3 bg-red-300 rounded-xl mb-1 mt-4 text-sm">
					Total points: {totalPoints}
				</div>
				<div className="flex w-full items-center justify-center">
					<ProgressBar
						progress={
							((totalPoints - level.points) /
								(level.nextLevelPoints - level.points)) *
							100
						}
					/>
					<p className="absolute text-white">
						XP {totalPoints - level.points}/
						{level.nextLevelPoints - level.points}
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
