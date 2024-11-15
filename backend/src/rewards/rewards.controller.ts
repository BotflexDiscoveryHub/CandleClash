import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RewardsService as RewardsServiceType } from './rewards.service';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { SetRewardDto } from './dto/set-reward.dto';

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

  // @ApiSecurity('initData')
  // @UseGuards(AuthGuard)
  @Post('set-reward/:telegramId')
  @HttpCode(201)
  @ApiOperation({ summary: 'Set Reward for user' })
  // @ApiHeader({
  //   name: 'x-init-data',
  //   description: 'Init data from Telegram',
  //   required: true,
  // })
  @ApiParam({ name: 'telegramId', description: 'The Telegram ID of the user' })
  @ApiBody({
    description: 'Session data',
    type: SetRewardDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Achievement successfully activated',
  })
  async setReward(
    @Param('telegramId') telegramId: string,
    @Body() rewardDto: SetRewardDto,
  ): Promise<void> {
    const { rewardId, rewardType } = rewardDto;

    return this.rewardsService.setRewardForUser(
      telegramId,
      rewardId,
      rewardType,
    );
  }
}
