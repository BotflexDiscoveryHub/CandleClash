import { GameSessionEntity } from '../db/game-session.entry';

export function calculateLiquidity(
  liquidity: number,
  gameSessions: GameSessionEntity[],
  boost: number = 1, // 1 по умолчанию, если буст не используется
): number {
  if (gameSessions.length === 0) {
    return liquidity; // Если нет сессий, ликвидность не меняется
  }

  // Находим последнюю сессию с сохраненной ликвидностью
  const lastSession = gameSessions.reduce((latest, session) =>
    new Date(session.endedAt) > new Date(latest.endedAt) ? session : latest,
  );

  // Если в последней сессии есть финальная ликвидность, начинаем расчет с неё
  liquidity = lastSession.finalLiquidity ?? liquidity;

  // Время окончания последней сессии в секундах
  const lastRequestAt = new Date(lastSession.endedAt).getTime() / 1000;
  const now = Date.now() / 1000;
  const timeElapsed = now - lastRequestAt;

  if (liquidity < 100) {
    // Коэффициент восстановления для достижения 100 за 15 минут (900 секунд)
    const baseRecoveryRate = 100 / 900; // 100 единиц за 15 минут
    const boostedRecoveryRate = baseRecoveryRate * boost; // Учитываем буст

    liquidity += timeElapsed * boostedRecoveryRate;

    // Ограничение на максимум 100
    if (liquidity > 100) {
      liquidity = 100;
    }
  }

  return Math.round(liquidity);
}
