import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './db/user.entity';
import { UserRepositoryInterface } from './db/repositories/users/users.repository.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { calculateLiquidity } from './utils/liquidity';
import {
  getTomorrow,
  scheduleLiquidityPoolsUpdate,
  updateDatesOfVisits,
} from './utils/dates';
import { UserDto } from './dtos/user.dto';
// import { getInviteLink } from './utils/invite-link';
import { GameSessionRepositoryInterface } from './db/repositories/gameSession/game-sessions.repository.interface';
import { getInviteLink } from './utils/invite-link';

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

  async findByTelegramId(
    telegramId: string = '226653004',
  ): Promise<UserEntity> {
    return this.usersRepository.findByCondition({
      where: { telegramId },
    });
  }

  async findByTelegramIdWithSideEffects(
    telegramId: string = '226653004',
  ): Promise<UserDto> {
    const user = await this.findByTelegramId(telegramId);

    user.liquidity = calculateLiquidity(user.liquidity, user.sessions);
    user.lastRequestAt = Math.round(Date.now() / 1000);
    user.datesOfVisits = updateDatesOfVisits(user.datesOfVisits);

    if (
      !user.liquidityPoolsUpdateDate ||
      user.liquidityPoolsUpdateDate != getTomorrow()
    ) {
      user.liquidityPools =
        3 + user.friendsCount > 10 ? 10 : 3 + user.friendsCount;
      user.liquidityPoolsUpdateDate = scheduleLiquidityPoolsUpdate();
    }

    const updatedUser = await this.updateUser(telegramId, user);

    return updatedUser;
  }

  async createUser(user: Partial<CreateUserDto>) {
    const existingUser = await this.findByTelegramId(user.telegramId);

    if (existingUser) {
      return existingUser;
    }

    user['liquidityPoolsUpdateDate'] = scheduleLiquidityPoolsUpdate();

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

    const updatedUser = Object.assign(existingUser, user);

    updatedUser.liquidity = user.liquidity <= 0 ? 0 : user.liquidity;
    updatedUser.pointsBalance =
      user.pointsBalance <= 0 ? 0 : user.pointsBalance;

    if (!updatedUser.inviteLink) {
      updatedUser.inviteLink = getInviteLink(
        process.env.BOT_USERNAME,
        user.telegramId,
      );
    }

    await this.usersRepository.save(updatedUser);

    return updatedUser;
  }

  async startGameSession(telegramId: string, startedAt: Date) {
    const user = await this.findByTelegramId(telegramId);

    if (!user || !startedAt) {
      throw new NotFoundException();
    }

    const newSession = this.gameSessionRepository.save({
      user,
      startedAt,
      endedAt: new Date(),
    });

    return newSession;
  }
}
