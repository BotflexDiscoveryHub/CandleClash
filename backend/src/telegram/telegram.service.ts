import {
  Inject,
  Injectable,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { Markup, Telegraf } from 'telegraf';
import { BoostType } from '../rewards/dto/reward-progress.dto';
import { day } from '../db/rewards.mock';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    @Inject(AppService) private appService: AppService,
  ) {
    const WEB_APP_URL = this.configService.get<string>('WEB_APP_URL');
    const botToken = this.configService.get<string>('BOT_TOKEN');
    this.bot = new Telegraf(botToken);

    function convertToCamelCase(user) {
      return {
        telegramId: user.id,
        isBot: user.is_bot,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        languageCode: user.language_code,
      };
    }
    this.bot?.start(async (ctx, next) => {
      try {
        const userForApi = convertToCamelCase(ctx.from);
        const ref = ctx.payload;

        if (ref) {
          const now = new Date();

          const referrerId = ref.split('_')[1];
          const referrer = await appService.findByTelegramId(referrerId);
          const refBoost = {
            type: BoostType.LIQUIDITY,
            description: 'Liquidity recovery boost by X2 for 1 day',
            multiplier: 2,
            duration: day,
            isPercentage: true,
            expirationDate: new Date(now.getTime() + day * 60 * 1000),
          };

          if (referrer) {
            userForApi['referrer'] = referrerId;
            userForApi['boosts'] = [refBoost];

            referrer.giftLiquidityPools += 3;
            referrer.friendsCount += 1;
            referrer.boosts.push(refBoost);

            await appService.updateUser(referrerId, referrer);
            await ctx.reply(
              `You were invited by ${referrer.username ? referrer.username : referrer.firstName}!`,
            );
          }
        }

        await appService.createUser(userForApi);
      } catch (error) {
        console.error(error.message);
      }

      await next();
    });

    this.bot.start(async (ctx) => {
      try {
        ctx.setChatMenuButton({
          text: 'Play 🎮',
          type: 'web_app',
          web_app: { url: WEB_APP_URL },
        });

        ctx.replyWithHTML(
          `Hello, <b>${ctx.from.first_name}</b>! Welcome to the game!`,
          Markup.inlineKeyboard([Markup.button.webApp('Play 🎮', WEB_APP_URL)]),
        );
      } catch (error) {
        console.error(error.message);
      }
    });
  }

  async setWebhookWithRetry(retries = 3, delay = 1000) {
    let attempts = 0;

    while (attempts < retries) {
      try {
        const botToken = this.configService.get<string>('BOT_TOKEN');
        const botBaseUrl = this.configService.get<string>('WEB_APP_URL');
        const newWebhookUrl = `${botBaseUrl}/telegram/${botToken}`;

        const webhookInfo = await this.bot.telegram.getWebhookInfo();
        const currentWebhookUrl = webhookInfo.url;

        if (currentWebhookUrl !== newWebhookUrl) {
          console.log('Setting new webhook URL');
          await this.bot.telegram.setWebhook(newWebhookUrl);
        } else {
          console.log('Webhook URL is the same. No need to set a new one.');
        }

        return;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed: ${error.message}`);

        if (attempts >= retries) {
          throw new BadRequestException(
            `Failed to set webhook after ${retries} attempts`,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async onModuleInit() {
    try {
      await this.setWebhookWithRetry();

      setTimeout(async () => {
        await this.bot.telegram.setMyCommands([
          { command: '/start', description: 'Just start it' },
        ]);
        await this.bot.launch();
      }, 500);
    } catch (error) {
      console.error(error.message);
    }
  }

  getMyBot(): Telegraf {
    return this.bot;
  }
}
