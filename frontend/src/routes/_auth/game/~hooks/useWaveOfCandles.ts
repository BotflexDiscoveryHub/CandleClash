import { useEffect, useState } from 'react';

type UseWaveOfCandles = {
	setTimeAddFallingObject: React.Dispatch<React.SetStateAction<number>>
}

export const useWaveOfCandles = ({ setTimeAddFallingObject }: UseWaveOfCandles) => {
	const [isWave, setIsWave] = useState(false);
	const waveDuration = 5000;
	const waveInterval = 10000;

	useEffect(() => {
		const intervalId = setInterval(() => {
			setIsWave(true);

			const waveEndTimeout = setTimeout(() => {
				setIsWave(false);
			}, waveDuration);

			return () => clearTimeout(waveEndTimeout);
		}, waveInterval);

		return () => clearInterval(intervalId);
	}, [
		waveInterval,
		waveDuration,
	]);

	useEffect(() => {
		if (isWave) {
			setTimeAddFallingObject(250)
		} else {
			setTimeAddFallingObject(1000)
		}
	}, [isWave]);

	return { isWave }
}
