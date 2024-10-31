import { Controller, Get, Param } from '@nestjs/common';
import { RewardsService as RewardsServiceType } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly RewardsService: RewardsServiceType) {}

  // @Post(':telegramId')
  // async checkDailyReward(
  //   @Param('telegramId') telegramId: string,
  //   @Body('reward') reward: string,
  // ) {
  //   return this.RewardsService.giveReward(telegramId, reward);
  // }

  @Get('check-daily/:telegramId')
  async checkDailyReward(@Param('telegramId') telegramId: string) {
    return this.RewardsService.checkDailyRewards(telegramId);
  }

  @Get('check-points/:telegramId')
  async checkPointsReward(@Param('telegramId') telegramId: string) {
    return this.RewardsService.checkPointsReward(telegramId);
  }

  @Get('check-achievement/:telegramId')
  async checkAchievementReward(@Param('telegramId') telegramId: string) {
    return this.RewardsService.checkAchievementReward(telegramId);
  }

  @Get('check-level/:telegramId')
  async checkLevelUpReward(@Param('telegramId') telegramId: string) {
    return this.RewardsService.checkLevelUpReward(telegramId);
  }

  @Get('check-play-time/:telegramId')
  async checkPlayTimeReward(@Param('telegramId') telegramId: string) {
    return this.RewardsService.checkPlayTimeReward(telegramId);
  }

  @Get('check-challenge/:telegramId')
  async checkChallengeCompletion(@Param('telegramId') telegramId: string) {
    return this.RewardsService.checkChallengeCompletion(telegramId);
  }
}
