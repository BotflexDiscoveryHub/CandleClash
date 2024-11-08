import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GameSessionDto {
  @ApiProperty({
    description: 'Date Start Session',
    type: Date,
  })
  @IsString()
  startedAt: Date;

  @ApiProperty({
    description: 'The liquidity of the user',
    type: Number,
    default: 95,
  })
  @IsNumber()
  finalLiquidity: number;
}
