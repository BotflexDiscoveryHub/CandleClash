import {
  Inject,
  Injectable,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { Markup, Telegraf } from 'telegraf';
import { BoostType, BoostUserRef } from '../rewards/dto/reward-progress.dto';
import { getInviteLink } from '../utils/invite-link';

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
        const user = await appService.findByTelegramId(userForApi.telegramId);
        const ref = ctx.payload;

        if (user) {
          await next();
          return;
        }

        if (ref) {
          const now = new Date();
          const day = 24 * 60 * 60 * 1000; // 1 день в миллисекундах
          const referrerId = ref.split('_')[1];
          const referrer = await appService.findByTelegramId(referrerId);

          if (userForApi.telegramId !== referrerId && referrer) {
            const refBoost: BoostUserRef = {
              isRef: true,
              type: BoostType.LIQUIDITY,
              description: 'Liquidity recovery boost by X2 for 1 day',
              multiplier: 1, // Базово х1 уже есть, поэтому прибавляем +1 к существующему множителю
              duration: day,
              isPercentage: true,
              expirationDate: new Date(now.getTime() + day),
            };

            // Проверяем, есть ли уже буст типа LIQUIDITY
            const boostIndex = referrer.boosts.findIndex(
              (boost: BoostUserRef) => boost?.isRef,
            );

            userForApi['referrer'] = referrerId;
            userForApi['boosts'] = [refBoost];
            referrer.giftLiquidityPools += 3;
            referrer.friendsCount += 1;

            if (boostIndex !== -1) {
              const existingBoost = referrer.boosts[boostIndex];
              const expirationDate =
                existingBoost.expirationDate &&
                new Date(existingBoost.expirationDate);

              if (expirationDate) {
                // Продлеваем дату истечения буста
                referrer.boosts[boostIndex].expirationDate = new Date(
                  Math.max(expirationDate.getTime(), now.getTime()) + day,
                );
              } else {
                console.error(
                  'Boost found, but expirationDate is missing or invalid.',
                );
              }

              await appService.updateUser(referrerId, referrer);
              await ctx.reply(
                `You were invited by ${referrer.username ? referrer.username : referrer.firstName}!`,
              );
            } else {
              referrer.boosts.push(refBoost);

              await appService.updateUser(referrerId, referrer);
              await ctx.reply(
                `You were invited by ${referrer.username ? referrer.username : referrer.firstName}!`,
              );
            }
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
          Markup.inlineKeyboard([
            [Markup.button.webApp('Play 🎮', WEB_APP_URL)],
            [Markup.button.callback('🔗 Invite link', 'send_invite_link')],
            [
              Markup.button.url('📢 News', 'https://t.me/CandleClashNews'),
              Markup.button.url('🐦 Twitter', 'https://x.com/Candle_Clash'),
              Markup.button.url(
                '💬 Chat (English)',
                'https://t.me/CandleClashEN',
              ),
              Markup.button.url(
                '💬 Chat (Russian)',
                'https://t.me/CandleClashRU',
              ),
            ],
          ]),
        );
      } catch (error) {
        console.error(error.message);
      }
    });

    this.bot // Обработка нажатия на кнопку
      .on('callback_query', async (ctx) => {
        const { data } = ctx.callbackQuery as any;

        // Проверяем, какая кнопка была нажата
        if (data === 'send_invite_link') {
          const telegramId = ctx.callbackQuery.from.id || '';

          const inviteLink = getInviteLink(
            process.env.BOT_USERNAME,
            String(telegramId),
          );

          const message = `Your referral link: \`${inviteLink}\``;
          await this.bot.telegram.sendMessage(telegramId, message, {
            parse_mode: 'Markdown',
          });

          await ctx.answerCbQuery();
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

  async sendShareRefLinkButton(telegramId: string, inviteLink: string) {
    try {
      const message = `Your referral link: \`${inviteLink}\``;
      await this.bot.telegram.sendMessage(telegramId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      throw new Error('Failed to send message.');
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
