import { startGame } from '../../../../../components/BottomNavigation/methods';
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../../utils/queryOptions.tsx';

import bot from '../../../../../assets/bot-large.png'
import bg from '../../../../../assets/bg.png'
import start from '../../../../../assets/start-game.png'

import styles from './GameStart.module.scss'

export const GameStart = () => {
	const { refetch } = useSuspenseQuery(userQueryOptions());

	const handleRefetchUserInfo = async () => {
	  try {
			window.scrollTo(0, 0);
		  await refetch();
		  await startGame();
	  } catch (e) {
		  console.error(e);
	  }
	}

	return (
		<div className={styles.gameStart}>
			<img className={styles.gameStart__bg} src={bg} />
			<img className={styles.gameStart__bot} src={bot} />

			<div className={styles.gameStart__control}>
				<img className={styles.gameStar__start} src={start} />

				<button onClick={handleRefetchUserInfo}>
					Play!
				</button>
			</div>
		</div>
	);
};
