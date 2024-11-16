import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getInviteLink } from './utils/invite-link';
import { calculateLiquidity } from './utils/liquidity';

import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './db/user.entity';
import { UserRepositoryInterface } from './db/repositories/users/users.repository.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { GameSessionRepositoryInterface } from './db/repositories/gameSession/game-sessions.repository.interface';
import { GameSessionDto } from './dtos/game-session.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
    @Inject('GameSessionRepositoryInterface')
    private readonly gameSessionRepository: GameSessionRepositoryInterface,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.findAll();
  }

  async findById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneById(id);
  }

  async findByTelegramId(telegramId: string): Promise<UserEntity> {
    return this.usersRepository.findByCondition({
      where: { telegramId },
    });
  }

  async findByTelegramIdWithSideEffects(telegramId: string): Promise<UserDto> {
    const existingUser = await this.findByTelegramId(telegramId);

    if (!existingUser) {
      throw new NotFoundException();
    }

    const updatedUser = await this.updateUser(telegramId, existingUser);

    return updatedUser;
  }

  async createUser(user: Partial<CreateUserDto>) {
    const existingUser = await this.findByTelegramId(user.telegramId);

    if (existingUser) {
      return existingUser;
    }

    await this.usersRepository.save(user);
  }

  async updateUser(
    telegramId: string,
    user: Partial<UpdateUserDto>,
  ): Promise<UserDto> {
    const existingUser = await this.findByTelegramId(telegramId);

    if (!existingUser) {
      throw new NotFoundException();
    }

    const userUpdate = {
      ...existingUser,
      ...{
        ...user,
        liquidity: user?.liquidity,
        dailyLiquidityPools: user?.dailyLiquidityPools,
        giftLiquidityPools: user?.giftLiquidityPools,
      },
    };

    const liquidityData = calculateLiquidity(userUpdate);

    const updatedUser = Object.assign(userUpdate, liquidityData);

    if (!updatedUser.inviteLink) {
      updatedUser.inviteLink = getInviteLink(
        process.env.BOT_USERNAME,
        user.telegramId,
      );
    }

    await this.usersRepository.save(updatedUser);

    return updatedUser;
  }

  async startGameSession(telegramId: string, data: GameSessionDto) {
    const user = await this.findByTelegramIdWithSideEffects(telegramId);

    if (!user || !data.startedAt) {
      throw new NotFoundException();
    }

    const newSession = this.gameSessionRepository.save({
      ...data,
      user,
      endedAt: new Date(),
    });

    return newSession;
  }
}
