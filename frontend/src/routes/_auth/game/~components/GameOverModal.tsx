import api from '../../../../api';
import useGameStore from '../../../../store';

interface GameOverModalProps {
	xp: number;
	liquidity: number;
	totalPoints: number;
	setIsPaused: (isPaused: boolean) => void;
}

export function GameOverModal({
	                       xp,
	                       liquidity,
	                       totalPoints,
	                       setIsPaused,
                       }: GameOverModalProps) {
	const { setIsPlay } = useGameStore();

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
			<div className="bg-white p-5 rounded-lg flex flex-col items-center">
				<h2 className="text-xl font-bold mb-4">Game Over</h2>
				<p>Your {liquidity === 0 ? "liquidity" : "XP"} has reached zero.</p>
				<button
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
					onClick={async () => {
						await api.updateUser({
							pointsBalance: totalPoints + xp < 0 ? 0 : totalPoints + xp,
							liquidity,
						});
						setIsPaused(false);
						setIsPlay(false);
					}}
				>
					Go to Home
				</button>
			</div>
		</div>
	);
}
