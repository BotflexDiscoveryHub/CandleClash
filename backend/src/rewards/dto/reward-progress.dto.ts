export interface RewardProgressDto {
  rewardName: string;
  progress: number; // Процент выполнения от 0 до 100
  goal: number; // Целевое значение (очки или дни)
  current: number; // Текущее значение (очки или дни)
  completed: boolean; // Выполнена ли награда
}
