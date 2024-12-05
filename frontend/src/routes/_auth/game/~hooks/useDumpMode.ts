import { useEffect, useState } from 'react';

type UseDumpMode = {
	collectionItems: number
	setIsMode: (isMode: boolean) => void
}

export const useDumpMode = ({ collectionItems, setIsMode }: UseDumpMode) => {
	const [isDumpMode, setIsDumpMode] = useState(false);
	const [hasTriggeredDumpOnce, setHasTriggeredDumpOnce] = useState(false);

	const xpCatch = 30;

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
			}, 10000);

			return () => clearTimeout(dumpTimer); // Чистим таймер при выходе
		} else {
			setIsMode(false);
		}
	}, [isDumpMode]);

	return { isDumpMode }
}
