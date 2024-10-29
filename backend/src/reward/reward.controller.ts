import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RewardService } from './reward.service';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post(':telegramId')
  async giveReward(
    @Param('telegramId') telegramId: string,
    @Body('reward') reward: string,
  ) {
    return this.rewardService.giveReward(telegramId, reward);
  }

  @Get(':telegramId')
  async getUserRewards(@Param('telegramId') telegramId: string) {
    return this.rewardService.getUserRewards(telegramId);
  }
}
