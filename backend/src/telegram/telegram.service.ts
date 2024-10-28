import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';
import { Markup, Telegraf } from 'telegraf';

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
    this.bot.start(async (ctx, next) => {
      try {
        const userForApi = convertToCamelCase(ctx.from);
        const ref = ctx.payload;

        if (ref) {
          const referrerId = ref.split('_')[1];
          const referrer = await appService.findByTelegramId(referrerId);
          userForApi['referrer'] = referrerId;
          await appService.updateUser(referrerId, {
            liquidityPools:
              referrer.liquidityPools < 10 ? referrer.liquidityPools + 1 : 10,
            friendsCount: referrer.friendsCount + 1,
          });
          await ctx.reply(
            `You were invited by ${referrer.username ? referrer.username : referrer.firstName}!`,
          );
        }
        await appService.createUser(userForApi);
      } catch (error) {
        console.error(error);
        return ctx.reply(error.message);
      }

      await next();
    });

    this.bot.start(async (ctx) => {
      ctx.setChatMenuButton({
        text: 'Play 🎮',
        type: 'web_app',
        web_app: { url: WEB_APP_URL },
      });

      ctx.replyWithHTML(
        `Hello, <b>${ctx.from.first_name}</b>! Welcome to the game!`,
        Markup.inlineKeyboard([Markup.button.webApp('Play 🎮', WEB_APP_URL)]),
      );
    });
  }

  async setWebhook() {
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
  }

  async onModuleInit() {
    await this.setWebhook();
    await this.bot.telegram.setMyCommands([
      { command: '/start', description: 'Just start it' },
    ]);
    this.bot.launch();
  }

  getMyBot(): Telegraf {
    return this.bot;
  }
}
