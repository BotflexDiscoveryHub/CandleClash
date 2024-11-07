import { Link, useLocation } from '@tanstack/react-router';
import { navigationItemsMock } from './mocks';
import styles from './BottomNavigation.module.scss'
import { cn } from '../../lib/utils.ts';
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../utils/queryOptions.tsx';

export const BottomNavigation = () => {
	const { pathname } = useLocation()
	const currentUrl = pathname.trim()
	const { data: user } = useSuspenseQuery(userQueryOptions());

	return (
		<nav className={styles.navigate}>
			{!!navigationItemsMock.length && navigationItemsMock.map(({ id, text, url, icon: Icon, onClick }) => (
				<Link key={id} to={url} onClick={() => onClick && onClick(user)}>
					<button className={cn(styles.navigate__button, {
						[styles.active]: currentUrl === url
					})}>
						<Icon />

						{text}
					</button>
				</Link>
			))}
		</nav>
	);
};
