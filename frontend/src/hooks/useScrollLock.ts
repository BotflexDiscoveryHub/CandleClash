import { useEffect } from 'react';

export const useScrollLock = (isLocked: boolean) => {
	useEffect(() => {
		if (isLocked) {
			// Сохраняем текущую позицию прокрутки
			const scrollY = window.scrollY;

			// Устанавливаем overflow: hidden для <html> и <body>
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';

			// Блокируем прокрутку, фиксируя положение
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
			document.body.style.left = '0';
			document.body.style.right = '0';
			document.body.style.width = '100%';
		} else {
			// Снимаем блокировку
			const scrollY = document.body.style.top;
			document.documentElement.style.overflow = '';
			document.body.style.overflow = '';
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.left = '';
			document.body.style.right = '';
			document.body.style.width = '';

			// Восстанавливаем прежнее положение прокрутки
			window.scrollTo(0, parseInt(scrollY || '0') * -1);
		}

		// Очистка при размонтировании
		return () => {
			document.documentElement.style.overflow = '';
			document.body.style.overflow = '';
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.left = '';
			document.body.style.right = '';
			document.body.style.width = '';
		};
	}, [isLocked]);
}
