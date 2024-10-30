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
}
