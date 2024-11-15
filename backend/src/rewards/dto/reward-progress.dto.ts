import { RewardsEntity } from '../../db/rewards.entity';

export interface RewardUserDto extends RewardsEntity {
  current: number;
  required: number;
  additionalInfo?: string;
  isActive?: boolean;
  isCompleted: boolean;
}

export interface BoostUserDto {
  type: BoostType;
  isPercentage: boolean;
  multiplier: number;
  duration: number;
  description: string;
  expirationDate?: Date;
}

export enum RewardType {
  ACTIVITY = 'ACTIVITY', // Регулярная активность
  POINTS = 'POINTS', // Очки
  ITEMS = 'ITEMS', // Игровые предметы
  LEVEL = 'LEVEL', // Уровень
  TIME = 'TIME', // Время в игре
  CHALLENGE = 'CHALLENGE', // Челленджи
}

export enum BoostType {
  POINTS = 'POINTS', // Очки
  LIQUIDITY = 'LIQUIDITY',
}
