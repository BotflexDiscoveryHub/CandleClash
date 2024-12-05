import { useEffect, useState } from 'react';
import useGameStore from '../../../../store';
import { useComboCounter } from './useComboCounter.ts';
import { useWaveOfCandles } from './useWaveOfCandles.ts';
import { useDumpMode } from './useDumpMode.ts';

export const useGameEvents = () => {
	const { xp, setIsMode } = useGameStore();
	const [collectionItems, setCollectionItems] = useState<number>(xp);
	const [timeAddFallingObject, setTimeAddFallingObject] = useState<number>(1000);

	const { catchCandle, resetCombo } = useComboCounter();
	const { isWave } = useWaveOfCandles({ setTimeAddFallingObject });
	const { isDumpMode } = useDumpMode({ collectionItems, setIsMode });

	useEffect(() => {
		setCollectionItems((prevState) => prevState > xp ? prevState : prevState + 1)
	}, [xp])

	return { isDumpMode, isWave, timeAddFallingObject, catchCandle, resetCombo };
};
