import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../db/user.entity';
import { ExportService } from './export.service';
import { UsersRepository } from '../db/repositories/users/users.repository';
import { ExportController } from './export.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    ExportService,
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
  ],
  controllers: [ExportController],
})
export class ExportModule {}
