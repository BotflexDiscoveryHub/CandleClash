import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { AppModule } from '../app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
