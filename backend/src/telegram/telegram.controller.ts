import {
  Controller,
  Post,
  Body,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly configService: ConfigService,
  ) {}

  @ApiExcludeEndpoint(true)
  @Post(':botToken')
  async update(@Body() update, @Param('botToken') botToken: string) {
    const validBotToken = this.configService.get<string>('BOT_TOKEN');
    if (botToken !== validBotToken) {
      throw new UnauthorizedException();
    }
    await this.telegramService.getMyBot().handleUpdate(update);
    return { status: 'success', message: 'Update processed successfully' };
  }
}
