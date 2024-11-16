import { Boost, Reward } from '../routes/_auth/rewards/~types';

export type User = {
  id: number;                           // ID пользователя в БД
  telegramId: string;                   // ID пользователя в Telegram
  firstName: string;                    // Имя пользователя
  lastName?: string;                    // Опциональная фамилия пользователя
  username?: string;                    // Опциональный username пользователя
  languageCode: string;                 // Код языка пользователя
  pointsBalance: number;                // Баланс очков пользователя
  referrer?: string;                    // Опциональный Telegram ID пригласившего пользователя
  inviteLink?: string;                  // Опциональная ссылка-приглашение
  friendsCount: number;                 // Количество друзей пользователя
  lastRequestAt: number;                // Время последнего запроса пользователя
  liquidity: number;                    // Текущая ликвидность пользователя
  dailyLiquidityPools: number;          // Количество ежедневных пулов ликвидности
  giftLiquidityPools: number;           // Количество подарочных пулов ликвидности
  datesOfVisits: string[];              // Массив дат посещений пользователя
  rewards: Reward[];                    // Массив наград пользователя
  boosts: Boost[];                      // Массив активных бустов пользователя
  collectedItems: number;               // Количество собранных предметов
  level: number;
  lastLevelUpDate?: string;
  createdAt: Date;
};
