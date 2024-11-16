import { UserEntity } from '../db/user.entity';
import { BoostType } from '../rewards/dto/reward-progress.dto';
import { updateDatesOfVisits } from './dates';

export function calculateLiquidity(
  user: UserEntity,
  maxDailyPools: number = 5, // Максимальное количество дневных пулов
): { liquidity: number; dailyLiquidityPools: number; dailyBoostUsed: boolean } {
  const { sessions, boosts, dailyLiquidityPools, lastRequestAt } = user;

  const now = new Date();

  // Фильтруем активные бусты и учитываем только те, у которых isPercentage = true
  const activeBoosts = boosts.filter(
    (boost) => new Date(boost.expirationDate) > now,
  );
  const totalBoostMultiplier = activeBoosts
    .filter((boost) => boost.type === BoostType.LIQUIDITY) // Учитываем только LIQUIDITY бусты
    .reduce(
      (acc, boost) => acc * (1 + boost.multiplier), // Увеличиваем множитель
      1, // Начальный множитель равен 1
    );

  user.boosts = activeBoosts;

  // Если у пользователя нет сессий, возвращаем текущую ликвидность
  if (sessions.length === 0) {
    return {
      liquidity: Math.round(user.liquidity), // Текущая ликвидность
      dailyLiquidityPools,
      dailyBoostUsed: totalBoostMultiplier > 1, // Учитываем, использованы ли бусты
    };
  }

  // Восстановление ликвидности
  const lastRequestAtDate = lastRequestAt.getTime();
  const timeElapsed = (Date.now() - lastRequestAtDate) / 1000; // Время в секундах с момента последнего запроса

  if (user.liquidity < 100) {
    const baseRecoveryRate = 100 / 900; // 100 единиц за 15 минут (900 секунд)
    const boostedRecoveryRate = baseRecoveryRate * totalBoostMultiplier;

    // Восстанавливаем ликвидность
    const recoveredLiquidity = timeElapsed * boostedRecoveryRate;
    user.liquidity += recoveredLiquidity;
  }

  // Обработка переполнения ликвидности
  if (user.liquidity >= 100) {
    const fullPools = Math.floor(user.liquidity / 100); // Сколько полных пулов можно добавить
    const remainingLiquidity = user.liquidity % 100; // Остаток ликвидности

    // Обновляем количество пулов, если не превышаем максимум
    if (dailyLiquidityPools + fullPools <= maxDailyPools) {
      user.dailyLiquidityPools += fullPools;
      user.liquidity = remainingLiquidity; // Сбрасываем ликвидность до остатка
    } else {
      // Если пулы достигли максимума
      user.dailyLiquidityPools = maxDailyPools;
      user.liquidity = 100; // Устанавливаем ликвидность на максимум для отображения
    }
  }

  user.datesOfVisits = updateDatesOfVisits(user.datesOfVisits);
  user.lastRequestAt = new Date();

  // Возвращаем результат с учетом использованных бустов
  return {
    liquidity: Math.round(user.liquidity), // Округляем ликвидность
    dailyLiquidityPools: user.dailyLiquidityPools,
    dailyBoostUsed: totalBoostMultiplier > 1, // Учитываем бусты
  };
}
