import { useSuspenseQuery } from '@tanstack/react-query';

import { rewardsQueryOptions } from '../../../../../utils/queryOptions.tsx';
import { cn } from '../../../../../lib/utils.ts';

import styles from './RewardsScreen.module.scss';
import gift from '../../../../../assets/gift.png';
import { RewardsItem } from '../RewardsItem/RewardsItem.tsx';

export function RewardsScreen() {
	const { data: rewards, refetch } = useSuspenseQuery(rewardsQueryOptions());

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

				{!!rewards?.length && rewards.map((item, index) => (
					<RewardsItem {...item} refetch={refetch} index={index} />
				))}
			</div>
		</div>
	);
}
