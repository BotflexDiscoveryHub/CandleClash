import {
  Controller,
  Post,
  Body,
  Param,
  UnauthorizedException,
  UseGuards,
  HttpCode,
  Get,
  Query,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ConfigService } from '@nestjs/config';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

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

  @ApiSecurity('initData')
  @UseGuards(AuthGuard)
  @Get('/share/:telegramId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a user by Telegram ID' })
  @ApiParam({ name: 'telegramId', description: 'The Telegram ID of the user' })
  @ApiQuery({
    name: 'inviteLink',
    description: 'Telegram Invite link',
    example: 'https://t.me/test_game_trade_bot?start=ref_xxxxxxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Send user invite link',
  })
  setGameSession(
    @Param('telegramId') paramTelegramId: string,
    @Query('inviteLink') inviteLink: string,
  ) {
    return this.telegramService.sendShareRefLinkButton(
      paramTelegramId,
      inviteLink,
    );
  }
}
