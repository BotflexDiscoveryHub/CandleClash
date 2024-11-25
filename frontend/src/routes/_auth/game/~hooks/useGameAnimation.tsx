import { useCallback, useEffect, useRef, useState } from 'react';
import useGameStore from '../../../../store';
import { useLiquidity } from './useLiquidity.tsx';
import { useGameEvents } from './useGameEvents.ts';
import { Boost, BoostType } from '../../rewards/~types';
import { FallingObject, FloatingNumbers } from '../~types/fallingObject.ts';

export const useGameAnimation = () => {
	const {
		boosts,
		xp,
		setXp,
		isPaused,
		setIsPaused,
		playerPosition,
		setPlayerPosition,
		collectedItems,
		setCollectedItems,
	} = useGameStore();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const fallingObjectsRef = useRef<FallingObject[]>([]); // Храним объекты без ререндеров
	const playerPositionRef = useRef(playerPosition); // Позиция игрока
	const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumbers[]>([]); // Хранение чисел для анимации
	const [buff, setBuff] = useState<number>(1); // Хранение чисел для анимации

	useLiquidity(setIsModalVisible);

	const { isDumpMode, getNewObject, catchCandle, resetCombo } = useGameEvents();

	// Обновляем позицию игрока без ререндеров
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isPaused) {
				playerPositionRef.current = { x: e.clientX, y: playerPositionRef.current.y};
				setPlayerPosition({ x: e.clientX }); // Обновляем состояние при необходимости
			}
		},
		[isPaused, setPlayerPosition]
	);

	const handleTouchMove = useCallback((e: any) => {
			if (!isPaused) {
				const touchX = Number(e.touches[0].clientX);
				playerPositionRef.current = { x: touchX, y: playerPositionRef.current.y };
				setPlayerPosition({ x: touchX });
			}
		},
		[isPaused, setPlayerPosition]
	);

	const accumulateBoosts = (boosts: Boost[]): number => {
		return boosts.reduce<number>(
			(acc, boost) => {
				if (boost.type === BoostType.POINTS) {
					acc += boost.multiplier;
				}

				return acc;
			}, 0
		);
	}

	useEffect(() => {
		if (!!boosts.length) {
			const accumulated = accumulateBoosts(boosts) || 1

			setBuff(accumulated)
		}
	}, [boosts]);

	// Добавляем объекты каждые 1000 мс
	useEffect(() => {
		const addFallingObject = () => {
			if (isPaused) return;
			const newObject = getNewObject();
			fallingObjectsRef.current.push(newObject); // Добавляем объект без рендера

			if (isDumpMode) {
				const dumpObject = getNewObject();

				setTimeout(() => {
					fallingObjectsRef.current.push(dumpObject);
				}, 350)
			}
		};

		const interval = setInterval(addFallingObject, 1000);
		return () => clearInterval(interval);
	}, [isPaused, isDumpMode]);

	// Цикл анимации: обновляем объекты и проверяем столкновения
	useEffect(() => {
		let animationFrameId: number;

		const updateGame = () => {
			if (!isPaused) {
				// Обновляем позиции объектов
				fallingObjectsRef.current = fallingObjectsRef.current
				.map((obj) => {
					if (
						obj.y <= playerPositionRef.current.y! - 20 &&
						obj.y > playerPositionRef.current.y! - 100 &&
						obj.x > playerPositionRef.current.x - 30 &&
						obj.x < playerPositionRef.current.x + 30 &&
						!obj.isHidden
					) {
						obj.isHidden = true;
						if (obj.color === "green") {
							catchCandle();
							setXp(xp + buff); // Увеличиваем XP
							setCollectedItems(collectedItems + 1);
							setFloatingNumbers((prev) => [
								...prev,
								{ x: obj.x, y: obj.y, value: + buff, id: Date.now(), yOffset: 0, alpha: 1 } // Добавляем число +1
							]);
						} else {
							const combo = resetCombo();
							const newXp = (xp - 1) + combo;
							if (newXp < 0) {
								setIsModalVisible(true); // Показать Game Over
								setIsPaused(true); // Остановить игру
							} else {
								setXp(Math.max(newXp, 0)); // Обновляем XP
								setFloatingNumbers((prev) => [
									...prev,
									{ x: obj.x, y: obj.y, value: -1, id: Date.now(), yOffset: 0, alpha: 1 } // Добавляем число -1
								]);
							}
						}
					}

					return { ...obj, y: obj.y + obj.speed }
				}) // Двигаем объекты вниз
				.filter((obj) => obj.y < window.innerHeight); // Удаляем вышедшие за экран
			}

			animationFrameId = requestAnimationFrame(updateGame);
		};

		animationFrameId = requestAnimationFrame(updateGame);
		return () => cancelAnimationFrame(animationFrameId);
	}, [isPaused, xp]);

	useEffect(() => {
		const timers = floatingNumbers.map((num) =>
			setTimeout(() => {
				setFloatingNumbers((prev) =>
					prev.filter((n) => n.id !== num.id)
				);
			}, 1000) // Удаляем через 1 секунду
		);

		return () => timers.forEach(clearTimeout); // Очищаем таймеры при размонтировании
	}, [floatingNumbers]);

	useEffect(() => {
		const animate = () => {
			setFloatingNumbers((prev) =>
				prev
				.map((num) => ({
					...num,
					yOffset: num.yOffset - 1, // Смещаем вверх
					alpha: num.alpha - 0.02, // Уменьшаем прозрачность
				}))
				.filter((num) => num.alpha > 0) // Удаляем числа, когда они становятся невидимыми
			);
		};

		const interval = setInterval(animate, 16); // Каждые 16 мс (примерно 60 FPS)

		return () => clearInterval(interval); // Очищаем интервал при размонтировании
	}, [])

	return {
		isModalVisible,
		floatingNumbers,
		fallingObjectsRef,
		playerPositionRef,
		handleMouseMove,
		handleTouchMove,
		setIsModalVisible
	}
}
