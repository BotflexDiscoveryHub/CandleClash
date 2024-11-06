import styles from './GameStart.module.scss'
import bot from '../../../../../assets/bot-large.png'
import bg from '../../../../../assets/bg.png'
import start from '../../../../../assets/start-game.png'
import { startGame } from '../../../../../components/BottomNavigation/methods';

export const GameStart = () => {
	return (
		<div className={styles.gameStart}>
			<img className={styles.gameStart__bg} src={bg} />
			<img className={styles.gameStart__bot} src={bot} />

			<div className={styles.gameStart__control}>
				<img className={styles.gameStar__start} src={start} />

				<button onClick={startGame}>
					Play!
				</button>
			</div>
		</div>
	);
};
