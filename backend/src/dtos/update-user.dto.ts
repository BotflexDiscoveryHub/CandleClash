import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'The ID of the user on Telegram', type: String })
  @IsString()
  telegramId: string;

  @ApiProperty({
    description: 'The balance of points the user has',
    type: Number,
  })
  @IsNumber()
  pointsBalance: number;

  @ApiProperty({
    description: 'The user telegramId who referred this user',
    type: Number,
  })
  referrer: string;

  @ApiProperty({
    description: 'The timestamp of the user last request',
    type: Date,
  })
  @IsNumber()
  lastRequestAt: Date;

  @ApiProperty({
    description: 'The liquidity of the user',
    type: Number,
  })
  @IsNumber()
  liquidity: number;

  @ApiProperty({
    description: 'The daily liquidity pools of the user',
    type: Number,
  })
  @IsNumber()
  dailyLiquidityPools: number;

  @ApiProperty({
    description: 'The gift liquidity pools of the user',
    type: Number,
  })
  @IsNumber()
  giftLiquidityPools: number;

  @ApiProperty({
    description: 'The users friends count',
    type: Number,
  })
  @IsNumber()
  friendsCount: number;
}
