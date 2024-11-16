import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../../utils/queryOptions.tsx';
import { UserIcon } from '../../../../../components/UserIcon/UserIcon.tsx';
import { calculateLevel } from '../../../../../utils/levels.ts';
import { cn } from '../../../../../lib/utils.ts';
import { CoinIcon } from '../../../../../components/CoinIcon/CoinIcon.tsx';
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
import styles from './StateScreen.module.scss'
import bot from '../../../../../assets/bot-large.png'

export const StateScreen = () => {
	const { data: user } = useSuspenseQuery(userQueryOptions());
	const { pointsBalance, liquidity, dailyLiquidityPools, giftLiquidityPools, inviteLink } = user || {}
	const totalPoints = pointsBalance;
	const { level, remainingXP, nextLevelXP, progressPercent } = calculateLevel(totalPoints)!;
	const liquidityPools = dailyLiquidityPools + giftLiquidityPools

	const { format } = new Intl.NumberFormat('ru-RU', {
		style: 'decimal',
		useGrouping: true
	});

	const handleShowRequestUrl = async () => {
		if (navigator.share && inviteLink) {
			await navigator.clipboard.writeText(inviteLink)

			navigator.share({
				url: inviteLink,
			}).then(() => {
				console.log('Успешно поделились');
			}).catch((error) => {
				console.log('Ошибка при попытке поделиться:', error);
			});
		} else {
			console.log('Функция share не поддерживается этим браузером');
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

					{format(totalPoints) || 0}
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

				<button onClick={handleShowRequestUrl}>
					Request Liquidity Pool
				</button>
			</div>
		</div>
	);
};
