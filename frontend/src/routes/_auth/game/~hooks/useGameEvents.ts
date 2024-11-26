import { useEffect, useState } from 'react';
import useGameStore from '../../../../store';
import { useComboCounter } from './useComboCounter.ts';
import { FallingObject } from '../~types/fallingObject.ts';

export const useGameEvents = () => {
	const { xp, setIsMode } = useGameStore();
	const [isDumpMode, setIsDumpMode] = useState(false);
	const [stage, setStage] = useState(1);
	const [collectionItems, setCollectionItems] = useState<number>(xp);
	const [hasTriggeredDumpOnce, setHasTriggeredDumpOnce] = useState(false);

	const { catchCandle, resetCombo } = useComboCounter();

	// const { progressPercent } = calculateLevel(user.pointsBalance + xp)!;
	// const stage = Math.ceil((progressPercent / 100) * 3);

	const speed = 4.5;
	const xpCatch = 30;

	const getNewObject = (): FallingObject => {
		const color = Math.random() > 0.5 ? "green" : "red";

		const fallingObject = {
			id: Date.now() * Math.random(),
			x: Math.random() * (window.innerWidth - 20),
			y: Math.random() * 5,
			isHidden: false,
			topHeight: Math.floor(Math.random() * 60), // Случайная высота верхней части
			bottomHeight: Math.floor(Math.random() * 50), // Случайная высота нижней части
		}

		if (isDumpMode) {
			return {
				...fallingObject,
				color: "red",
				speed: speed * 2
			}
		}

		if (stage === 1) {
			return {
				...fallingObject,
				color,
				speed: speed
			}
		}

		if (stage === 2) {
			return {
				...fallingObject,
				color,
				speed: speed * 1.5
			}
		}

		if (stage === 3) {
			return {
				...fallingObject,
				color,
				speed: speed * 2
			}
		}

		return {
			...fallingObject,
			color,
			speed
		}
	}

	useEffect(() => {
		setCollectionItems((prevState) => prevState > xp ? prevState : prevState + 1)
	}, [xp])

	useEffect(() => {
		// Активируем режим "Dump", только если он еще не активировался
		if (
			collectionItems % xpCatch === 0 &&
			collectionItems > 0 &&
			!isDumpMode &&
			!hasTriggeredDumpOnce
		) {
			setHasTriggeredDumpOnce(true);
			setTimeout(() => {
				setIsDumpMode(true);
			}, 1000);
		}

		if (!isDumpMode && collectionItems % xpCatch !== 0) {
			setHasTriggeredDumpOnce(false); // Разрешаем новый "Dump" после изменений
		}
	}, [collectionItems, isDumpMode, hasTriggeredDumpOnce]);

	// Включение и выключение режима "Dump"
	useEffect(() => {
		if (isDumpMode) {
			setIsMode(true);

			const dumpTimer = setTimeout(() => {
				setIsDumpMode(false); // Выключаем режим через 10 секунд
				setStage((prevState) => {
					console.log(prevState, 'prevState')
					if (prevState === 3) {
						return 1
					}

					return prevState + 1
				});
			}, 10000);

			return () => clearTimeout(dumpTimer); // Чистим таймер при выходе
		} else {
			setIsMode(false);
		}
	}, [isDumpMode]);

	return { isDumpMode, getNewObject, catchCandle, resetCombo };
};
