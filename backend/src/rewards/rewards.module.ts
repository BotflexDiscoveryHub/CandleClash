import { forwardRef, Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { AppModule } from '../app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [RewardsService],
  controllers: [RewardsController],
})
export class RewardsModule {}
