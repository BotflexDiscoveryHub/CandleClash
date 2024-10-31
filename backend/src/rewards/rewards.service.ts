import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { UserEntity } from '../db/user.entity';
import { RewardsRepositoryInterface } from '../db/repositories/rewards/rewards.repository.interface';
import { RewardType } from './dto/reward-progress.dto';
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
  async checkDailyRewards(telegramId: string): Promise<string> {
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

    let rewardMessage = 'Сегодняшний вход учтён, но наград пока нет.';

    for (const reward of availableRewards) {
      // Извлекаем требуемое количество дней из `rewardId`, например, 'login_3_days' => 3
      const requiredDays = reward.condition;

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

        rewardMessage = `Награда: ${reward.title}!`;

        break;
      }
    }

    await this.appService.updateUser(telegramId, user);
    return rewardMessage;
  }

  // 2 Механика «За достижение очков»
  async checkPointsReward(telegramId: string): Promise<string> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { pointsBalance, rewards } = user;
    const availableRewards = await this.getRewardsByType(RewardType.POINTS);

    let rewardMessage = 'Нет новых наград. Продолжайте играть!';

    for (const reward of availableRewards) {
      if (
        pointsBalance >= reward.condition &&
        !rewards.includes(reward.rewardId)
      ) {
        // Добавляем награду в список наград пользователя
        user.rewards.push(reward.rewardId);
        await this.giveLootbox(user, reward.lootboxPoints);
        rewardMessage = `Поздравляем! ${reward.title}`;

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }

        break; // Останавливаем цикл на первой подходящей награде
      }
    }

    // Сохраняем изменения в базе данных
    await this.appService.updateUser(telegramId, user);

    return rewardMessage;
  }

  // 3 Механика «За игровые достижения»
  async checkAchievementReward(telegramId: string): Promise<string> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { collectedItems, rewards } = user;

    // Загружаем все награды за сбор предметов
    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: 'ITEMS' },
    });

    let rewardMessage = 'Новых наград пока нет. Продолжайте собирать предметы!';

    for (const reward of availableRewards) {
      // Извлекаем требуемое количество предметов из `condition`, например, '1000 очков' => 1000
      const requiredItems = reward.condition;

      if (
        collectedItems >= requiredItems &&
        !rewards.includes(reward.rewardId)
      ) {
        user.rewards.push(reward.rewardId);
        user.liquidityPools += reward.liquidityPools || 0;
        if (reward.lootboxPoints) {
          await this.giveLootbox(user, reward.lootboxPoints);
        }
        rewardMessage = `Поздравляем! ${reward.title}`;

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }

        break; // Останавливаем цикл на первой подходящей награде
      }
    }

    await this.appService.updateUser(telegramId, user);
    return rewardMessage;
  }

  // 4 Механика «За повышение уровня»
  async checkLevelUpReward(telegramId: string): Promise<string> {
    const user = await this.appService.findByTelegramId(telegramId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { level, rewards } = user;
    const availableRewards = await this.rewardsRepository.findAll({
      where: { type: 'LEVEL' },
      order: { condition: 'ASC' },
    });

    let rewardMessage =
      'Нет новых наград за уровень. Продолжайте повышать уровень!';
    for (const reward of availableRewards) {
      if (level >= reward.condition && !rewards.includes(reward.rewardId)) {
        user.rewards.push(reward.rewardId);
        user.liquidityPools += reward.liquidityPools;
        user.liquidity += reward.liquidity;
        rewardMessage = `Поздравляем! ${reward.title}`;

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
    return rewardMessage;
  }

  // 5 Механика «За временную активность»
  async checkPlayTimeReward(telegramId: string): Promise<string[]> {
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

    const completedRewards: string[] = [];

    for (const reward of availableRewards) {
      if (
        totalGameTime >= reward.condition &&
        !user.completedChallenges.includes(reward.rewardId)
      ) {
        user.completedChallenges.push(reward.rewardId);
        if (reward.lootboxPoints) {
          await this.giveLootbox(user, reward.lootboxPoints);
        }
        completedRewards.push(`Награда: ${reward.title}`);

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }
      }
    }

    await this.appService.updateUser(telegramId, user);
    return completedRewards.length > 0
      ? completedRewards
      : ['Нет новых наград за игровое время.'];
  }

  // 6 Механика «За выполнение челленджей»
  async checkChallengeCompletion(telegramId: string): Promise<string[]> {
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

    const completedRewards: string[] = [];

    for (const reward of availableRewards) {
      if (
        reward.rewardId === 'level_5_in_10_days' &&
        user.level >= 5 &&
        accountAge <= 10 * 86400000 &&
        !user.completedChallenges.includes(reward.rewardId)
      ) {
        user.completedChallenges.push(reward.rewardId);
        if (reward.lootboxPoints) {
          await this.giveLootbox(user, reward.lootboxPoints);
        }
        completedRewards.push(`Награда: ${reward.title}`);

        // Проверяем наличие буста
        if (reward.boost) {
          await this.setBoostForUser(user, reward);
        }
      }
    }

    await this.appService.updateUser(telegramId, user);
    return completedRewards.length > 0
      ? completedRewards
      : ['Нет новых наград за челленджи.'];
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
