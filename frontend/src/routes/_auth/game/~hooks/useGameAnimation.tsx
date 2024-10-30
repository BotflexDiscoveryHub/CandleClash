import { useCallback, useEffect, useRef, useState } from 'react';
import { FallingObject, FloatingNumbers } from '../~types/fallingObject.ts';
import useGameStore from '../../../../store';

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
	const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumbers[]>([]); // Хранение чисел для анимации

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
				topHeight: Math.floor(Math.random() * 50), // Случайная высота верхней части
				bottomHeight: Math.floor(Math.random() * 50), // Случайная высота нижней части
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
						obj.y <= playerPositionRef.current.y! - 20 &&
						obj.y > playerPositionRef.current.y! - 100 &&
						obj.x > playerPositionRef.current.x - 30 &&
						obj.x < playerPositionRef.current.x + 30 &&
						!obj.isHidden
					) {
						obj.isHidden = true;
						if (obj.color === "green") {
							setXp(xp + 1); // Увеличиваем XP
							setFloatingNumbers((prev) => [
								...prev,
								{ x: obj.x, y: obj.y, value: +1, id: Date.now(), yOffset: 0, alpha: 1 } // Добавляем число +1
							]);
						} else {
							const newXp = xp - 1;
							if (newXp < 0 || liquidity <= 0) {
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
				});

				// Форсируем рендер, если что-то изменилось
				forceRender((prev) => !prev);
			}

			animationFrameId = requestAnimationFrame(updateGame);
		};

		animationFrameId = requestAnimationFrame(updateGame);
		return () => cancelAnimationFrame(animationFrameId);
	}, [isPaused, liquidity, xp]);

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
		handleTouchMove
	}
}
