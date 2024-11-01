export interface RewardProgressDto {
  rewardId: string;
  title: string;
  current: number;
  required: number;
  additionalInfo?: string;
}

export enum RewardType {
  ACTIVITY = 'ACTIVITY', // Регулярная активность
  POINTS = 'POINTS', // Очки
  ITEMS = 'ITEMS', // Игровые предметы
  LEVEL = 'LEVEL', // Уровень
  TIME = 'TIME', // Время в игре
  CHALLENGE = 'CHALLENGE', // Челленджи
}
