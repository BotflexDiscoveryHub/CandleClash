// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersRepository } from './db/repositories/users/users.repository';

@Module({
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UsersRepository,
    },
  ],
  exports: ['UserRepositoryInterface'],
})
export class UsersModule {}
