import { useCallback, useEffect, useRef, useState } from 'react';
import { FallingObject } from '../~types/fallingObject.ts';
import useGameStore from '../../../../store';
import { debounce } from '../../../../utils/debounce.ts';

export const useGameAnimation = () => {
	const {
		liquidity,
		xp,
		setXp,
		isPaused,
		setIsPaused,
		playerPosition,
		setPlayerPosition,
	} = useGameStore();
	const [_, forceRender] = useState(false); // Форсируем ререндер только при необходимости
	const [isModalVisible, setIsModalVisible] = useState(false);
	const fallingObjectsRef = useRef<FallingObject[]>([]); // Храним объекты без ререндеров
	const playerPositionRef = useRef(playerPosition); // Позиция игрока

	// Обновляем позицию игрока без ререндеров
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isPaused) {
				playerPositionRef.current = { x: e.clientX, y: playerPositionRef.current.y };
				setPlayerPosition({ x: e.clientX }); // Обновляем состояние при необходимости
			}
		},
		[isPaused, setPlayerPosition]
	);

	const handleTouchMove = useCallback(
		debounce((e) => {
			if (!isPaused) {
				const touchX = Number(e.touches[0].clientX);
				playerPositionRef.current = { x: touchX, y: playerPositionRef.current.y };
				setPlayerPosition({ x: touchX });
			}
		}, 50),
		[isPaused, setPlayerPosition]
	);

	// Добавляем объекты каждые 1000 мс
	useEffect(() => {
		const addFallingObject = () => {
			if (isPaused) return;
			const randomColor = Math.random() > 0.5 ? "green" : "red";
			const newObject: FallingObject = {
				x: Math.random() * window.innerWidth,
				y: 0,
				color: randomColor,
				id: Date.now(),
				isHidden: false,
			} as FallingObject;
			fallingObjectsRef.current.push(newObject); // Добавляем объект без рендера
			forceRender((prev) => !prev); // Форсируем ререндер
		};

		const interval = setInterval(addFallingObject, 1000);
		return () => clearInterval(interval);
	}, [isPaused]);

	// Цикл анимации: обновляем объекты и проверяем столкновения
	useEffect(() => {
		let animationFrameId: number;

		const updateGame = () => {
			if (!isPaused) {
				// Обновляем позиции объектов
				fallingObjectsRef.current = fallingObjectsRef.current
				.map((obj) => ({ ...obj, y: obj.y + 3 })) // Двигаем объекты вниз
				.filter((obj) => obj.y < window.innerHeight); // Удаляем вышедшие за экран

				// Проверяем столкновения
				fallingObjectsRef.current.forEach((obj) => {
					if (
						obj.y <= playerPositionRef.current.y! + 20 &&
						obj.y > playerPositionRef.current.y! - 60 &&
						obj.x > playerPositionRef.current.x - 30 &&
						obj.x < playerPositionRef.current.x + 30 &&
						!obj.isHidden
					) {
						obj.isHidden = true;
						if (obj.color === "green") {
							setXp(xp + 1); // Увеличиваем XP
						} else {
							const newXp = xp - 1;
							if (newXp < 0 || liquidity <= 0) {
								setIsModalVisible(true); // Показать Game Over
								setIsPaused(true); // Остановить игру
							} else {
								setXp(Math.max(newXp, 0)); // Обновляем XP
							}
						}
					}
				});

				// Форсируем рендер, если что-то изменилось
				forceRender((prev) => !prev);
			}

			animationFrameId = requestAnimationFrame(updateGame);
		};

		animationFrameId = requestAnimationFrame(updateGame);
		return () => cancelAnimationFrame(animationFrameId);
	}, [isPaused, liquidity, xp]);

	return {
		isModalVisible,
		fallingObjectsRef,
		playerPositionRef,
		handleMouseMove,
		handleTouchMove
	}
}
