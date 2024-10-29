import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../db/user.entity';
import { GameSessionEntity } from '../db/game-session.entry';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GameSessionEntity])],
  providers: [RewardService],
  controllers: [RewardController],
})
export class RewardModule {}
