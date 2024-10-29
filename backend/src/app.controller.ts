import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { UserDto } from './dtos/user.dto';
import { parseTelegramInitData } from './utils/telegram-init-data';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GameSessionDto } from './dtos/game-session.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiSecurity('initData')
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiHeader({
    name: 'x-init-data',
    description: 'Init data from Telegram',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'User creation successful',
    type: UserDto,
  })
  create(@Req() req: Request) {
    const initData = req.headers['x-init-data'];
    const { user } = parseTelegramInitData(initData);
    const data = Object.fromEntries(
      Object.entries({
        telegramId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        languageCode: user.language_code,
        allowsWriteToPm: user.allows_write_to_pm,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).filter(([key, value]) => value !== undefined),
    );
    return this.appService.createUser(data as CreateUserDto);
  }

  @ApiSecurity('initData')
  @UseGuards(AuthGuard)
  @Get('/:telegramId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a user by Telegram ID' })
  @ApiParam({
    name: 'telegramId',
    description: 'Telegram ID of the user',
    example: 123456,
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieval successful',
    type: UserDto,
  })
  findOne(@Param('telegramId') paramTelegramId: string) {
    return this.appService.findByTelegramIdWithSideEffects(paramTelegramId);
  }

  @Patch(':telegramId')
  @ApiSecurity('initData')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user by Telegram ID' })
  @ApiParam({ name: 'telegramId', description: 'The Telegram ID of the user' })
  @ApiBody({
    description: 'User data',
    type: UpdateUserDto,
  })
  @ApiResponse({
    type: UserDto,
    description: 'The user updated',
  })
  async updateUser(
    @Param('telegramId') paramTelegramId: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserDto> {
    return this.appService.updateUser(paramTelegramId, user);
  }

  @ApiSecurity('initData')
  @UseGuards(AuthGuard)
  @Post('/game-session/:telegramId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a user by Telegram ID' })
  @ApiParam({ name: 'telegramId', description: 'The Telegram ID of the user' })
  @ApiBody({
    description: 'Session data',
    type: GameSessionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Set User game session',
  })
  setGameSession(
    @Param('telegramId') paramTelegramId: string,
    @Body() data: GameSessionDto,
  ) {
    return this.appService.startGameSession(paramTelegramId, data.startedAt);
  }
}
