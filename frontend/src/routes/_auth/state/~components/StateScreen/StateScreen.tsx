import styles from './StateScreen.module.scss'
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../../utils/queryOptions.tsx';
import { UserIcon } from '../../../../../components/UserIcon/UserIcon.tsx';
import useGameStore from '../../../../../store';
import { calculateLevel } from '../../../../../utils/levels.ts';
import { cn } from '../../../../../lib/utils.ts';
import { CoinIcon } from '../../../../../components/CoinIcon/CoinIcon.tsx';
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
import bot from '../../../../../assets/bot-large.png'
import api from '../../../../../api';

export const StateScreen = () => {
	const { data: user, refetch } = useSuspenseQuery(userQueryOptions());
	const { pointsBalance, liquidity: liquidityUser, liquidityPools } = user || {}
	const { setLiquidity } = useGameStore()
	const totalPoints = useGameStore.getState().totalPoints || pointsBalance;
	const liquidity = useGameStore.getState().liquidity || liquidityUser;
	const { level, remainingXP, nextLevelXP, progressPercent } = calculateLevel(totalPoints)!;

	const handleRequestLiquidityPool = async () => {
		if (!user.liquidityPools || user.liquidity === 100) return;

		try {
			await api.updateUser({
				telegramId: user.telegramId,
				liquidity: 100,
				liquidityPools: user.liquidityPools - 1,
			});
			await refetch()
			setLiquidity(100)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<div className={styles.screen}>
			<div className={styles.screen__info}>
				{user.firstName && (
					<div className={styles.screen__info_user}>
						<UserIcon />
					  {user.firstName}
				  </div>
				)}

				<div className={cn(styles.screen__info_bot, styles.active)}>
					<UserIcon />

					<p>Grid-bot <span>{level} lvl</span></p>
				</div>
			</div>

			<div className={styles.screen__coins}>
				<p>Coins earned:</p>

				<span>
					<CoinIcon />

					1 000 000
				</span>
			</div>

			<div className={styles.screen__level}>
				<div className={styles.screen__level__info}>
					<span>lvl {level}</span>
					<span className={styles.screen__level__xp}>XP {remainingXP}/{nextLevelXP}</span>
				</div>

				<ProgressBar
					progress={progressPercent}
				/>
			</div>

			<div className={styles.screen__image}>
				<img src={bot} />
			</div>

			<div className={styles.screen__pool}>
				<div className={styles.screen__pool__info}>
					<span>Daily Energy</span>
					<span className={styles.screen__pool__liquidity}>Liquidity</span>
				</div>

				<ProgressBar
					progress={liquidity}
					color='green'
				/>
			</div>

			<div className={styles.screen__pool__button}>
				<span>Liquidity pools available: {liquidityPools}</span>

				<button onClick={handleRequestLiquidityPool}>
					Request Liquidity Pool
				</button>
			</div>
		</div>
	);
};
