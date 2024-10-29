// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { GameSessionRepository } from './db/repositories/gameSession/game-sessions.repository';

@Module({
  providers: [
    {
      provide: 'GameSessionRepositoryInterface',
      useClass: GameSessionRepository,
    },
  ],
  exports: ['GameSessionRepositoryInterface'],
})
export class GameSessionModule {}
