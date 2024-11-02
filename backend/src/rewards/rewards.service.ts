import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserEntity } from '../db/user.entity';
import { RewardsRepositoryInterface } from '../db/repositories/rewards/rewards.repository.interface';
import { RewardProgressDto, RewardType } from './dto/reward-progress.dto';
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
  async checkDailyRewards(telegramId: string): Promise<RewardProgressDto[]> {
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

    const rewardsProgress = [];

    for (const reward of availableRewards) {
      const requiredDays = reward.condition;

      const currentProgress = Math.min(consecutiveDays, requiredDays);
      rewardsProgress.push({
        rewardId: reward.rewardId,
        title: reward.title,
        current: currentProgress,
        required: requiredDays,
      });

      if (
        consecutiveDays >= requiredDays &&
        !user.rewards.includes(reward.rewardId)
      ) {
        user.rewards.push(reward.rewardId);
        user.liquidityPools += reward.liquidityPools || 0;

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }

        break;
      }
    }

    await this.appService.updateUser(telegramId, user);

    return this.setAndFilteredRewardsUser(
      user.rewardsProgress,
      rewardsProgress,
    );
  }

  // 2 Механика «За достижение очков»
  async checkPointsReward(telegramId: string): Promise<RewardProgressDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { pointsBalance, rewards } = user;
    const availableRewards = await this.getRewardsByType(RewardType.POINTS);

    const rewardsProgress = [];

    for (const reward of availableRewards) {
      const requiredPoints = reward.condition;
      const currentProgress = Math.min(user.pointsBalance, requiredPoints);
      rewardsProgress.push({
        rewardId: reward.rewardId,
        title: reward.title,
        current: currentProgress,
        required: requiredPoints,
      });

      if (
        pointsBalance >= requiredPoints &&
        !rewards.includes(reward.rewardId)
      ) {
        // Добавляем награду в список наград пользователя
        user.rewards.push(reward.rewardId);
        await this.giveLootbox(user, reward.lootboxPoints);

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }

        break; // Останавливаем цикл на первой подходящей награде
      }
    }

    // Сохраняем изменения в базе данных
    await this.appService.updateUser(telegramId, user);

    return this.setAndFilteredRewardsUser(
      user.rewardsProgress,
      rewardsProgress,
    );
  }

  // 3 Механика «За игровые достижения»
  async checkAchievementReward(
    telegramId: string,
  ): Promise<RewardProgressDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { collectedItems, rewards } = user;

    // Загружаем все награды за сбор предметов
    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: 'ITEMS' },
    });

    const rewardsProgress = [];

    for (const reward of availableRewards) {
      const requiredItems = reward.condition;
      const currentProgress = Math.min(user.collectedItems, requiredItems);
      rewardsProgress.push({
        rewardId: reward.rewardId,
        title: reward.title,
        current: currentProgress,
        required: requiredItems,
      });

      if (
        collectedItems >= requiredItems &&
        !rewards.includes(reward.rewardId)
      ) {
        user.rewards.push(reward.rewardId);
        user.liquidityPools += reward.liquidityPools || 0;
        if (reward.lootboxPoints) {
          await this.giveLootbox(user, reward.lootboxPoints);
        }

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }

        break; // Останавливаем цикл на первой подходящей награде
      }
    }

    await this.appService.updateUser(telegramId, user);

    return this.setAndFilteredRewardsUser(
      user.rewardsProgress,
      rewardsProgress,
    );
  }

  // 4 Механика «За повышение уровня»
  async checkLevelUpReward(telegramId: string): Promise<RewardProgressDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { level, rewards } = user;
    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: 'LEVEL' },
      order: { condition: 'ASC' },
    });

    const rewardsProgress = [];

    for (const reward of availableRewards) {
      const requiredLevel = reward.condition;
      const currentProgress = Math.min(user.level, requiredLevel);
      rewardsProgress.push({
        rewardId: reward.rewardId,
        title: reward.title,
        current: currentProgress,
        required: requiredLevel,
      });

      if (level >= requiredLevel && !rewards.includes(reward.rewardId)) {
        user.rewards.push(reward.rewardId);
        user.liquidityPools += reward.liquidityPools;

        if (reward.lootboxPoints) {
          await this.giveLootbox(user, reward.lootboxPoints);
        }

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }

        break; // Останавливаем цикл на первой подходящей награде
      }
    }

    await this.appService.updateUser(telegramId, user);

    return this.setAndFilteredRewardsUser(
      user.rewardsProgress,
      rewardsProgress,
    );
  }

  // 5 Механика «За временную активность»
  async checkPlayTimeReward(telegramId: string): Promise<RewardProgressDto[]> {
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
      where: { type: 'TIME' },
      order: { condition: 'ASC' },
    });

    const rewardsProgress = [];

    for (const reward of availableRewards) {
      const requiredTime = reward.condition;
      const currentProgress = Math.min(totalGameTime, requiredTime);
      rewardsProgress.push({
        rewardId: reward.rewardId,
        title: reward.title,
        current: Math.floor(currentProgress / 3600),
        required: Math.floor(requiredTime / 3600),
      });
      if (
        totalGameTime >= reward.condition &&
        !user.rewards.includes(reward.rewardId)
      ) {
        user.rewards.push(reward.rewardId);
        if (reward.lootboxPoints) {
          await this.giveLootbox(user, reward.lootboxPoints);
        }

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }
      }
    }

    await this.appService.updateUser(telegramId, user);

    return this.setAndFilteredRewardsUser(
      user.rewardsProgress,
      rewardsProgress,
    );
  }

  // 6 Механика «За выполнение челленджей»
  async checkChallengeCompletion(
    telegramId: string,
  ): Promise<RewardProgressDto[]> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const now = new Date().getTime();
    const accountAge = now - new Date(user.createdAt).getTime();

    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: 'CHALLENGE' },
      order: { condition: 'ASC' },
    });

    const rewardsProgress = [];

    for (const reward of availableRewards) {
      const currentLevel = Math.min(user.level, 5);
      const currentDays = Math.floor(accountAge / 86400000);
      rewardsProgress.push({
        rewardId: reward.rewardId,
        title: reward.title,
        current: currentLevel,
        required: 5, // Требуемый уровень для достижения
        additionalInfo: `${currentDays}/10 дней`,
      });

      if (
        reward.rewardId === 'level_5_in_10_days' &&
        user.level >= 5 &&
        accountAge <= 10 * 86400000 &&
        !user.rewards.includes(reward.rewardId)
      ) {
        user.rewards.push(reward.rewardId);
        if (reward.lootboxPoints) {
          await this.giveLootbox(user, reward.lootboxPoints);
        }

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }
      }
    }

    await this.appService.updateUser(telegramId, user);

    return this.setAndFilteredRewardsUser(
      user.rewardsProgress,
      rewardsProgress,
    );
  }

  // Получить все награды
  async getAllRewardsProgress(
    telegramId: string,
  ): Promise<RewardProgressDto[]> {
    const results = await Promise.all([
      this.checkDailyRewards(telegramId),
      this.checkPointsReward(telegramId),
      this.checkAchievementReward(telegramId),
      this.checkLevelUpReward(telegramId),
      this.checkPlayTimeReward(telegramId),
      this.checkChallengeCompletion(telegramId),
    ]);

    // Объединяем все массивы в один
    const combinedResults = results.flat();

    const user = await this.appService.findByTelegramId(telegramId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Разделяем награды на выполненные и невыполненные
    const completedRewards = combinedResults.filter(
      (reward) => reward.current >= reward.required,
    );
    const incompleteRewards = combinedResults.filter(
      (reward) => reward.current < reward.required,
    );

    // // Сортируем невыполненные награды по уровню прогресса (от меньшего к большему)
    // incompleteRewards.sort(
    //   (a, b) => a.current / a.required - b.current / b.required,
    // );

    // Объединяем невыполненные награды (отсортированные) и выполненные награды
    const sortedRewards = this.setAndFilteredRewardsUser(
      incompleteRewards,
      completedRewards,
    );

    // Сохраняем результат в поле пользователя (если требуется)
    user.rewardsProgress = sortedRewards;

    return sortedRewards;
  }

  private setAndFilteredRewardsUser(
    oldRewards: RewardProgressDto[],
    newRewards?: RewardProgressDto[],
  ): RewardProgressDto[] {
    const allRewards = Object.assign(oldRewards, newRewards);

    return Array.from(
      new Map(allRewards.map((item) => [item.rewardId, item])).values(),
    );
  }

  // Метод для подсчёта последовательных дней посещения
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

  // Метод для добавления лутбокса с очками
  private async giveLootbox(user: UserEntity, points: number): Promise<void> {
    user.pointsBalance += points;
  }

  // Засетить бусты юзеру
  private async setBoostForUser(
    user: UserEntity,
    reward: RewardsEntity,
  ): Promise<void> {
    if (!user || !reward) return;

    const { boostExpiration } = user;
    const { type, multiplier, isPercentage, duration } = reward.boost;
    const now = new Date();

    // Проверяем, есть ли у пользователя активный буст и истек ли он
    if (!boostExpiration || boostExpiration < now) {
      user.activeBoost = type;
      user.boostMultiplier = multiplier;
      user.isBoostPercentage = isPercentage;
      user.boostExpiration = new Date(
        now.getTime() + duration * 60 * 1000, // Устанавливаем продолжительность буста в минутах
      );
    }
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
