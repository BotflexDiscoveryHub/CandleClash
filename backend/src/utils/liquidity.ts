import { GameSessionEntity } from '../db/game-session.entry';

export function calculateLiquidity(
  liquidity: number,
  gameSessions: GameSessionEntity[],
): number {
  if (gameSessions.length === 0) {
    return liquidity; // Если нет сессий, ликвидность не меняется
  }

  // Находим последнюю сессию
  const lastSession = gameSessions.reduce((latest, session) =>
    new Date(session.endedAt) > new Date(latest.endedAt) ? session : latest,
  );

  // Время окончания последней сессии в секундах
  const lastRequestAt = new Date(lastSession.endedAt).getTime() / 1000;
  const now = Date.now() / 1000; // Текущее время в секундах
  const timeElapsed = now - lastRequestAt;

  if (liquidity < 100) {
    // Коэффициент восстановления для достижения 100 за 15 минут (900 секунд)
    const recoveryRate = 100 / 900; // 100 единиц за 15 минут
    liquidity += timeElapsed * recoveryRate;

    // Ограничение на максимум 100
    if (liquidity > 100) {
      liquidity = 100;
    }
  }

  return Math.round(liquidity);
}
