import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../db/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async giveReward(telegramId: string, reward: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ telegramId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Добавляем подарок в список наград
    user.rewards.push(reward);
    await this.userRepository.save(user);

    return user;
  }

  async getUserRewards(telegramId: string): Promise<string[]> {
    const user = await this.userRepository.findOneBy({ telegramId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.rewards;
  }
}
