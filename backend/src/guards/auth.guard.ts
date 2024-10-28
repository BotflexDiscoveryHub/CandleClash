import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { validateTelegramInitDataHash } from '../utils/telegram-init-data';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const initData = request.headers['x-init-data'];
    const botToken = this.configService.get<string>('BOT_TOKEN');

    if (!initData || !validateTelegramInitDataHash(initData, botToken)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
