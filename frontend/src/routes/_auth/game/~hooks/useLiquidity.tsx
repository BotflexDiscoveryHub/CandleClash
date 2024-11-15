import { useEffect } from 'react';
import api from "../../../../api";
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../utils/queryOptions';
import useGameStore from "../../../../store";

export function useLiquidity(setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>): number {
  const { data: user } = useSuspenseQuery(userQueryOptions());
  const { liquidity, isPaused, setLiquidity, setTotalPoints, setStartGame, setIsPaused } = useGameStore();
  const { dailyLiquidityPools, giftLiquidityPools } = user;

  const updateUserLiquidity = async () => {
    try {
      const hasDailyPools = dailyLiquidityPools > 0
      const hasGiftPools = giftLiquidityPools > 0

      if (!liquidity && (hasDailyPools || hasGiftPools)) {
        await api.updateUser({
          telegramId: user.telegramId,
          liquidity: 100,
          dailyLiquidityPools: hasDailyPools ? dailyLiquidityPools - 1 : 0,
          giftLiquidityPools: !hasDailyPools && hasGiftPools ? giftLiquidityPools - 1 : giftLiquidityPools || 0,
        });
        setLiquidity(100);
      } else {
        setIsPaused(true)
        setIsModalVisible(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!isPaused) setStartGame(new Date())
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        if (liquidity > 0) {
          setLiquidity(liquidity - 1);
        } else {
          updateUserLiquidity()
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [liquidity, isPaused]);

  useEffect(() => {
    if (user.telegramId) {
      setLiquidity(user.liquidity)
      setTotalPoints(user.pointsBalance)
    }
  }, [user]);

  return liquidity;
}
