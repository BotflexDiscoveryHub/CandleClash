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

@Injectable()
export class AppService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
    @Inject('GameSessionRepositoryInterface')
    private readonly gameSessionRepository: GameSessionRepositoryInterface,
  ) {}

  // Fetch all users from the repository
  async getUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.findAll();
  }

  // Find a user by their ID
  async findById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneById(id);
  }

  // Find a user by their Telegram ID
  async findByTelegramId(
    telegramId: string = '226653004',
  ): Promise<UserEntity> {
    return this.usersRepository.findByCondition({
      where: { telegramId },
    });
  }

  // Find a user by their Telegram ID and apply side effects
  async findByTelegramIdWithSideEffects(
    telegramId: string = '226653004',
  ): Promise<UserDto> {
    const user = await this.findByTelegramId(telegramId);

    // Calculate and update the user's liquidity
    user.liquidity = calculateLiquidity(user.liquidity, user.sessions);

    // Update the last request timestamp
    user.lastRequestAt = Math.round(Date.now() / 1000);

    // Update the dates of visits
    user.datesOfVisits = updateDatesOfVisits(user.datesOfVisits);

    // Update liquidity pools if necessary
    if (
      !user.liquidityPoolsUpdateDate ||
      user.liquidityPoolsUpdateDate != getTomorrow()
    ) {
      user.liquidityPools =
        3 + user.friendsCount > 10 ? 10 : 3 + user.friendsCount;
      user.liquidityPoolsUpdateDate = scheduleLiquidityPoolsUpdate();
    }

    // Update the user in the repository
    const updatedUser = await this.updateUser(telegramId, user);

    return updatedUser;
  }

  // Create a new user
  async createUser(user: Partial<CreateUserDto>) {
    const existingUser = await this.findByTelegramId(user.telegramId);

    // Throw an error if the user already exists
    if (existingUser) {
      return existingUser;
    }

    // Schedule the liquidity pools update date
    user['liquidityPoolsUpdateDate'] = scheduleLiquidityPoolsUpdate();

    // Save the new user to the repository
    await this.usersRepository.save(user);
  }

  // Update an existing user
  async updateUser(
    telegramId: string,
    user: Partial<UpdateUserDto>,
  ): Promise<UserDto> {
    const existingUser = await this.findByTelegramId(telegramId);

    // Throw an error if the user is not found
    if (!existingUser) {
      throw new NotFoundException();
    }

    // Merge the existing user data with the new data
    const updatedUser = Object.assign(existingUser, user);

    // Ensure liquidity and points balance are not negative
    updatedUser.liquidity = user.liquidity <= 0 ? 0 : user.liquidity;
    updatedUser.pointsBalance =
      user.pointsBalance <= 0 ? 0 : user.pointsBalance;

    // Generate an invite link for the user
    // updatedUser.inviteLink = getInviteLink(
    //   process.env.BOT_USERNAME,
    //   user.telegramId,
    // );

    // Save the updated user to the repository
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
