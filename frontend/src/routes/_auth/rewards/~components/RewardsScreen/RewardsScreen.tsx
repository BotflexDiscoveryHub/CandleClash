import { useSuspenseQuery } from '@tanstack/react-query';

import { rewardsQueryOptions, userQueryOptions } from '../../../../../utils/queryOptions.tsx';
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
import { cn } from '../../../../../lib/utils.ts';

import styles from './RewardsScreen.module.scss';
import gift from '../../../../../assets/gift.png';

export function RewardsScreen() {
	const { data: user } = useSuspenseQuery(userQueryOptions());
	const { data: rewards } = useSuspenseQuery(rewardsQueryOptions());

	console.log(rewards, user)

	return (
		<div className={styles.rewards}>
			<div className={styles.rewards__main}>
				<div className={styles.rewards__images}>
					<img src={gift} alt="gift-1" className={cn(styles.rewards__gift, styles.one)} />
					<img src={gift} alt="gift-2" className={cn(styles.rewards__gift, styles.two)} />
					<img src={gift} alt="gift-3" className={cn(styles.rewards__gift, styles.three)} />
				</div>
				<div className={styles.rewards__title}>Your airdrop!</div>
				<div className={styles.rewards__description}>Claim your tokens!</div>
			</div>

			<div className={styles.rewards__achievements}>
				<div className={styles.rewards__achievements__title}>Achievements</div>

				{!!rewards?.length && rewards.map((item) => (
					<div className={styles.rewards__achievements__item} key={item.rewardId}>
						<div className={styles.rewards__achievements__item__info}>
							<div className={styles.rewards__achievements__item__name}>{item.title}</div>
							<div className={styles.rewards__achievements__item__left}>{item.current}/{item.required}</div>
						</div>

						<ProgressBar progress={(item.current / item.required) * 100} />
					</div>
				))}
			</div>
		</div>
	);
}
