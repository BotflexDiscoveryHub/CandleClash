import { FC, useState } from 'react';
import { cn } from '../../../../../lib/utils.ts';
import { ProgressBar } from '../../../../../components/ProgressBar/ProgressBar.tsx';
import api from '../../../../../api';
import { LoaderIcon } from '../../../../../components/LoaderIcon/LoaderIcon.tsx';
import { RewardProgress } from '../../~types';

import gift from '../../../../../assets/gift.png';
import styles from '../RewardsScreen/RewardsScreen.module.scss';

interface IProps extends RewardProgress {
	index: number;
	refetch: () => Promise<void>;
}

export const RewardsItem: FC<IProps> = ({ index, isCompleted, isActive, rewardId, type, title, current, required, description, refetch }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSetReward = async () => {
		if (isActive) return;

		setIsLoading(true)
		try {
			await api.setReward(rewardId, type);
			await refetch()
		} catch (e) {
			console.error(e)
		}
		setIsLoading(false)
	}

	return (
		<div className={cn(styles.rewards__achievements__item__wrap, {
			[styles.active]: !index && !isActive && isCompleted,
		})}>
			{!index && !isActive && isCompleted && (
				<div className={styles.label}>
					Claim your reward!
				</div>
			)}

			<div
				className={cn(styles.rewards__achievements__item, {
					[styles.active]: isCompleted,
				})}
				key={rewardId}
				onClick={isCompleted ? handleSetReward : () => null}
			>
				{isLoading ? (
					<LoaderIcon />
				) : (
					<>
						<div className={styles.rewards__achievements__item__info}>
							<div className={styles.rewards__achievements__item__name}>{title}</div>
							<div className={styles.rewards__achievements__item__left}>{current}/{required}</div>
						</div>

						{isCompleted ? (
							<>
								<div className={styles.rewards__achievements__item__description}>
									<img src={gift} alt="gift-1" className={styles.rewards__achievements__item__description__img} />
									{description}
								</div>
							</>
						) : (
							<ProgressBar progress={(current / required) * 100} />
						)}
					</>
				)}
			</div>
		</div>
	);
};
