export function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId); // Сбрасываем таймер, если он уже запущен
		}
		timeoutId = setTimeout(() => {
			func(...args); // Выполняем функцию после задержки
		}, delay);
	};
}
