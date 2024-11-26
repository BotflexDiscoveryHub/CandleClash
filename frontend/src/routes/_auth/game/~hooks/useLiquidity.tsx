import { useEffect, useState } from 'react';
import api from "../../../../api";
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../utils/queryOptions';
import useGameStore from "../../../../store";

export function useLiquidity(setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>): number {
  const { data: user, refetch, } = useSuspenseQuery(userQueryOptions());
  const { liquidity, isPaused, setLiquidity, setStartGame, setIsPaused, setIsLoading } = useGameStore();
  const { telegramId, dailyLiquidityPools, giftLiquidityPools } = user;
  const [userPools, setUserPools] = useState<
    {
      dailyLiquidityPools: number,
      giftLiquidityPools: number
    }>({
    dailyLiquidityPools,
    giftLiquidityPools
  })

  const updateUserLiquidity = async () => {
    try {
      const { dailyLiquidityPools, giftLiquidityPools } = userPools;
      const hasDailyPools = dailyLiquidityPools > 0
      const hasGiftPools = giftLiquidityPools > 0
      const pools = {
        dailyLiquidityPools: hasDailyPools ? dailyLiquidityPools - 1 : 0,
        giftLiquidityPools: !hasDailyPools && hasGiftPools ? giftLiquidityPools - 1 : giftLiquidityPools || 0,
      }

      if (!liquidity && (hasDailyPools || hasGiftPools)) {
        setLiquidity(100);
        await api.updateUser({
          ...pools,
          telegramId,
          liquidity: 100,
        });
      } else {
        setIsPaused(true)
        setIsModalVisible(true)
      }
      setUserPools(pools);
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
          (async () => {
            await updateUserLiquidity()
          })()
        }
      }, 3000);

      return () => clearInterval(interval);
    } else {
      (async () => {
        await api.updateUser({
          telegramId,
          liquidity,
          dailyLiquidityPools: userPools.dailyLiquidityPools,
          giftLiquidityPools: userPools.giftLiquidityPools,
        });
        await refetch();
        setIsLoading(false)
      })()
    }
  }, [liquidity, isPaused]);

  return liquidity;
}
