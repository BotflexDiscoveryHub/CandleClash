import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class BoostUserDto {
  @ApiProperty({
    description: 'Type of boost',
    example: 'Attack',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Whether the boost is a percentage',
    example: true,
  })
  @IsBoolean()
  isPercentage: boolean;

  @ApiProperty({
    description: 'Multiplier for the boost',
    example: 0.2,
  })
  @IsNumber()
  multiplier: number;

  @ApiProperty({
    description: 'Duration of the boost in seconds',
    example: 3600,
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'Description of the boost',
    example: 'Increases attack by 20%',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Expiration date of the boost (optional)',
    example: '2023-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsString() // Alternatively, use @IsDateString() for date validation
  expirationDate?: string;
}
