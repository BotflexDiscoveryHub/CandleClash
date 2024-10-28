export function throttle(fn: (...args: any) => void, limit: number) {
	let lastCall = 0;
	return function (...args: any) {
		const now = new Date().getTime();
		if (now - lastCall < limit) {
			return;
		}
		lastCall = now;
		return fn(...args);
	};
}
