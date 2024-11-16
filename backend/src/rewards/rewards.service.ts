import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserEntity } from '../db/user.entity';
import { RewardsRepositoryInterface } from '../db/repositories/rewards/rewards.repository.interface';
import { RewardType, RewardUserDto } from './dto/reward-progress.dto';
import { RewardsEntity } from '../db/rewards.entity';
import { rewards } from '../db/rewards.mock';

@Injectable()
export class RewardsService {
  constructor(
    @Inject('RewardsRepositoryInterface')
    private readonly rewardsRepository: RewardsRepositoryInterface,

    @Inject(AppService) private appService: AppService,
  ) {}

  // 1 Механика «За регулярную активность»
  async checkDailyRewards(telegramId: string): Promise<RewardUserDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const today = new Date().toISOString().split('T')[0];
    const visitDates = new Set(user.datesOfVisits);

    // Проверяем, был ли пользователь сегодня
    if (!visitDates.has(today)) {
      visitDates.add(today);
      user.datesOfVisits = Array.from(visitDates).sort();
    }

    // Подсчитываем последовательные дни посещения
    const consecutiveDays = this.calculateConsecutiveDays(user.datesOfVisits);

    // Загружаем все награды за регулярные посещения
    const availableRewards = await this.getRewardsByType(RewardType.ACTIVITY);

    const rewardsProgress: RewardUserDto[] = [];

    for (const reward of availableRewards) {
      const requiredDays = reward.condition;

      const currentProgress = Math.min(consecutiveDays, requiredDays);
      rewardsProgress.push({
        ...reward,
        current: currentProgress,
        required: requiredDays,
        isCompleted: consecutiveDays >= requiredDays,
      });
    }

