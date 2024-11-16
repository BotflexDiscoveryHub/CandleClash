import { Link, useLocation } from '@tanstack/react-router';
import { navigationItemsMock } from './mocks';
import styles from './BottomNavigation.module.scss'
import { cn } from '../../lib/utils.ts';
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../utils/queryOptions.tsx';
import useGameStore from '../../store';

export const BottomNavigation = () => {
	const { pathname } = useLocation()
	const currentUrl = pathname.trim()
	const { data: user } = useSuspenseQuery(userQueryOptions());
	const {
		isPlay,
		isPaused
	} = useGameStore();

	return (
		<nav className={styles.navigate}>
			{!!navigationItemsMock.length && navigationItemsMock.map(({ id, text, url, icon: Icon, onClick }) => {
				if (isPlay && id === 'game') return null;
				if (!isPlay && (id === 'pause' || id === 'start')) return null;
				if (!isPaused && id === 'start') return null;
				if (isPaused && id === 'pause') return null;

				if (url) {
					return (
						<Link key={id + url} to={url} onClick={() => onClick && onClick(user)}>
							<button className={cn(styles.navigate__button, {
								[styles.active]: currentUrl === url,
							})}>
								<Icon />

								{text}
							</button>
						</Link>
					)
				}

				return (
					<button key={id} onClick={() => onClick && onClick(user)} className={cn(styles.navigate__button, {
						[styles.active]: (id === 'pause' || id === 'start')
					})}>
						<Icon />

						{text}
					</button>
				)
			})}
		</nav>
	);
};
