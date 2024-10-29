import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GameSessionDto {
  @ApiProperty({
    description: 'Date Start Session',
    type: Date,
  })
  @IsString()
  startedAt: Date;
}
