import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { DBModule } from './db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './db/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from './db/repositories/users/users.repository';
import { AppController } from './app.controller';
import { GameSessionEntity } from './db/game-session.entry';
import { GameSessionRepository } from './db/repositories/gameSession/game-sessions.repository';
import { RewardsModule } from './rewards/rewards.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DBModule,
    RewardsModule,
    TelegramModule,
    ExportModule,
    TypeOrmModule.forFeature([UserEntity, GameSessionEntity]),
  ],
  providers: [
    AppService,
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
    {
      provide: 'GameSessionRepositoryInterface',
      useClass: GameSessionRepository,
    },
  ],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