    return rewardsProgress;
  }

  // 2 Механика «За достижение очков»
  async checkPointsReward(telegramId: string): Promise<RewardUserDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { pointsBalance } = user;
    const availableRewards = await this.getRewardsByType(RewardType.POINTS);

    const rewardsProgress: RewardUserDto[] = [];

    for (const reward of availableRewards) {
      const requiredPoints = reward.condition;
      const currentProgress = Math.min(user.pointsBalance, requiredPoints);

      rewardsProgress.push({
        ...reward,
        current: currentProgress,
        required: requiredPoints,
        isCompleted: pointsBalance >= requiredPoints,
      });
    }

    return rewardsProgress;
  }

  // 3 Механика «За игровые достижения»
  async checkAchievementReward(telegramId: string): Promise<RewardUserDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { collectedItems } = user;

    // Загружаем все награды за сбор предметов
    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: RewardType.ITEMS },
    });

    const rewardsProgress: RewardUserDto[] = [];

    for (const reward of availableRewards) {
      const requiredItems = reward.condition;
      const currentProgress = Math.min(collectedItems, requiredItems);
      rewardsProgress.push({
        ...reward,
        current: currentProgress,
        required: requiredItems,
        isCompleted: collectedItems >= requiredItems,
      });
    }

    return rewardsProgress;
  }

  // 4 Механика «За повышение уровня»
  async checkLevelUpReward(telegramId: string): Promise<RewardUserDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { level } = user;
    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: RewardType.LEVEL },
      order: { condition: 'ASC' },
    });

    const rewardsProgress: RewardUserDto[] = [];

    for (const reward of availableRewards) {
      const requiredLevel = reward.condition;
      const currentProgress = Math.min(user.level, requiredLevel);
      rewardsProgress.push({
        ...reward,
        current: currentProgress,
        required: requiredLevel,
        isCompleted: level >= requiredLevel,
      });
    }

    return rewardsProgress;
  }

  // 5 Механика «За временную активность»
  async checkPlayTimeReward(telegramId: string): Promise<RewardUserDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const totalGameTime = user.sessions.reduce((acc, session) => {
      if (session.endedAt) {
        return (
          acc +
          (new Date(session.endedAt).getTime() -
            new Date(session.startedAt).getTime()) /
            1000
        );
      }
      return acc;
    }, 0);

    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: RewardType.TIME },
      order: { condition: 'ASC' },
    });

    const rewardsProgress: RewardUserDto[] = [];

    for (const reward of availableRewards) {
      const requiredTime = reward.condition;
      const currentProgress = Math.min(totalGameTime, requiredTime);
      rewardsProgress.push({
        ...reward,
        current: Math.floor(currentProgress / 3600),
        required: Math.floor(requiredTime / 3600),
        isCompleted: totalGameTime >= reward.condition,
      });
    }

    return rewardsProgress;
  }

  // 6 Механика «За выполнение челленджей»
  async checkChallengeCompletion(telegramId: string): Promise<RewardUserDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const now = new Date().getTime();
    const accountAge = now - new Date(user.createdAt).getTime();

    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: RewardType.CHALLENGE },
      order: { condition: 'ASC' },
    });

    const rewardsProgress: RewardUserDto[] = [];

    for (const reward of availableRewards) {
      const currentLevel = Math.min(user.level, 5);
      const currentDays = Math.floor(accountAge / 86400000);
      const isCompleted =
        reward.rewardId === 'level_5_in_10_days' &&
        user.level >= 5 &&
        accountAge <= 10 * 86400000;

      rewardsProgress.push({
        ...reward,
        current: currentLevel,
        required: 5, // Требуемый уровень для достижения
        additionalInfo: `${currentDays}/10 дней`,
        isCompleted: isCompleted,
      });
    }

    return rewardsProgress;
  }

  // Получить все награды
  async getAllRewardsProgress(telegramId: string): Promise<RewardUserDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const results = await Promise.all([
      this.checkDailyRewards(telegramId),
      this.checkPointsReward(telegramId),
      this.checkAchievementReward(telegramId),
      this.checkLevelUpReward(telegramId),
      this.checkPlayTimeReward(telegramId),
      this.checkChallengeCompletion(telegramId),
    ]);

    const combinedResults = results.flat();

    const newResults = [
      ...user.rewards,
      ...combinedResults.filter(
        (userReward) =>
          !user.rewards.some(
            (result) => result.rewardId === userReward.rewardId,
          ),
      ),
    ];

    this.checkUserBusts(user);

    const completedRewards = newResults.filter(
      (reward) => reward.current >= reward.required,
    );
    const incompleteRewards = newResults.filter(
      (reward) => reward.current < reward.required,
    );

    const sortedRewards = this.setAndFilteredRewardsUser(
      incompleteRewards,
      completedRewards,
    );

    return sortedRewards;
  }

  // Активировать награду
  async setRewardForUser(
    telegramId: string,
    rewardId: string,
    rewardType: RewardType,
  ): Promise<void> {
    const user = await this.appService.findByTelegramId(telegramId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Проверка и удаление истекших бустов
    this.checkUserBusts(user);

    switch (rewardType) {
      case RewardType.ACTIVITY: {
        const data = await this.checkDailyRewards(telegramId);

        const completedRewards = data.filter(
          (reward) => reward.isCompleted && rewardId === reward.rewardId,
        );

        const activeReward = completedRewards[0] || null;

        if (activeReward) {
          this.giveLiquidityPools(user, activeReward.liquidityPools);

          if (activeReward.boost) {
            await this.setBoostForUser(user, activeReward);
          }

          activeReward.isActive = true;
          user.rewards.push(activeReward);

          await this.appService.updateUser(telegramId, user);
        }

        break;
      }
      case RewardType.POINTS: {
        const data = await this.checkPointsReward(telegramId);

        const completedRewards = data.filter(
          (reward) => reward.isCompleted && rewardId === reward.rewardId,
        );

        const activeReward = completedRewards[0] || null;

        console.log(activeReward);

        if (activeReward) {
          this.giveLootbox(user, activeReward.lootboxPoints);

          if (activeReward.boost) {
            this.setBoostForUser(user, activeReward);
          }

          activeReward.isActive = true;
          user.rewards.push(activeReward);

          await this.appService.updateUser(telegramId, user);
        }

        break;
      }
      case RewardType.ITEMS: {
        const data = await this.checkAchievementReward(telegramId);

        const completedRewards = data.filter(
          (reward) => reward.isCompleted && rewardId === reward.rewardId,
        );

        const activeReward = completedRewards[0] || null;

        if (activeReward) {
          this.giveLootbox(user, activeReward.lootboxPoints);
          this.giveLiquidityPools(user, activeReward.liquidityPools);

          if (activeReward.boost) {
            this.setBoostForUser(user, activeReward);
          }

          activeReward.isActive = true;
          user.rewards.push(activeReward);

          await this.appService.updateUser(telegramId, user);
        }

        break;
      }
      case RewardType.LEVEL: {
        const data = await this.checkLevelUpReward(telegramId);

        const completedRewards = data.filter(
          (reward) => reward.isCompleted && rewardId === reward.rewardId,
        );

        const activeReward = completedRewards[0] || null;

        if (activeReward) {
          this.giveLootbox(user, activeReward.lootboxPoints);
          this.giveLiquidityPools(user, activeReward.liquidityPools);

          if (activeReward.boost) {
            this.setBoostForUser(user, activeReward);
          }

          activeReward.isActive = true;
          user.rewards.push(activeReward);

          await this.appService.updateUser(telegramId, user);
        }

        break;
      }
      case RewardType.TIME: {
        const data = await this.checkPlayTimeReward(telegramId);

        const completedRewards = data.filter(
          (reward) => reward.isCompleted && rewardId === reward.rewardId,
        );

        const activeReward = completedRewards[0] || null;

        if (activeReward) {
          this.giveLootbox(user, activeReward.lootboxPoints);
          this.giveLiquidityPools(user, activeReward.liquidityPools);

          if (activeReward.boost) {
            this.setBoostForUser(user, activeReward);
          }

          console.log(activeReward, '1');

          activeReward.isActive = true;
          user.rewards.push(activeReward);

          console.log(user.rewards, '2');

          await this.appService.updateUser(telegramId, user);
        }

        break;
      }
      case RewardType.CHALLENGE: {
        const data = await this.checkChallengeCompletion(telegramId);

        const completedRewards = data.filter(
          (reward) => reward.isCompleted && rewardId === reward.rewardId,
        );

        const activeReward = completedRewards[0] || null;

        if (activeReward) {
          this.giveLootbox(user, activeReward.lootboxPoints);
          this.giveLiquidityPools(user, activeReward.liquidityPools);

          if (activeReward.boost) {
            this.setBoostForUser(user, activeReward);
          }

          activeReward.isActive = true;
          user.rewards.push(activeReward);

          await this.appService.updateUser(telegramId, user);
        }

        break;
      }

      default:
        throw new BadRequestException('User not found');
    }

    return;
  }

  private setAndFilteredRewardsUser(
    oldRewards: RewardUserDto[],
    newRewards?: RewardUserDto[],
  ): RewardUserDto[] {
    const allRewards = Object.assign(oldRewards, newRewards);
    const rewards = Array.from(
      new Map(allRewards.map((item) => [item.rewardId, item])).values(),
    );

    return rewards.sort((a, b) => {
      if (a.isActive === b.isActive) return 0;
      return a.isActive ? 1 : -1;
    });
  }

  private calculateConsecutiveDays(dates: string[]): number {
    dates.sort();
    let consecutiveDays = 1;
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const previousDate = new Date(dates[i - 1]);
      const difference =
        (currentDate.getTime() - previousDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (difference === 1) {
        consecutiveDays += 1;
      } else if (difference > 1) {
        consecutiveDays = 1;
      }
    }
    return consecutiveDays;
  }

  private giveLootbox(user: UserEntity, points: number): void {
    if (!points || typeof points !== 'number') return;
    user.pointsBalance += points;
  }

  private giveLiquidityPools(user: UserEntity, liquidityPools: number): void {
    if (!liquidityPools || typeof liquidityPools !== 'number') return;
    user.giftLiquidityPools += liquidityPools;
  }

  private setBoostForUser(user: UserEntity, reward: RewardsEntity): void {
    if (!user || !reward || !reward.boost) return;

    const { type, multiplier, isPercentage, duration, description } =
      reward.boost;
    const now = new Date();

    // Проверка и удаление истекших бустов
    this.checkUserBusts(user);

    // Добавление нового буста
    user.boosts.push({
      type: type,
      multiplier: multiplier,
      isPercentage: isPercentage,
      description: description,
      duration: duration,
      expirationDate: new Date(now.getTime() + duration * 60 * 1000), // Время истечения буста
    });
  }

  private checkUserBusts(user: UserEntity): void {
    if (!user) return;
    const now = new Date();

    // Проверка и удаление истекших бустов
    user.boosts = user.boosts.filter(
      (boost) => new Date(boost.expirationDate) > now,
    );
  }

  // Получить все награды
  async getAllRewards(): Promise<RewardsEntity[]> {
    return this.rewardsRepository.findAll();
  }

  // Получить награду по типу
  async getRewardsByType(type: RewardType): Promise<RewardsEntity[]> {
    return this.rewardsRepository.findAll({ where: { type } });
  }

  async seed() {
    await this.rewardsRepository.saveMany(rewards);
  }
}
