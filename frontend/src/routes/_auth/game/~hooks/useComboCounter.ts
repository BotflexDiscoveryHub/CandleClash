import { useState } from 'react';

export const useComboCounter = () => {
	const [combo, setCombo] = useState(0); // Текущее комбо
	const [maxCombo, setMaxCombo] = useState(0); // Максимальное комбо
	const [multiplier, setMultiplier] = useState(1); // Множитель очков

	// Функция для вызова при успешном действии (например, поймать зеленую свечу)
	const catchCandle = () => {
		setCombo((prevCombo) => {
			const newCombo = prevCombo + 1;

			// Обновляем множитель за каждые 5 свечей
			if (newCombo % 5 === 0) {
				setMultiplier((prevMultiplier) => parseFloat((prevMultiplier + 0.1).toFixed(1)));
			}

			// Обновляем максимальное комбо
			setMaxCombo((prevMax) => Math.max(prevMax, newCombo));

			return newCombo;
		});
	};

	// Функция для сброса комбо при неудаче
	const resetCombo = () => {
		setCombo(0);
		setMultiplier(1); // Сбрасываем множитель

		return calculateScore(combo);
	};

	// Функция для вычисления очков с учетом множителя
	const calculateScore = (basePoints: number) => {
		if (!basePoints) return 0;

		const totalPoints = basePoints * multiplier;
		const result = Math.ceil(totalPoints - basePoints)

		return result || 0;
	};

	return {
		combo,        // Текущее комбо
		maxCombo,     // Максимальное комбо
		multiplier,   // Текущий множитель
		catchCandle,  // Вызывается при успешном действии
		resetCombo,   // Вызывается при сбое
		calculateScore, // Вызывается для подсчета очков
	};
};
