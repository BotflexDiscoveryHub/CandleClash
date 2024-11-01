import { Controller, Get, Param } from '@nestjs/common';
import { RewardsService as RewardsServiceType } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsServiceType) {}

  @Get('check-daily/:telegramId')
  async checkDailyReward(@Param('telegramId') telegramId: string) {
    return this.rewardsService.checkDailyRewards(telegramId);
  }

  @Get('check-points/:telegramId')
  async checkPointsReward(@Param('telegramId') telegramId: string) {
    return this.rewardsService.checkPointsReward(telegramId);
  }

  @Get('check-achievement/:telegramId')
  async checkAchievementReward(@Param('telegramId') telegramId: string) {
    return this.rewardsService.checkAchievementReward(telegramId);
  }

  @Get('check-level/:telegramId')
  async checkLevelUpReward(@Param('telegramId') telegramId: string) {
    return this.rewardsService.checkLevelUpReward(telegramId);
  }

  @Get('check-play-time/:telegramId')
  async checkPlayTimeReward(@Param('telegramId') telegramId: string) {
    return this.rewardsService.checkPlayTimeReward(telegramId);
  }

  @Get('check-challenge/:telegramId')
  async checkChallengeCompletion(@Param('telegramId') telegramId: string) {
    return this.rewardsService.checkChallengeCompletion(telegramId);
  }

  @Get('check-progress/:telegramId')
  async getAllRewardsProgress(@Param('telegramId') telegramId: string) {
    return this.rewardsService.getAllRewardsProgress(telegramId);
  }
}
