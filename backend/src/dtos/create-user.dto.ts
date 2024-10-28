import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The ID of the user on Telegram',
    type: String,
    required: true,
  })
  @IsString()
  telegramId: string;

  @ApiProperty({
    description: 'The first name of the user',
    type: String,
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'The username of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The language code of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  languageCode?: string;

  @ApiProperty({
    description: 'The user telegramId who referred this user',
    type: Number,
  })
  referrer?: string;
}
