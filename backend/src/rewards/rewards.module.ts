import { forwardRef, Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { AppModule } from '../app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsEntity } from '../db/rewards.entity';
import { RewardsRepository } from '../db/repositories/rewards/rewards.repository';

@Module({
  imports: [
    forwardRef(() => AppModule),
    TypeOrmModule.forFeature([RewardsEntity]),
  ],
  providers: [
    RewardsService,
    {
      provide: 'RewardsRepositoryInterface',
      useClass: RewardsRepository,
    },
  ],
  controllers: [RewardsController],
})
export class RewardsModule {}
