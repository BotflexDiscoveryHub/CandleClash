import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The ID of the user in DB',
    type: String,
  })
  @IsString()
  id: number;

  @ApiProperty({ description: 'The ID of the user on Telegram', type: String })
  @IsString()
  telegramId: string;

  @ApiProperty({ description: 'The username of the user', type: String })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'The first name of the user', type: String })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', type: String })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'The language code of the user', type: String })
  @IsString()
  @IsOptional()
  languageCode?: string;

  @ApiProperty({
    description: 'The invite link for the user',
    type: String,
  })
  @IsString()
  inviteLink?: string;

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
  liquidityPools: number;
}
