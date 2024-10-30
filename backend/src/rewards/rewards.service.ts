import { Injectable, BadRequestException, Inject } from '@nestjs/common';
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
    const visitDates = new Set(user.datesOfVisits); // Уникальные даты визитов

    // Проверка, посещал ли пользователь сегодня
    if (visitDates.has(today)) {
      return 'Вы уже получили награду за сегодня!';
    }

    // Добавляем сегодняшнюю дату в список визитов
    visitDates.add(today);
    user.datesOfVisits = Array.from(visitDates);

    let rewardMessage = 'Сегодняшний вход учтён, но наград пока нет.';

    // Логика награждения за регулярные входы
    const streak = visitDates.size;
    if (streak === 3) {
      user.rewards.push('liquidity_pools_3');
      user.liquidityPools += 3;
      rewardMessage = 'Награда: 3 пула ликвидности за 3 дня подряд!';
    } else if (streak === 7) {
      user.rewards.push('liquidity_pools_7');
      user.liquidity += 20; // Увеличение ликвидности на 20%
      rewardMessage = 'Награда: +20% к ликвидности за 7 дней подряд!';
    } else if (streak === 14) {
      user.rewards.push('liquidity_pools_14');
      user.liquidityPools += 5;
      rewardMessage = 'Награда: 5 пулов ликвидности за 14 дней подряд!';
    } else if (streak === 30) {
      user.rewards.push('liquidity_pools_30');
      user.liquidity += 60;
      rewardMessage = 'Награда: +60% к ликвидности за 30 дней подряд!';
    }

    // Сохраняем изменения в базе данных
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
    let rewardMessage = 'Нет новых наград. Продолжайте играть!';

    // Логика награждения за определенные рубежи очков
    if (pointsBalance >= 200 && !rewards.includes('points_200')) {
      user.rewards.push('points_200');
      await this.giveLootbox(user, 50);
      rewardMessage =
        'Поздравляем! Вы получили лутбокс с 50 очками за достижение 200 очков!';
    } else if (pointsBalance >= 1000 && !rewards.includes('points_1000')) {
      user.rewards.push('points_1000');
      await this.giveLootbox(user, 150);
      rewardMessage = 'Отлично! Лутбокс с 150 очками за достижение 1000 очков!';
    } else if (pointsBalance >= 2000 && !rewards.includes('points_2000')) {
      user.rewards.push('points_2000');
      await this.giveLootbox(user, 200);
      rewardMessage = 'Круто! Лутбокс с 200 очками за достижение 2000 очков!';
    } else if (pointsBalance >= 3000 && !rewards.includes('points_3000')) {
      user.rewards.push('points_3000');
      await this.giveLootbox(user, 300);
      rewardMessage =
        'Прекрасно! Лутбокс с 300 очками за достижение 3000 очков!';
    } else if (pointsBalance >= 5000 && !rewards.includes('points_5000')) {
      user.rewards.push('points_5000');
      await this.giveLootbox(user, 500);
      rewardMessage =
        'Фантастика! Лутбокс с 500 очками за достижение 5000 очков!';
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
    let rewardMessage = 'Новых наград пока нет. Продолжайте собирать предметы!';

    // Логика награждения за собранные предметы
    if (collectedItems >= 100 && !rewards.includes('items_100')) {
      user.rewards.push('items_100');
      user.liquidityPools += 3;
      rewardMessage = 'Вы собрали 100 предметов! Награда: +3 пула ликвидности!';
    } else if (collectedItems >= 200 && !rewards.includes('items_200')) {
      user.rewards.push('items_200');
      user.liquidityPools += 3;
      rewardMessage =
        'Отлично! Вы собрали 200 предметов и получили 3 пула ликвидности!';
    } else if (collectedItems >= 500 && !rewards.includes('items_500')) {
      user.rewards.push('items_500');
      await this.giveLootbox(user, 250);
      rewardMessage = 'Фантастика! Лутбокс с 250 очками за 500 предметов!';
    } else if (collectedItems >= 1000 && !rewards.includes('items_1000')) {
      user.rewards.push('items_1000');
      user.liquidityPools += 10;
      rewardMessage =
        'Вы собрали 1000 предметов! Получите 10 пулов ликвидности!';
    } else if (collectedItems >= 2000 && !rewards.includes('items_2000')) {
      user.rewards.push('items_2000');
      user.liquidityPools += 10;
      rewardMessage =
        'Фантастический результат! Ещё 10 пулов ликвидности за 2000 предметов!';
    }

    // Сохраняем изменения в базе данных
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
    let rewardMessage =
      'Нет новых наград за уровень. Продолжайте повышать уровень!';

    // Логика награждения за уровни
    if (level >= 5 && !rewards.includes('level_5')) {
      user.rewards.push('level_5');
      await this.giveLootbox(user, 50); // Лутбокс на 50 очков
      rewardMessage =
        'Поздравляем! Лутбокс на 50 очков за достижение 5 уровня!';
    } else if (level >= 8 && !rewards.includes('level_8')) {
      user.rewards.push('level_8');
      user.liquidityPools += 5;
      rewardMessage = 'Отлично! 5 пулов ликвидности за достижение 8 уровня!';
    } else if (level >= 10 && !rewards.includes('level_10')) {
      user.rewards.push('level_10');
      await this.giveLootbox(user, 100);
      rewardMessage =
        'Прекрасно! Лутбокс на 100 очков за достижение 10 уровня!';
    } else if (level >= 20 && !rewards.includes('level_20')) {
      user.rewards.push('level_20');
      user.liquidity += 100; // Бонус к ликвидности
      rewardMessage =
        'Фантастика! Эксклюзивный лутбокс с 100% ликвидности за 20 уровень!';
    }

    // Сохраняем изменения в базе данных
    await this.appService.updateUser(telegramId, user);

    return rewardMessage;
  }

  // 5 Механика «За временную активность»
  async checkPlayTimeReward(telegramId: string): Promise<string[]> {
    const user = await this.appService.findByTelegramId(telegramId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const completedRewards: string[] = [];
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

    // Чекпоинты времени активности
    if (
      totalGameTime >= 3600 &&
      !user.completedChallenges.includes('time_1_hour')
    ) {
      user.completedChallenges.push('time_1_hour');
      await this.giveLootbox(user, 50);
      completedRewards.push('Награда: 50 очков за 1 час в игре!');
    }

    if (
      totalGameTime >= 18000 &&
      !user.completedChallenges.includes('time_5_hours')
    ) {
      user.completedChallenges.push('time_5_hours');
      await this.giveLootbox(user, 150);
      completedRewards.push('Награда: 150 очков за 5 часов в игре!');
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
    const completedRewards: string[] = [];

    // Чекпоинт: Достичь 5 уровня за 10 дней
    if (
      user.level >= 5 &&
      !user.completedChallenges.includes('level_5_in_10_days')
    ) {
      const accountAge = now - new Date(user.createdAt).getTime();
      if (accountAge <= 10 * 86400000) {
        user.completedChallenges.push('level_5_in_10_days');
        await this.giveLootbox(user, 100);
        completedRewards.push(
          'Награда: 100 очков за достижение 5 уровня за 10 дней!',
        );
      }
    }

    await this.appService.updateUser(telegramId, user);
    return completedRewards.length > 0
      ? completedRewards
      : ['Нет новых наград за челленджи.'];
  }

  // Метод для добавления лутбокса с очками
  private async giveLootbox(user: UserEntity, points: number): Promise<void> {
    user.pointsBalance += points;
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
