import { Link, useLocation } from '@tanstack/react-router';
import { navigationItemsMock } from './mocks';
import styles from './BottomNavigation.module.scss'
import { cn } from '../../lib/utils.ts';

export const BottomNavigation = () => {
	const { pathname } = useLocation()
	const currentUrl = pathname.trim()

	return (
		<footer className={styles.navigate}>
			{!!navigationItemsMock.length && navigationItemsMock.map(({ id, text, url, icon: Icon, onClick }) => (
				<Link key={id} to={url} onClick={onClick}>
					<button className={cn(styles.navigate__button, {
						[styles.active]: currentUrl === url
					})}>
						<Icon />

						{text}
					</button>
				</Link>
			))}
		</footer>
	);
};
