// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { DBModule } from './db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './db/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from './db/repositories/users.repository';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DBModule,
    TelegramModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    AppService,
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
  ],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
