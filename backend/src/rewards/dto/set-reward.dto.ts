import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RewardType } from './reward-progress.dto';

export class SetRewardDto {
  @ApiProperty({
    description: 'Reward id',
    type: String,
  })
  @IsString()
  rewardId: string;

  @ApiProperty({
    description: 'Reward Type',
    type: String,
  })
  @IsString()
  rewardType: RewardType;
}
