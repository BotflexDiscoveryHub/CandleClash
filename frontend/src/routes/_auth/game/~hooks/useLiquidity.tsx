import { useEffect } from 'react';
import api from "../../../../api";
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../utils/queryOptions';
import useGameStore from "../../../../store";

export function useLiquidity(): number {
  const { data: user } = useSuspenseQuery(userQueryOptions());
  const { liquidity, isPaused, setLiquidity, setTotalPoints, setStartGame } = useGameStore();

  useEffect(() => {
    if (!isPaused) setStartGame(new Date())
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        if (liquidity > 0) {
          setLiquidity(liquidity - 1);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [liquidity, isPaused]);


  useEffect(() => {
    if (liquidity === 0 && user.liquidityPools > 0) {
      api.updateUser({
        telegramId: user.telegramId,
        liquidity: 100,
        liquidityPools: user.liquidityPools - 1,
      });
      setLiquidity(100);
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
