import { IsNumber, IsString, Max, Min } from 'class-validator';
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
    type: Number,
  })
  @IsNumber()
  lastRequestAt: number;

  @ApiProperty({
    description: 'The liquidity of the user',
    type: Number,
  })
  @IsNumber()
  liquidity: number;

  @ApiProperty({
    description: 'The liquidity pools of the user',
    type: Number,
  })
  @IsNumber()
  @Max(10)
  @Min(3)
  liquidityPools: number;

  @ApiProperty({
    description: 'The users friends count',
    type: Number,
  })
  @IsNumber()
  friendsCount: number;
}
